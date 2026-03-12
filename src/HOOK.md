---
name: splunk-log-hook
description: "Logs all OpenClaw workflow and task events to Splunk"
homepage: https://github.com/yourusername/openclaw-splunk-logger
metadata:
  {
    "openclaw":
      {
        "emoji": "📊",
        "events":
          [
            "command",
            "command:new",
            "command:reset",
            "command:stop",
            "session:compact:before",
            "session:compact:after",
            "agent:bootstrap",
            "gateway:startup",
            "message",
            "message:received",
            "message:sent",
          ],
        "requires": { "env": ["SPLUNK_TOKEN", "SPLUNK_URL"] },
      },
  }
---

# Splunk Logger Hook

Automatically logs all OpenClaw workflow and task events to Splunk using the Splunk HTTP Event Collector (HEC).

## What It Does

- Captures all command events (new, reset, stop)
- Logs session lifecycle events
- Tracks agent bootstrap events
- Records gateway startup
- Logs all message events (received/sent)
- Sends structured logs to Splunk HEC

## Requirements

- Splunk HTTP Event Collector (HEC) token
- Splunk HEC endpoint URL

## Configuration

Set the following environment variables:

### Required

- `SPLUNK_TOKEN`: Your Splunk HEC token
- `SPLUNK_URL`: Your Splunk HEC endpoint (e.g., `https://splunk.example.com:8088`)

### Optional

- `SPLUNK_SOURCE`: Event source (default: `openclaw`)
- `SPLUNK_SOURCETYPE`: Event source type (default: `openclaw:hook`)
- `SPLUNK_HOST`: Host identifier
- `SPLUNK_MAX_RETRIES`: Max retry attempts (default: `3`)
- `SPLUNK_MAX_BATCH_COUNT`: Max events per batch (default: `10`)
- `SPLUNK_MAX_BATCH_SIZE`: Max batch size in bytes (default: `1024`)

## Example Configuration

Add to your OpenClaw config or `.env` file:

```bash
SPLUNK_TOKEN=your-hec-token-here
SPLUNK_URL=https://splunk.example.com:8088
SPLUNK_SOURCE=openclaw
SPLUNK_SOURCETYPE=openclaw:hook
SPLUNK_HOST=production
```

## Enable

```bash
openclaw hooks enable splunk-log-hook
```

## Log Format

Events are sent to Splunk in the following format:

```json
{
  "timestamp": "2024-01-16T14:30:00.000Z",
  "type": "command",
  "action": "new",
  "sessionKey": "agent:main:main",
  "context": {
    "sessionId": "abc123",
    "senderId": "+1234567890",
    "source": "telegram"
  }
}
```
