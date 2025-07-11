import structlog
import logging
import sys
import uuid

# Processor to add a request_id to every log if present in context
class RequestIdProcessor:
    def __call__(self, logger, method_name, event_dict):
        request_id = event_dict.get('request_id')
        if not request_id:
            # Try to get from structlog contextvars (if set by middleware)
            try:
                import structlog.contextvars
                request_id = structlog.contextvars.get_contextvars().get('request_id')
            except Exception:
                request_id = None
        if request_id:
            event_dict['request_id'] = request_id
        return event_dict

# Central structlog configuration
structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        RequestIdProcessor(),
        structlog.processors.JSONRenderer(),
    ],
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logging.basicConfig(
    format="%(message)s",
    stream=sys.stdout,
    level=logging.INFO
)

def get_logger(name=None):
    """Get a structlog logger, optionally with a name for context."""
    if name:
        return structlog.get_logger(name)
    return structlog.get_logger() 