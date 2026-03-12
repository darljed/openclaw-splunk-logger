# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-16

### Added
- Initial release
- Support for all OpenClaw command events (new, reset, stop)
- Support for session lifecycle events (compact:before, compact:after)
- Support for agent bootstrap events
- Support for gateway startup events
- Support for message events (received, sent)
- Splunk HTTP Event Collector (HEC) integration
- Environment variable configuration
- Automatic batching and retry logic
- Comprehensive documentation

### Configuration
- SPLUNK_TOKEN (required)
- SPLUNK_URL (required)
- SPLUNK_SOURCE (optional)
- SPLUNK_SOURCETYPE (optional)
- SPLUNK_HOST (optional)
- SPLUNK_MAX_RETRIES (optional)
- SPLUNK_MAX_BATCH_COUNT (optional)
- SPLUNK_MAX_BATCH_SIZE (optional)
