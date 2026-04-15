'''

V1

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

'''

from fastapi import APIRouter, Query
from app import model as model_module
from app import stats as stats_module

router = APIRouter()


@router.get("/metadata", tags=["Metadata"])
def get_metadata():
    """
    Exemplu structura:
    {
        "cities": ["Alba Iulia", "Arad", ...],
        "city_neighborhoods": {
            "Cluj-Napoca": ["Andrei Mureșanu", "Bună Ziua", "Central", ...],
            ...
        },
        "city_prices": {
            "Cluj-Napoca": {
            "listings": 4269,
            "avg_price_eur": 211695.84,
            "median_price_eur": 190000.0,
            "avg_price_per_m2": 3307.10,
            "min_price_eur": 18000.0,
            "max_price_eur": 1800000.0
            },
            ...
        }
    }

    """
    metadata = model_module.get_metadata()
    city_prices = stats_module.get_city_prices()

    return {
        "cities": metadata.get("cities", []),
        "city_neighborhoods": metadata.get("city_neighborhoods", {}),
        "city_prices": city_prices,
    }


@router.get("/metadata/neighborhoods", tags=["Metadata"])
def get_neighborhoods_for_city(city: str = Query(..., description="City name")):
    # Returneaza vecinii pentru un anumre oras
    # Exemplu: GET /metadata/neighborhoods?city=Brasov
    data = model_module.get_metadata()
    city_map = data.get("city_neighborhoods", {})
    neighborhoods = city_map.get(city, [])
    return {
        "city": city,
        "neighborhoods": neighborhoods,
    }


@router.get("/metadata/city", tags=["Metadata"])
def get_city_info(city: str = Query(..., description="City name")):
    # Returneaza vecinii si preturile pentru un singur oras.
    # Exemplu: GET/metadata/city?city=Brasov
    from fastapi import HTTPException
    data = model_module.get_metadata()
    city_prices = stats_module.get_city_prices()

    neighborhoods = data.get("city_neighborhoods", {}).get(city, [])
    prices = city_prices.get(city)

    if not neighborhoods and prices is None:
        raise HTTPException(status_code=404, detail=f"Nu am gasit date pentru orasul: '{city}'")

    return {
        "city": city,
        "neighborhoods": neighborhoods,
        "prices": prices,
    }