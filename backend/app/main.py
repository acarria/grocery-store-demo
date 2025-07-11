import logging
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import uvicorn
from fastapi import Request, APIRouter
import structlog.contextvars
import uuid

from app.core.config import settings
from app.api.v1.api import api_router
from app.core.database import engine
from app.models import Base
from app.core.logging import get_logger

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SaveGo Wholesale API",
    description="A modern wholesale grocery API with inventory management and order processing",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local frontend
        # Add more origins here if needed, e.g. "http://127.0.0.1:3000", "http://frontend:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted host middleware - allow localhost
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "localhost:8000", "127.0.0.1:8000"]
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")

# Add request/response logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(
        "http.request",
        method=request.method,
        url=str(request.url),
        headers=dict(request.headers),
        remote_addr=request.client.host if request.client else None
    )
    response = await call_next(request)
    logger.info(
        "http.response",
        status_code=response.status_code,
        method=request.method,
        url=str(request.url)
    )
    return response

@app.middleware("http")
async def add_request_id_to_log_context(request: Request, call_next):
    request_id = str(uuid.uuid4())
    structlog.contextvars.bind_contextvars(request_id=request_id)
    try:
        response = await call_next(request)
    finally:
        structlog.contextvars.unbind_contextvars("request_id", "user_id")
    return response

logger = get_logger("main")

# Example: log startup
# logger.info("savego.startup", event="Backend started")

@app.get("/")
async def root():
    return {
        "message": "Welcome to SaveGo Wholesale API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Logs API endpoint for frontend log ingestion
@app.post("/api/v1/logs")
async def ingest_logs(request: Request):
    data = await request.json()
    logger.info("frontend.log", **data)
    # TODO: Forward to DynamoDB/Splunk here
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 