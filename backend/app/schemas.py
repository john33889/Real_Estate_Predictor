from pydantic import BaseModel, Field, field_validator

class PredictRequest(BaseModel):
    surface_m2: float = Field(..., ge=15, le=500, description="Surface in square meters (15–500)")
    rooms: float = Field(..., ge=1, le=10, description="Number of rooms (1–10)")
    floor: float = Field(..., ge=0, le=100, description="Floor number (0 = ground floor)")
    max_floor: float = Field(..., ge=0, le=100, description="Total floors in the building")
    neighborhood: str = Field(default="Unknown", description="Neighborhood name")
    city: str = Field(..., description="City name")
    year_built: float = Field(..., ge=1800, le=2026, description="Year the building was built")

    @field_validator("neighborhood", mode="before")
    @classmethod
    def normalize_neighborhood(cls, v):
        if not v or str(v).strip() == "":
            return "Unknown"
        return str(v).strip()

    @field_validator("city", mode="before")
    @classmethod
    def normalize_city(cls, v):
        return str(v).strip()

    model_config = {
        "json_schema_extra": {
            "example": {
                "surface_m2": 70,
                "rooms": 3,
                "floor": 4,
                "max_floor": 8,
                "neighborhood": "Floreasca",
                "city": "București",
                "year_built": 2018,
            }
        }
    }


class PredictResponse(BaseModel):
    predicted_price: float = Field(..., description="Predicted price in EUR")
    currency: str = Field(default="EUR")
    inputs: PredictRequest


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    version: str = "1.0.0"