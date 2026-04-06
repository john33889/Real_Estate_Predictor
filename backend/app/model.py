import os
import json
import logging
import pandas as pd
from catboost import CatBoostRegressor

logger = logging.getLogger(__name__)

# Caile relative
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "model", "real_estate_catboost_model.cbm")
METADATA_PATH = os.path.join(BASE_DIR, "model", "metadata.json")

# Incerc sa pastrez ordinea coloanelor/features pe care a fost antrenat modelul
FEATURE_COLUMNS = [
    "surface_m2",
    "rooms",
    "floor",
    "max_floor",
    "neighborhood",
    "city",
    "year_built",
]

CAT_FEATURES = ["neighborhood", "city"]

# Incarcare model la pornire
_model: CatBoostRegressor | None = None
_metadata: dict | None = None


def load_model() -> None:
    # incarc modelul CatBoost
    global _model, _metadata

    if not os.path.exists(MODEL_PATH):
        logger.error(f"Model file not found at: {MODEL_PATH}")
        logger.error("Run train_model.py first, then copy the .cbm file to backend/model/")
        raise FileNotFoundError(f"Model not found: {MODEL_PATH}")

    logger.info(f"Loading model from {MODEL_PATH} ...")
    _model = CatBoostRegressor()
    _model.load_model(MODEL_PATH)
    logger.info("Model loaded successfully.")

    if os.path.exists(METADATA_PATH):
        with open(METADATA_PATH, "r", encoding="utf-8") as f:
            _metadata = json.load(f)
        logger.info(f"Metadata loaded: {len(_metadata.get('cities', []))} cities.")
    else:
        logger.warning(f"metadata.json not found at {METADATA_PATH}. /metadata endpoint will return empty.")
        _metadata = {"cities": [], "city_neighborhoods": {}}


def is_model_loaded() -> bool:
    return _model is not None


def predict(data: dict) -> float:
    """
    Run inference with the loaded CatBoost model.

    Args:
        data: dict with keys matching FEATURE_COLUMNS

    Returns:
        Predicted price as a float (EUR)
    """
    if _model is None:
        raise RuntimeError("Model is not loaded. Call load_model() first.")

    # Build DataFrame in correct column order
    df = pd.DataFrame([{col: data[col] for col in FEATURE_COLUMNS}])

    # Ensure categorical columns are strings
    for col in CAT_FEATURES:
        df[col] = df[col].astype(str)

    # Ensure numerical columns are numeric
    num_cols = [c for c in FEATURE_COLUMNS if c not in CAT_FEATURES]
    for col in num_cols:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    result = _model.predict(df)
    price = float(result[0])

    # Clamp to a sane minimum — model can occasionally predict negatives for unusual inputs
    return max(price, 0.0)


def get_metadata() -> dict:
    """Return cities and city→neighborhoods mapping for the frontend."""
    if _metadata is None:
        return {"cities": [], "city_neighborhoods": {}}
    return _metadata