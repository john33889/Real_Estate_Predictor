import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import model as model_module
from app.routes import health, predict, metadata

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Incarc modelul cand porneste serverul
    logger.info("Aplicatia porneste — se incarca modelul...")
    model_module.load_model()
    yield
    logger.info("Aplicatia se opreste...")

# Detalii pentru FastAPI
app = FastAPI(
    title="Real Estate Price Predictor",
    description=(
        "Prezicerea preturilor pentru imobiliarele din Romania folosind un model CatBoost antrenat pe aproximativ 50k 'listings' aduse de pe imobiliare.ro"
    ),
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173")
origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rute
app.include_router(health.router)
app.include_router(predict.router)
app.include_router(metadata.router)


@app.get("/", tags=["System"])
def root():
    return {
        "message": "Real Estate Predictor API",
        "docs": "/docs",
        "health": "/health",
        "predict": "POST /predict",
        "metadata": "/metadata",
    }