# OpenClaw Splunk Logger

OpenClaw integration for logging workflow and task events to Splunk with OpenTelemetry support.

## Features

✅ **Dual Mode**: Works as both a Hook (simple) and Plugin (advanced)  
✅ **Splunk HEC Integration**: Direct logging to Splunk HTTP Event Collector  
✅ **OpenTelemetry Support**: Distributed tracing and metrics  
✅ **Tool Call Tracking**: Monitor all tool invocations  
✅ **LLM Metrics**: Track token usage, costs, and performance  
✅ **Message Events**: Log all inbound/outbound messages  
✅ **Agent Lifecycle**: Track agent sessions and workflows  

## Quick Start

### Option 1: Hook Mode (Simple)

Best for basic event logging.

```bash
npm install openclaw-splunk-logger
openclaw hooks install openclaw-splunk-logger
openclaw hooks enable splunk-log-hook
```

**Configuration** (environment variables):
```bash
export SPLUNK_TOKEN="your-hec-token"
export SPLUNK_URL="https://splunk.example.com:8088"
```

### Option 2: Plugin Mode (Advanced)

Best for full observability with OpenTelemetry.

```bash
npm install openclaw-splunk-logger
openclaw plugins install openclaw-splunk-logger
```

**Configuration** (`~/.openclaw/config.json`):
```json
{
  "plugins": {
    "entries": {
      "splunk-logger": {
        "enabled": true,
        "config": {
          "splunk": {
            "token": "your-hec-token",
            "url": "https://splunk.example.com:8088",
            "source": "openclaw",
            "sourcetype": "openclaw:plugin"
          },
          "opentelemetry": {
            "enabled": true,
            "serviceName": "openclaw",
            "exporters": ["splunk"]
          },
          "events": {
            "tools": true,
            "llm": true,
            "messages": true,
            "agent": true
          }
        }
      }
    }
  }
}
```

## Installation

```bash
npm install openclaw-splunk-logger
```

## Usage

```typescript
import { createSplunkHook } from 'openclaw-splunk-logger';

const splunkHook = createSplunkHook({
  token: 'YOUR_SPLUNK_HEC_TOKEN',
  url: 'https://your-splunk-instance.com:8088',
  source: 'openclaw',
  sourcetype: 'openclaw:hook',
  host: 'your-host',
  logging: {
    workflowStart: true,
    workflowComplete: true,
    workflowError: true,
    taskStart: true,
    taskComplete: true,
    taskError: true,
    stateChange: true,
    customEvents: true,
  },
});

// Register with OpenClaw
openclaw.registerHook(splunkHook);
```

## Configuration

### Required Options

- `token` (string): Splunk HTTP Event Collector (HEC) token
- `url` (string): Splunk HEC endpoint URL

### Optional Options

- `source` (string): Event source (default: 'openclaw')
- `sourcetype` (string): Event source type (default: 'openclaw:hook')
- `host` (string): Host identifier
- `maxRetries` (number): Max retry attempts (default: 3)
- `maxBatchCount` (number): Max events per batch (default: 10)
- `maxBatchSize` (number): Max batch size in bytes (default: 1024)

### Logging Options

Disable specific log types by setting them to `false`:

```typescript
logging: {
  workflowStart: false,    // Disable workflow start logs
  workflowComplete: true,
  workflowError: true,
  taskStart: false,        // Disable task start logs
  taskComplete: true,
  taskError: true,
  stateChange: false,      // Disable state change logs
  customEvents: true,
}
```

## Events Logged

- **workflow.start**: When a workflow begins execution
- **workflow.complete**: When a workflow completes successfully
- **workflow.error**: When a workflow encounters an error
- **task.start**: When a task begins execution
- **task.complete**: When a task completes successfully
- **task.error**: When a task encounters an error
- **state.change**: When workflow state changes
- **custom.{eventName}**: Custom events triggered by your workflow

## License

MIT
