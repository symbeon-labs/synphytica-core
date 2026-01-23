"""
SynPhytica REST API - Main Application
FastAPI application with endpoints for formulation optimization
"""
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import time
import logging

from api.models import (
    OptimizationRequest,
    OptimizationResponse,
    CompoundsResponse,
    HealthResponse,
    ErrorResponse
)
from api.services.optimization_service import OptimizationService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="SynPhytica API",
    description="Computational framework for personalized phytotherapeutic formulations",
    version="0.2.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate Limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Initialize services
optimization_service = OptimizationService()


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    logger.info("🚀 Starting SynPhytica API...")
    logger.info(f"📚 Library loaded with {optimization_service.library.size()} compounds")
    logger.info("✅ API ready")


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": "SynPhytica API v0.2.0",
        "status": "online",
        "docs": "/docs",
        "health": "/api/v1/health"
    }


@app.get(
    "/api/v1/health",
    response_model=HealthResponse,
    tags=["Health"]
)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        version="0.2.0",
        model_loaded=optimization_service.model is not None,
        library_size=optimization_service.library.size()
    )


@app.get(
    "/api/v1/compounds",
    response_model=CompoundsResponse,
    tags=["Compounds"]
)
@limiter.limit("30/minute")
async def get_compounds(request: Request):
    """Get list of available compounds"""
    try:
        compounds_data = optimization_service.get_compounds_info()
        return CompoundsResponse(
            compounds=compounds_data,
            total_count=len(compounds_data)
        )
    except Exception as e:
        logger.error(f"Error fetching compounds: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post(
    "/api/v1/optimize",
    response_model=OptimizationResponse,
    tags=["Optimization"]
)
@limiter.limit("10/minute")
async def optimize_formulation(
    request: Request,
    optimization_request: OptimizationRequest
):
    """
    Optimize formulation based on user profile
    
    This endpoint runs the hybrid NSGA-II + PSO optimization algorithm
    to find optimal compound combinations for the given therapeutic goals.
    
    **Note:** This operation may take 10-30 seconds depending on parameters.
    """
    start_time = time.time()
    
    try:
        logger.info(f"🔬 Starting optimization for goals: {optimization_request.user_profile.therapeutic_goals}")
        
        # Run optimization
        formulations = await optimization_service.optimize(optimization_request)
        
        computation_time = time.time() - start_time
        logger.info(f"✅ Optimization complete in {computation_time:.2f}s")
        
        return OptimizationResponse(
            formulations=formulations,
            computation_time_seconds=computation_time
        )
        
    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Optimization error: {e}")
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            detail=str(exc),
            error_type=type(exc).__name__
        ).dict()
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
