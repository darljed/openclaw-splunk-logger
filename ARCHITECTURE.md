# Architecture: Hook vs Plugin Mode

## Overview

This package supports **two integration modes** with OpenClaw:

1. **Hook Mode**: Lightweight event listener
2. **Plugin Mode**: Full SDK integration with OpenTelemetry

## Hook Mode

### Architecture
```
OpenClaw Gateway
    ↓ (emits events)
Hook Handler (handler.ts)
    ↓ (sends logs)
Splunk HEC
```

### Files
- `src/HOOK.md` - Hook metadata
- `src/handler.ts` - Event handler
- Configuration via environment variables

### Events Captured
- `command:*` - Command events (new, reset, stop)
- `session:compact:*` - Session compaction
- `agent:bootstrap` - Agent initialization
- `gateway:startup` - Gateway start
- `message:*` - Message events

### Pros
- ✅ Simple setup (just env vars)
- ✅ Minimal dependencies
- ✅ Low overhead
- ✅ Easy to understand

### Cons
- ❌ No tool call tracking
- ❌ No LLM metrics
- ❌ No OpenTelemetry
- ❌ Limited context

## Plugin Mode

### Architecture
```
OpenClaw Gateway
    ↓ (Plugin SDK)
Plugin (plugin.ts)
    ├─→ Splunk Logger → Splunk HEC
    └─→ OpenTelemetry SDK → Splunk APM / OTLP Collector
```

### Files
- `openclaw.plugin.json` - Plugin schema
- `plugin.ts` - Plugin implementation
- Configuration via `~/.openclaw/config.json`

### Events Captured
All Hook events PLUS:
- `before_tool_call` - Tool invocation start
- `after_tool_call` - Tool completion with duration
- `llm_usage` - LLM API calls with tokens/cost
- `before_agent_start` - Agent session start
- `agent_end` - Agent session end with metrics

### OpenTelemetry Integration
- **Traces**: Distributed tracing for agent sessions
- **Spans**: Individual tool calls and operations
- **Metrics**: Token usage, costs, durations
- **Context Propagation**: Correlate events across services

### Pros
- ✅ Full observability
- ✅ Tool call tracking
- ✅ LLM cost analysis
- ✅ OpenTelemetry traces
- ✅ Rich context
- ✅ Performance metrics
- ✅ Configurable event filtering

### Cons
- ❌ More complex setup
- ❌ Additional dependencies
- ❌ Slightly higher overhead

## Event Comparison

| Event Type | Hook | Plugin | Details |
|------------|------|--------|---------|
| Commands | ✅ | ✅ | /new, /reset, /stop |
| Sessions | ✅ | ✅ | Lifecycle events |
| Messages | ✅ | ✅ | In/out messages |
| Tools | ❌ | ✅ | Tool invocations |
| LLM | ❌ | ✅ | Token usage, costs |
| Agent | ❌ | ✅ | Session metrics |
| Traces | ❌ | ✅ | OpenTelemetry spans |

## Data Format

### Hook Mode Output
```json
{
  "timestamp": "2024-01-16T14:30:00.000Z",
  "type": "command",
  "action": "new",
  "sessionKey": "agent:main:main",
  "context": {
    "sessionId": "abc123",
    "senderId": "+1234567890"
  }
}
```

### Plugin Mode Output
```json
{
  "type": "tool.end",
  "toolName": "bash",
  "durationMs": 1234,
  "success": true,
  "sessionKey": "agent:main:main",
  "agentId": "main",
  "timestamp": "2024-01-16T14:30:00.000Z",
  "traceId": "a1b2c3d4e5f6...",
  "spanId": "1234567890ab..."
}
```

## Use Cases

### Hook Mode - Best For:
- Simple audit logging
- Compliance requirements
- Basic monitoring
- Getting started quickly
- Minimal infrastructure

### Plugin Mode - Best For:
- Production observability
- Performance monitoring
- Cost tracking
- Debugging complex workflows
- Integration with APM tools
- Distributed tracing
- SRE/DevOps teams

## Migration Path

Start with **Hook Mode** for simplicity, then upgrade to **Plugin Mode** when you need:

1. Tool call visibility
2. LLM cost tracking
3. Performance metrics
4. OpenTelemetry integration
5. Advanced debugging

Both modes can coexist, but Plugin Mode is recommended for production.

## Performance Impact

### Hook Mode
- Memory: ~5MB
- CPU: <1%
- Network: Batched HEC requests

### Plugin Mode
- Memory: ~15MB (includes OpenTelemetry SDK)
- CPU: <2%
- Network: HEC + OTLP exports

Both modes use async logging to minimize impact on agent performance.
