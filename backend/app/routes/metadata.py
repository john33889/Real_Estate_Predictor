from fastapi import APIRouter, Query
from app import model as model_module

router = APIRouter()


@router.get("/metadata", tags=["Metadata"])
def get_metadata():
    # Returneaza toate orasele si vecinatatile (neighborhoods)
    # Pentru frontend:
    # - Dupa ce utilizatorul alege orasul
    # - Se va folosi city_neighborhoods[orasulAles]
    data = model_module.get_metadata()
    return {
        "cities": data.get("cities", []),
        "city_neighborhoods": data.get("city_neighborhoods", {}),
    }


@router.get("/metadata/neighborhoods", tags=["Metadata"])
def get_neighborhoods_for_city(city: str = Query(..., description="Denumire oras")):
    # Functie pentru returnearea vecinatatilor (neighborhoods)
    # De exemplu: GET /metadata/neighborhoods?city=Cluj-Napoca
    data = model_module.get_metadata()
    city_map = data.get("city_neighborhoods", {})
    neighborhoods = city_map.get(city, [])
    return {
        "city": city,
        "neighborhoods": neighborhoods,
    }