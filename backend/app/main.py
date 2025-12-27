from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import calculation, coefficient
from app.database import engine, Base
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create tables
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="API for Vietnamese Social Insurance (BHXH) one-time payment calculation",
    version=settings.APP_VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(
    calculation.router,
    prefix="/api/v1",
    tags=["calculation"]
)
app.include_router(
    coefficient.router,
    prefix="/api/v1",
    tags=["coefficient"]
)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running"
    }


@app.get("/api/v1/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "version": settings.APP_VERSION
    }


@app.on_event("startup")
async def startup_event():
    """Startup event handler"""
    logger.info(f"{settings.APP_NAME} v{settings.APP_VERSION} starting up...")


@app.on_event("shutdown")
async def shutdown_event():
    """Shutdown event handler"""
    logger.info(f"{settings.APP_NAME} shutting down...")
