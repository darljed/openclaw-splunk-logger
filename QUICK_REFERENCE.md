# Quick Reference

## Installation

```bash
npm install openclaw-splunk-logger
```

## Hook Mode (Simple)

### Install
```bash
openclaw hooks install openclaw-splunk-logger
openclaw hooks enable splunk-log-hook
```

### Configure
```bash
export SPLUNK_TOKEN="your-hec-token"
export SPLUNK_URL="https://splunk.example.com:8088"
export SPLUNK_SOURCE="openclaw"              # optional
export SPLUNK_SOURCETYPE="openclaw:hook"     # optional
export SPLUNK_HOST="production"              # optional
```

### Verify
```bash
openclaw hooks list
openclaw hooks info splunk-log-hook
```

## Plugin Mode (Advanced)

### Install
```bash
openclaw plugins install openclaw-splunk-logger
```

### Configure
Edit `~/.openclaw/config.json`:
```json
{
  "plugins": {
    "entries": {
      "splunk-logger": {
        "enabled": true,
        "config": {
          "splunk": {
            "token": "your-hec-token",
            "url": "https://splunk.example.com:8088"
          },
          "opentelemetry": {
            "enabled": true
          }
        }
      }
    }
  }
}
```

### Verify
```bash
openclaw plugins list
```

## Splunk Queries

### View All Events
```spl
index=main sourcetype="openclaw:*"
| table _time type action sessionKey
```

### Tool Calls
```spl
index=main sourcetype="openclaw:plugin" type="tool.*"
| stats count by toolName
```

### LLM Costs
```spl
index=main sourcetype="openclaw:plugin" type="llm.usage"
| stats sum(costUsd) as totalCost by model
```

### Failed Operations
```spl
index=main sourcetype="openclaw:*" success=false
| table _time type error
```

### Agent Sessions
```spl
index=main sourcetype="openclaw:plugin" type="agent.*"
| transaction sessionKey startswith="agent.start" endswith="agent.end"
| table sessionKey duration
```

## Troubleshooting

### Hook not logging?
```bash
# Check if enabled
openclaw hooks check

# Check environment variables
echo $SPLUNK_TOKEN
echo $SPLUNK_URL

# Check gateway logs
tail -f ~/.openclaw/logs/gateway.log | grep splunk
```

### Plugin not working?
```bash
# Check plugin status
openclaw plugins list

# Verify config
cat ~/.openclaw/config.json | jq '.plugins.entries["splunk-logger"]'

# Check gateway logs
tail -f ~/.openclaw/logs/gateway.log | grep splunk-logger
```

### Test Splunk connectivity
```bash
curl -k https://splunk.example.com:8088/services/collector/event \
  -H "Authorization: Splunk your-hec-token" \
  -d '{"event": "test", "sourcetype": "manual"}'
```

## Event Types

### Hook Mode
- `command` - Command events
- `session` - Session lifecycle
- `agent` - Agent bootstrap
- `gateway` - Gateway startup
- `message` - Messages

### Plugin Mode (Additional)
- `tool.start` - Tool invocation start
- `tool.end` - Tool completion
- `llm.usage` - LLM API calls
- `agent.start` - Agent session start
- `agent.end` - Agent session end

## Common Configurations

### Minimal (Hook)
```bash
export SPLUNK_TOKEN="abc123"
export SPLUNK_URL="https://splunk.example.com:8088"
```

### Production (Plugin)
```json
{
  "plugins": {
    "entries": {
      "splunk-logger": {
        "enabled": true,
        "config": {
          "splunk": {
            "token": "abc123",
            "url": "https://splunk.example.com:8088",
            "source": "openclaw-prod",
            "sourcetype": "openclaw:plugin",
            "host": "prod-gateway-01"
          },
          "opentelemetry": {
            "enabled": true,
            "serviceName": "openclaw-production",
            "exporters": ["splunk", "otlp"]
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

### Development (Plugin)
```json
{
  "plugins": {
    "entries": {
      "splunk-logger": {
        "enabled": true,
        "config": {
          "splunk": {
            "token": "dev-token",
            "url": "https://splunk-dev.example.com:8088",
            "source": "openclaw-dev"
          },
          "opentelemetry": {
            "enabled": false
          },
          "events": {
            "tools": true,
            "llm": false,
            "messages": false,
            "agent": true
          }
        }
      }
    }
  }
}
```

## Support

- **Documentation**: See README.md
- **Architecture**: See ARCHITECTURE.md
- **Publishing**: See PUBLISHING.md
- **Issues**: https://github.com/yourusername/openclaw-splunk-logger/issues
