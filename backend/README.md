## Logging

This backend uses [structlog](https://www.structlog.org/) for robust, context-aware logging. All logs are output in JSON format and include a unique `request_id` for each HTTP request, enabling easy tracing across the system.

### Usage

To log in any backend file, import the logger from the logging utility:

```python
from app.core.logging import get_logger
logger = get_logger("your_module_name")

logger.info("event_name", key1="value1", key2="value2")
```

### Request IDs

Every HTTP request is automatically assigned a unique `request_id` (UUID), which is included in all logs for that request. This enables you to trace all logs related to a single request across the system.

### Adding Context

You can add additional context to your logs using structlog's contextvars or by passing extra key-value pairs to your log calls. For advanced usage, see the [structlog documentation](https://www.structlog.org/en/stable/contextvars.html).

### Best Practices
- Use structured logging (key-value pairs) for all log events.
- Always include meaningful event names and context.
- Use the provided logger from `app.core.logging` for consistency. 