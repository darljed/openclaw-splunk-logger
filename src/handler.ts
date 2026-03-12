import * as SplunkLogger from 'splunk-logging';

interface SplunkConfig {
  token: string;
  url: string;
  source?: string;
  sourcetype?: string;
  host?: string;
  maxRetries?: number;
  maxBatchCount?: number;
  maxBatchSize?: number;
}

interface HookEvent {
  type: string;
  action: string;
  sessionKey: string;
  timestamp: Date;
  messages: string[];
  context: Record<string, any>;
}

let logger: any;
let config: SplunkConfig;

function initLogger(hookConfig: SplunkConfig) {
  if (logger) return;
  
  config = hookConfig;
  logger = new SplunkLogger.Logger({
    token: config.token,
    url: config.url,
    source: config.source || 'openclaw',
    sourcetype: config.sourcetype || 'openclaw:hook',
    host: config.host,
    maxRetries: config.maxRetries || 3,
    maxBatchCount: config.maxBatchCount || 10,
    maxBatchSize: config.maxBatchSize || 1024,
  });

  logger.error = (err: Error) => {
    console.error('[splunk-logger] Error:', err);
  };
}

function sendLog(event: HookEvent) {
  if (!logger) return;

  const payload = {
    message: {
      timestamp: event.timestamp.toISOString(),
      type: event.type,
      action: event.action,
      sessionKey: event.sessionKey,
      context: event.context,
    },
    severity: 'info',
  };

  logger.send(payload, (err: Error) => {
    if (err) {
      console.error('[splunk-logger] Failed to send:', err.message);
    }
  });
}

export default async function handler(event: HookEvent) {
  try {
    // Initialize logger on first use with config from environment
    if (!logger) {
      const token = process.env.SPLUNK_TOKEN;
      const url = process.env.SPLUNK_URL;
      
      if (!token || !url) {
        console.error('[splunk-logger] Missing SPLUNK_TOKEN or SPLUNK_URL');
        return;
      }

      initLogger({
        token,
        url,
        source: process.env.SPLUNK_SOURCE,
        sourcetype: process.env.SPLUNK_SOURCETYPE,
        host: process.env.SPLUNK_HOST,
        maxRetries: process.env.SPLUNK_MAX_RETRIES ? parseInt(process.env.SPLUNK_MAX_RETRIES) : undefined,
        maxBatchCount: process.env.SPLUNK_MAX_BATCH_COUNT ? parseInt(process.env.SPLUNK_MAX_BATCH_COUNT) : undefined,
        maxBatchSize: process.env.SPLUNK_MAX_BATCH_SIZE ? parseInt(process.env.SPLUNK_MAX_BATCH_SIZE) : undefined,
      });
    }

    sendLog(event);
  } catch (err) {
    console.error('[splunk-logger] Handler error:', err);
  }
}
