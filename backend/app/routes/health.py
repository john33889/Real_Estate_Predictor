from fastapi import APIRouter
from app.schemas import HealthResponse
from app import model as model_module

router = APIRouter()


@router.get("/health", response_model=HealthResponse, tags=["System"])
def health_check():
    # Functie pentru a returna status curent al API
    # si daca a fost sau nu incarcat modelul AI
    return HealthResponse(
        status="ok",
        model_loaded=model_module.is_model_loaded(),
    )