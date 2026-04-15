import os
import logging
import pandas as pd

logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "imobiliare_data.csv")

_stats: dict | None = None
_df: pd.DataFrame | None = None


def load_stats() -> None:
    # Incarc fisierul CSV, il curat/normalizez
    # prelucrez datele (statisticile) inainte de a trimite in frontend.
    global _stats, _df

    if not os.path.exists(CSV_PATH):
        logger.error(f"Nu am gasit fisierul CSV in: {CSV_PATH}. Statisticile nu sunt disponibile.")
        _stats = {}
        return

    logger.info(f"Incarc setul de date pentru statistici din {CSV_PATH} ...")
    df = pd.read_csv(CSV_PATH)

    # Aplic aceleasi reguli ca si train_model.py
    df = df[df["price"] > 10000]
    df = df[df["surface_m2"].between(15, 500)]
    df = df[df["rooms"].between(1, 10)]
    df = df.dropna(subset=["city"])
    df["price_per_m2"] = pd.to_numeric(df["price_per_m2"], errors="coerce")
    df["rooms"] = df["rooms"].astype(int)

    _df = df
    _stats = _compute_all(df)
    logger.info(f"Statisticile au fost prelucrate din {len(df):,} listings.")


def _compute_all(df: pd.DataFrame) -> dict:
    # KPI-uri overall (generale)
    overall = {
        "total_listings": int(len(df)),
        "avg_price_eur": round(df["price"].mean(), 2),
        "median_price_eur": round(df["price"].median(), 2),
        "avg_price_per_m2": round(df["price_per_m2"].dropna().mean(), 2),
        "median_price_per_m2": round(df["price_per_m2"].dropna().median(), 2),
        "avg_surface_m2": round(df["surface_m2"].mean(), 2),
        "total_cities": int(df["city"].nunique()),
    }

    # In functie de oras
    # Top 20
    city_grp = (
        df.groupby("city")
        .agg(
            listings=("price", "count"),
            avg_price=("price", "mean"),
            median_price=("price", "median"),
            avg_price_per_m2=("price_per_m2", "mean"),
        )
        .sort_values("listings", ascending=False)
        .head(20)
        .reset_index()
    )
    by_city = [
        {
            "city": row["city"],
            "listings": int(row["listings"]),
            "avg_price_eur": round(row["avg_price"], 2),
            "median_price_eur": round(row["median_price"], 2),
            "avg_price_per_m2": round(row["avg_price_per_m2"], 2),
        }
        for _, row in city_grp.iterrows()
    ]

    # In functie de numarul de camere
    rooms_grp = (
        df.groupby("rooms")
        .agg(
            listings=("price", "count"),
            avg_price=("price", "mean"),
            median_price=("price", "median"),
        )
        .sort_index()
        .reset_index()
    )
    by_rooms = [
        {
            "rooms": int(row["rooms"]),
            "listings": int(row["listings"]),
            "avg_price_eur": round(row["avg_price"], 2),
            "median_price_eur": round(row["median_price"], 2),
        }
        for _, row in rooms_grp.iterrows()
    ]

    # In functie de data construirii
    # Incepand cu 1950...pot modifica daca trebuie
    df_year = df.dropna(subset=["year_built"]).copy()
    df_year = df_year[df_year["year_built"].between(1950, 2026)]
    df_year["decade"] = (df_year["year_built"] // 10 * 10).astype(int)
    decade_grp = (
        df_year.groupby("decade")
        .agg(
            listings=("price", "count"),
            avg_price=("price", "mean"),
            avg_price_per_m2=("price_per_m2", "mean"),
        )
        .sort_index()
        .reset_index()
    )
    by_decade = [
        {
            "decade": int(row["decade"]),
            "label": f"{int(row['decade'])}s",
            "listings": int(row["listings"]),
            "avg_price_eur": round(row["avg_price"], 2),
            "avg_price_per_m2": round(row["avg_price_per_m2"], 2),
        }
        for _, row in decade_grp.iterrows()
    ]

    # Distributia preturilor - histograma
    bins = list(range(0, 600_001, 25_000)) + [float("inf")]
    labels = [
        f"{b // 1000}k–{(bins[i + 1]) // 1000}k" if bins[i + 1] != float("inf")
        else "600k+"
        for i, b in enumerate(bins[:-1])
    ]
    df["_bucket"] = pd.cut(df["price"], bins=bins, labels=labels, right=False)
    hist = df["_bucket"].value_counts().sort_index()
    price_distribution = [
        {"range": label, "listings": int(hist.get(label, 0))}
        for label in labels
    ]

    return {
        "overall": overall,
        "by_city": by_city,
        "by_rooms": by_rooms,
        "by_decade": by_decade,
        "price_distribution": price_distribution,
    }


def get_stats() -> dict:
    if _stats is None:
        raise RuntimeError("Statisticile nu sunt incarcate")
    return _stats


def get_city_stats(city: str) -> dict | None:
    if _df is None:
        raise RuntimeError("Setul de date nu este incarcat.")

    city_df = _df[_df["city"] == city]
    if city_df.empty:
        return None

    # Overall pentru oras
    overview = {
        "city": city,
        "listings": int(len(city_df)),
        "avg_price_eur": round(city_df["price"].mean(), 2),
        "median_price_eur": round(city_df["price"].median(), 2),
        "avg_price_per_m2": round(city_df["price_per_m2"].dropna().mean(), 2),
        "avg_surface_m2": round(city_df["surface_m2"].mean(), 2),
    }

    # In functie de cartiere / vecini / neighborhoods
    nbh_grp = (
        city_df.groupby("neighborhood")
        .agg(
            listings=("price", "count"),
            avg_price=("price", "mean"),
            median_price=("price", "median"),
            avg_price_per_m2=("price_per_m2", "mean"),
        )
        .sort_values("listings", ascending=False)
        .reset_index()
    )
    by_neighborhood = [
        {
            "neighborhood": row["neighborhood"],
            "listings": int(row["listings"]),
            "avg_price_eur": round(row["avg_price"], 2),
            "median_price_eur": round(row["median_price"], 2),
            "avg_price_per_m2": round(row["avg_price_per_m2"], 2),
        }
        for _, row in nbh_grp.iterrows()
    ]

    # In functie de camere
    rooms_grp = (
        city_df.groupby("rooms")
        .agg(
            listings=("price", "count"),
            avg_price=("price", "mean"),
            median_price=("price", "median"),
        )
        .sort_index()
        .reset_index()
    )
    by_rooms = [
        {
            "rooms": int(row["rooms"]),
            "listings": int(row["listings"]),
            "avg_price_eur": round(row["avg_price"], 2),
            "median_price_eur": round(row["median_price"], 2),
        }
        for _, row in rooms_grp.iterrows()
    ]

    return {
        "overview": overview,
        "by_neighborhood": by_neighborhood,
        "by_rooms": by_rooms,
    }


def is_stats_loaded() -> bool:
    return _stats is not None


def get_city_prices() -> dict:
    if _df is None:
        return {}

    grp = (
        _df.groupby("city")
        .agg(
            listings=("price", "count"),
            avg_price=("price", "mean"),
            median_price=("price", "median"),
            avg_price_per_m2=("price_per_m2", "mean"),
            min_price=("price", "min"),
            max_price=("price", "max"),
        )
        .reset_index()
    )

    return {
        row["city"]: {
            "listings": int(row["listings"]),
            "avg_price_eur": round(row["avg_price"], 2),
            "median_price_eur": round(row["median_price"], 2),
            "avg_price_per_m2": round(row["avg_price_per_m2"], 2),
            "min_price_eur": round(row["min_price"], 2),
            "max_price_eur": round(row["max_price"], 2),
        }
        for _, row in grp.iterrows()
    }