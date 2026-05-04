from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.core.config import settings

# 🔹 Create FastAPI App
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG,
    docs_url="/docs",        # Swagger UI
    redoc_url="/redoc"       # ReDoc UI
)

# 🔹 CORS Middleware (Frontend Connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,   # ✅ parsed list from .env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 Register API Routes
app.include_router(router, prefix=settings.API_PREFIX)


# 🔹 Startup Event (modern style)
@app.on_event("startup")
async def startup_event():
    print(f"🚀 {settings.APP_NAME} started")
    print(f"🔧 DEBUG MODE: {settings.DEBUG}")
    print(f"🌐 API PREFIX: {settings.API_PREFIX}")
    print(f"🔗 Allowed Origins: {settings.origins}")


# 🔹 Health Check Route
@app.get("/", tags=["Health"])
async def root():
    return {
        "success": True,
        "message": f"🚀 {settings.APP_NAME} running",
        "version": settings.VERSION,
        "docs": "/docs"
    }


# 🔹 Optional: Health endpoint for monitoring
@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "ok",
        "service": settings.APP_NAME
    }