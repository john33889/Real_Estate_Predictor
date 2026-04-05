import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from catboost import CatBoostRegressor

# 1. Load dataset
df = pd.read_csv("imobiliare_data.csv")

# 2. Keep only relevant columns
cols = [
    "price",
    "surface_m2",
    "rooms",
    "floor",
    "max_floor",
    "neighborhood",
    "city",
    "year_built"
]
df = df[cols].copy()

# 3. Remove rows without target
df = df.dropna(subset=["price"])

# 4. Basic cleaning / outlier filtering
df["price"] = pd.to_numeric(df["price"], errors="coerce")
df["surface_m2"] = pd.to_numeric(df["surface_m2"], errors="coerce")
df["rooms"] = pd.to_numeric(df["rooms"], errors="coerce")
df["floor"] = pd.to_numeric(df["floor"], errors="coerce")
df["max_floor"] = pd.to_numeric(df["max_floor"], errors="coerce")
df["year_built"] = pd.to_numeric(df["year_built"], errors="coerce")

df = df.dropna(subset=["price"])

df = df[df["price"] > 10000]
df = df[df["surface_m2"] >= 15]
df = df[df["surface_m2"] <= 500]
df = df[df["rooms"] >= 1]
df = df[df["rooms"] <= 10]

df = df[
    (df["year_built"].isna()) |
    ((df["year_built"] >= 1800) & (df["year_built"] <= 2026))
]

# 5. Define categorical and numerical columns
cat_features = ["neighborhood", "city"]
num_features = ["surface_m2", "rooms", "floor", "max_floor", "year_built"]

# 6. Fix categorical columns
for col in cat_features:
    df[col] = df[col].fillna("Unknown").astype(str)

# 7. Fix numerical columns
for col in num_features:
    df[col] = pd.to_numeric(df[col], errors="coerce")
    df[col] = df[col].fillna(df[col].median())

# 8. Features and target
X = df.drop(columns=["price"])
y = df["price"]

# 9. Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 10. Build model
model = CatBoostRegressor(
    iterations=1000,
    learning_rate=0.05,
    depth=8,
    loss_function="RMSE",
    eval_metric="MAE",
    verbose=100
)

# 11. Train model
model.fit(
    X_train,
    y_train,
    cat_features=cat_features,
    eval_set=(X_test, y_test),
    use_best_model=True
)

# 12. Predict
preds = model.predict(X_test)

# 13. Metrics
mae = mean_absolute_error(y_test, preds)
rmse = np.sqrt(mean_squared_error(y_test, preds))
r2 = r2_score(y_test, preds)

print("\n===== RESULTS =====")
print("MAE:", mae)
print("RMSE:", rmse)
print("R2:", r2)

# 14. Example prediction
example = pd.DataFrame([{
    "surface_m2": 70,
    "rooms": 3,
    "floor": 4,
    "max_floor": 8,
    "neighborhood": "Unknown",
    "city": "Bucuresti",
    "year_built": 2018
}])

pred_price = model.predict(example)[0]
print("\nPredicted price for example property:", pred_price)

# 15. Save model
model.save_model("real_estate_catboost_model.cbm")
print("\nModel saved as: real_estate_catboost_model.cbm")