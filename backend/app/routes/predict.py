import logging
from fastapi import APIRouter, HTTPException
from app.schemas import PredictRequest, PredictResponse
from app import model as model_module

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/predict", response_model=PredictResponse, tags=["Prediction"])
def predict_price(request: PredictRequest):
    # Prezic pretul pentru real estate
    if not model_module.is_model_loaded():
        raise HTTPException(status_code=503, detail="Modelul AI nu este incarcat. Incearca din nou.")

    try:
        price = model_module.predict(request.model_dump())
    except Exception as e:
        logger.exception("Prediction failed")
        raise HTTPException(status_code=500, detail=f"Eroare la prezicere: {str(e)}")

    return PredictResponse(
        predicted_price=round(price, 2),
        currency="EUR",
        inputs=request,
    )