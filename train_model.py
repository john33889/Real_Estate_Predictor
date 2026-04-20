from pathlib import Path
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from catboost import CatBoostRegressor
 

ROOT_DIR = Path(__file__).resolve().parent
DATA_PATH = ROOT_DIR / "RealEstate_Scrapper" / "imobiliare_data.csv"
BACKEND_MODEL_DIR = ROOT_DIR / "backend" / "model"
MODEL_PATH = BACKEND_MODEL_DIR / "real_estate_catboost_model.cbm"
METADATA_PATH = BACKEND_MODEL_DIR / "metadata.json"
METRICS_PATH = BACKEND_MODEL_DIR / "training_metrics.json"

BACKEND_MODEL_DIR.mkdir(parents=True, exist_ok=True)

# =====================================================
# LOAD DATA
# =====================================================

if not DATA_PATH.exists():
    raise FileNotFoundError(f"Dataset not found: {DATA_PATH}")

df = pd.read_csv(DATA_PATH)
 
cols = [
    "price",
    "surface_m2",
    "rooms",
    "floor",
    "max_floor",
    "neighborhood",
    "city",
    "year_built",
]
df = df[cols].copy()

# =====================================================
# CLEANING
# =====================================================

# target
df["price"] = pd.to_numeric(df["price"], errors="coerce")

# numeric features
numeric_cols = ["surface_m2", "rooms", "floor", "max_floor", "year_built"]
for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# categorical features
cat_features = ["neighborhood", "city"]
for col in cat_features:
    df[col] = df[col].fillna("Unknown").astype(str).str.strip()
    df[col] = df[col].replace("", "Unknown")

# remove rows without target
df = df.dropna(subset=["price"])

# simple outlier filtering
df = df[df["price"] > 10000]
df = df[df["surface_m2"].fillna(0) >= 15]
df = df[df["surface_m2"].fillna(0) <= 500]
df = df[df["rooms"].fillna(0) >= 1]
df = df[df["rooms"].fillna(0) <= 10]

df = df[
    (df["year_built"].isna()) |
    ((df["year_built"] >= 1800) & (df["year_built"] <= 2026))
]

# fill missing numeric values with median
for col in numeric_cols:
    df[col] = df[col].fillna(df[col].median())

# final safety
df = df.dropna(subset=["price"])

# =====================================================
# FEATURES / TARGET
# =====================================================

FEATURE_COLUMNS = [
    "surface_m2",
    "rooms",
    "floor",
    "max_floor",
    "neighborhood",
    "city",
    "year_built",
]

X = df[FEATURE_COLUMNS].copy()
y = df["price"].copy()

# =====================================================
# TRAIN / TEST SPLIT
# =====================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# =====================================================
# MODEL
# =====================================================

model = CatBoostRegressor(
    iterations=1000,
    learning_rate=0.05,
    depth=8,
    loss_function="RMSE",
    eval_metric="MAE",
    verbose=100
)

model.fit(
    X_train,
    y_train,
    cat_features=cat_features,
    eval_set=(X_test, y_test),
    use_best_model=True
)

# =====================================================
# EVALUATION
# =====================================================

preds = model.predict(X_test)

mae = float(mean_absolute_error(y_test, preds))
rmse = float(np.sqrt(mean_squared_error(y_test, preds)))
r2 = float(r2_score(y_test, preds))

import json
from pathlib import Path

# make sure backend/model exists
metrics_dir = Path("backend/model")
metrics_dir.mkdir(parents=True, exist_ok=True)

best_scores = model.get_best_score()
best_iteration = model.get_best_iteration()

training_stats = {
    "rows_used": int(len(df)),
    "features": FEATURE_COLUMNS,
    "categorical_features": cat_features,
    "mae": mae,
    "rmse": rmse,
    "r2": r2,
    "best_iteration": int(best_iteration),
    "best_test_mae": float(best_scores["validation"]["MAE"]),
    "train_final_rmse": float(best_scores["learn"]["RMSE"]),
    "validation_final_mae": float(best_scores["validation"]["MAE"])
}

with open(metrics_dir / "training_metrics.json", "w", encoding="utf-8") as f:
    json.dump(training_stats, f, ensure_ascii=False, indent=4)

print("Training metrics saved to backend/model/training_metrics.json")
print("\n===== RESULTS =====")
print("Rows used:", len(df))
print("MAE:", mae)
print("RMSE:", rmse)
print("R2:", r2)

# =====================================================
# SAVE MODEL
# =====================================================

model.save_model(str(MODEL_PATH))
print(f"\nModel saved as: {MODEL_PATH}")

# =====================================================
# SAVE METADATA
# =====================================================

cities = sorted(df["city"].dropna().astype(str).unique().tolist())

city_neighborhoods = {}
for city in cities:
    neighborhoods = (
        df.loc[df["city"] == city, "neighborhood"]
        .dropna()
        .astype(str)
        .unique()
        .tolist()
    )
    city_neighborhoods[city] = sorted(neighborhoods)

metadata = {
    "cities": cities,
    "city_neighborhoods": city_neighborhoods,
}

with open(METADATA_PATH, "w", encoding="utf-8") as f:
    json.dump(metadata, f, ensure_ascii=False, indent=4)

print(f"Metadata saved as: {METADATA_PATH}")

# =====================================================
# SAVE TRAINING METRICS
# =====================================================

metrics = {
    "rows_used": len(df),
    "features": FEATURE_COLUMNS,
    "categorical_features": cat_features,
    "mae": mae,
    "rmse": rmse,
    "r2": r2,
}

with open(METRICS_PATH, "w", encoding="utf-8") as f:
    json.dump(metrics, f, ensure_ascii=False, indent=4)

print(f"Training metrics saved as: {METRICS_PATH}")

# =====================================================
# EXAMPLE PREDICTION
# =====================================================

example = pd.DataFrame([{
    "surface_m2": 70,
    "rooms": 3,
    "floor": 4,
    "max_floor": 8,
    "neighborhood": "Unknown",
    "city": "București",
    "year_built": 2018
}])

pred_price = float(model.predict(example)[0])
print("\nExample prediction:", round(pred_price, 2), "EUR")