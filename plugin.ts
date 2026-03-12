import * as SplunkLogger from 'splunk-logging';
import { trace, SpanStatusCode } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME } from '@opentelemetry/semantic-conventions';

let logger: any;
let otelSdk: NodeSDK | null = null;
let tracer: any;
let config: any;

function initSplunk(splunkConfig: any) {
  logger = new SplunkLogger.Logger({
    token: splunkConfig.token,
    url: splunkConfig.url,
    source: splunkConfig.source || 'openclaw',
    sourcetype: splunkConfig.sourcetype || 'openclaw:plugin',
    host: splunkConfig.host,
    maxRetries: splunkConfig.maxRetries || 3,
    maxBatchCount: splunkConfig.maxBatchCount || 10,
    maxBatchSize: splunkConfig.maxBatchSize || 1024,
  });

  logger.error = (err: Error) => {
    console.error('[splunk-logger] Error:', err);
  };
}

function initOpenTelemetry(otelConfig: any, splunkConfig: any) {
  const serviceName = otelConfig.serviceName || 'openclaw';
  const exporters = otelConfig.exporters || ['splunk'];

  const traceExporter = new OTLPTraceExporter({
    url: splunkConfig.url.replace(':8088', ':9411') + '/api/v2/spans',
  });

  otelSdk = new NodeSDK({
    resource: new Resource({
      [SEMRESATTRS_SERVICE_NAME]: serviceName,
    }),
    traceExporter,
  });

  otelSdk.start();
  tracer = trace.getTracer('openclaw-splunk-logger');
}

function sendLog(event: any) {
  if (!logger) return;

  const payload = {
    message: event,
    severity: event.success === false ? 'error' : 'info',
  };

  logger.send(payload, (err: Error) => {
    if (err) {
      console.error('[splunk-logger] Failed to send:', err.message);
    }
  });
}

export default {
  id: 'splunk-logger',
  name: 'OpenClaw Splunk Logger',
  description: 'Logs OpenClaw events to Splunk with OpenTelemetry support',
  
  register(api: any) {
    // Get configuration
    config = api.getConfig?.() || {};
    
    if (!config.enabled) {
      console.log('[splunk-logger] Plugin disabled');
      return;
    }

    if (!config.splunk?.token || !config.splunk?.url) {
      console.error('[splunk-logger] Missing Splunk token or URL');
      return;
    }

    // Initialize Splunk
    initSplunk(config.splunk);

    // Initialize OpenTelemetry if enabled
    if (config.opentelemetry?.enabled) {
      initOpenTelemetry(config.opentelemetry, config.splunk);
    }

    const eventConfig = config.events || {
      tools: true,
      llm: true,
      messages: true,
      agent: true,
    };

    // Tool events
    if (eventConfig.tools) {
      api.on('before_tool_call', (evt: any, ctx: any) => {
        const span = tracer?.startSpan(`tool.${evt.toolName}`);
        
        sendLog({
          type: 'tool.start',
          toolName: evt.toolName,
          params: evt.params,
          sessionKey: ctx.sessionKey,
          agentId: ctx.agentId,
          timestamp: new Date().toISOString(),
        });

        span?.end();
      });

      api.on('after_tool_call', (evt: any, ctx: any) => {
        sendLog({
          type: 'tool.end',
          toolName: evt.toolName,
          durationMs: evt.durationMs,
          success: !evt.error,
          error: evt.error,
          sessionKey: ctx.sessionKey,
          agentId: ctx.agentId,
          timestamp: new Date().toISOString(),
        });
      });
    }

    // Message events
    if (eventConfig.messages) {
      api.on('message_received', (evt: any, ctx: any) => {
        sendLog({
          type: 'message.in',
          channel: ctx.channelId,
          from: evt.from,
          contentLength: evt.content?.length || 0,
          timestamp: new Date().toISOString(),
        });
      });

      api.on('message_sent', (evt: any, ctx: any) => {
        sendLog({
          type: 'message.out',
          channel: ctx.channelId,
          to: evt.to,
          success: evt.success,
          error: evt.error,
          timestamp: new Date().toISOString(),
        });
      });
    }

    // Agent events
    if (eventConfig.agent) {
      api.on('before_agent_start', (evt: any, ctx: any) => {
        const span = tracer?.startSpan('agent.session');
        
        sendLog({
          type: 'agent.start',
          sessionKey: ctx.sessionKey,
          agentId: ctx.agentId,
          promptLength: evt.prompt?.length || 0,
          timestamp: new Date().toISOString(),
        });

        // Store span for later
        if (span) {
          (ctx as any)._span = span;
        }
      });

      api.on('agent_end', (evt: any, ctx: any) => {
        const span = (ctx as any)._span;
        
        sendLog({
          type: 'agent.end',
          sessionKey: ctx.sessionKey,
          agentId: ctx.agentId,
          success: evt.success,
          durationMs: evt.durationMs,
          error: evt.error,
          timestamp: new Date().toISOString(),
        });

        if (span) {
          if (!evt.success) {
            span.setStatus({ code: SpanStatusCode.ERROR, message: evt.error });
          }
          span.end();
        }
      });
    }

    // LLM usage events
    if (eventConfig.llm && api.on) {
      api.on('llm_usage', (evt: any, ctx: any) => {
        sendLog({
          type: 'llm.usage',
          provider: evt.provider,
          model: evt.model,
          inputTokens: evt.inputTokens,
          outputTokens: evt.outputTokens,
          cacheTokens: evt.cacheTokens,
          durationMs: evt.durationMs,
          costUsd: evt.costUsd,
          sessionKey: ctx.sessionKey,
          timestamp: new Date().toISOString(),
        });
      });
    }

    console.log('[splunk-logger] Plugin initialized');
  },

  async shutdown() {
    if (otelSdk) {
      await otelSdk.shutdown();
    }
  },
};
