# OpenClaw Integration Options

This package can be used in **two ways**: as a **Hook** or as a **Plugin**.

## Option 1: Hook (Simpler)

**Best for**: Basic event logging to Splunk

### Installation
```bash
npm install openclaw-splunk-logger
openclaw hooks install openclaw-splunk-logger
openclaw hooks enable splunk-log-hook
```

### Configuration
Set environment variables:
```bash
SPLUNK_TOKEN=your-token
SPLUNK_URL=https://splunk.example.com:8088
```

### Events Captured
- Command events (new, reset, stop)
- Session events (compact)
- Agent bootstrap
- Gateway startup
- Message events (received, sent)

---

## Option 2: Plugin (Advanced)

**Best for**: Full observability with OpenTelemetry support

### Installation
```bash
npm install openclaw-splunk-logger
openclaw plugins install openclaw-splunk-logger
```

### Configuration
Edit `~/.openclaw/config.json`:
```json
{
  "plugins": {
    "entries": {
      "splunk-logger": {
        "enabled": true,
        "config": {
          "splunk": {
            "token": "your-token",
            "url": "https://splunk.example.com:8088"
          },
          "opentelemetry": {
            "enabled": true,
            "exporters": ["splunk", "otlp"]
          }
        }
      }
    }
  }
}
```

### Additional Features
- Tool call tracking (before/after)
- LLM usage metrics (tokens, cost, duration)
- Agent lifecycle events
- OpenTelemetry traces and spans
- Structured logging with context
- Performance metrics

---

## Comparison

| Feature | Hook | Plugin |
|---------|------|--------|
| Setup Complexity | Simple | Moderate |
| Configuration | Environment vars | Config file + schema |
| Events | Basic lifecycle | Full SDK access |
| Tool Tracking | ❌ | ✅ |
| LLM Metrics | ❌ | ✅ |
| OpenTelemetry | ❌ | ✅ |
| Performance Impact | Minimal | Low |
| Customization | Limited | Extensive |

---

## Recommendation

- **Start with Hook** if you just need basic event logging
- **Upgrade to Plugin** when you need:
  - Tool call observability
  - LLM cost tracking
  - OpenTelemetry integration
  - Advanced metrics and tracing
