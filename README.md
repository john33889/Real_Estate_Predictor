# 🏘️ RealEstate Predictor AI

> Proiect software · Universitatea de Vest Timișoara · MI204
> Estimarea prețului de piață pentru locuințe din România folosind machine learning.

---

## 📋 Descriere

Aplicație web full-stack care estimează prețul corect de piață pentru orice locuință din România, bazat pe colectare automată de anunțuri imobiliare și un model AI antrenat pe date reale.

Utilizatorul introduce caracteristicile unei locuințe (oraș, cartier, suprafață, etaj, an construcție etc.) și primește:
- 💰 **Estimare instant** generată de modelul ML
- 🏘️ **Anunțuri reale similare** din baza de date, cu link direct
- 📊 **Dashboard interactiv** cu statistici de piață filtrabile

---

## 🏗️ Arhitectură

Proiectul este organizat în **4 module independente**, fiecare dezvoltat de un membru al echipei:
┌─────────────────────────────────────────────────────────────┐
│                     RealEstate Predictor AI                  │
└─────────────────────────────────────────────────────────────┘
│                                          │
▼                                          ▼
┌───────────────┐                          ┌──────────────┐
│  Web Scraper  │ ──── date brute ────────▶│ Data Pipeline│
│  (Adi)        │                          │  (Adi)       │
└───────────────┘                          └──────┬───────┘
│
CSV curat │
▼
┌────────────────────────────────┐
│    Prediction Engine ML        │
│    (Radu)                      │
│  - antrenare model CatBoost    │
│  - serializare model           │
└─────────────┬──────────────────┘
│ model.cbm
▼
┌────────────────────────────────┐
│    Backend API REST            │
│    (Sorin)                     │
│  - endpoint /predict           │
│  - validare cereri             │
│  - orchestrare model           │
└─────────────┬──────────────────┘
│ JSON
▼
┌────────────────────────────────┐
│    Frontend Web                │
│    (Bogdan)                    │
│  - interfață React + TS        │
│  - dashboard interactiv        │
│  - recomandări reale           │
└────────────────────────────────┘

### Componente

| Modul | Responsabil | Rol |
|-------|-------------|-----|
| **Scraper + Data Cleaning** | Adi | Colectarea automată a anunțurilor și pregătirea setului de date |
| **Prediction Engine** | Radu | Antrenarea și optimizarea modelului de predicție |
| **API Service** | Sorin | Expunerea predicțiilor printr-un serviciu REST |
| **Interfață Web** | Bogdan | Aplicația vizuală pentru utilizatorul final |

---

## 🚀 Instrucțiuni de rulare

### Cerințe preliminare
- **Python 3.11+**
- **Node.js 18+** și npm
- **Git**

### 1. Clonează repository-ul

```bash
git clone https://github.com/john33889/Real_Estate_Predictor.git
cd Real_Estate_Predictor
```

### 2. Pornește Backend-ul

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```

Backend-ul va rula pe `http://localhost:8080`.
Documentația API automată este disponibilă la `http://localhost:8080/docs`.

### 3. Pornește Frontend-ul

Într-un terminal nou:

```bash
cd frontend
npm install
npm run dev
```

Aplicația va fi disponibilă pe `http://localhost:5173`.

### 4. Configurare conexiune

În folderul `frontend`, fișierul `.env` configurează adresa backend-ului:
VITE_API_URL=http://localhost:8080

---

## 🌳 Structura repository-ului
Real_Estate_Predictor/
├── backend/                  # Modul API (Sorin)
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── model.py
│   │   └── schemas.py
│   ├── model/
│   └── requirements.txt
│
├── frontend/                 # Modul Frontend (Bogdan)
│   ├── public/
│   │   └── imobiliare_data.csv
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
│
├── RealEstate_Scrapper/      # Modul Scraper (Adi)
│   └── main.py
│
├── train_model.py            # Modul ML (Radu)
├── imobiliare_data.csv       # Set de date colectat
├── real_estate_catboost_model.cbm
└── README.md

---

## 🌿 Workflow Git

Proiectul folosește un model de branching cu un branch per modul:

- `main` — branch principal, cod stabil
- `backend` — dezvoltare API
- `feature/frontend` — dezvoltare interfață
- `Scrapper` — dezvoltare scraper
- `re-train` — îmbunătățiri model ML

Integrarea modificărilor se realizează prin **Pull Request-uri** către `main`, urmată de review și merge.

---

## 👥 Echipă

| Membru | Rol |
|--------|-----|
| Adi | Data Engineer — Scraper + Data Cleaning |
| Sorin | Backend Architect — API Service |
| Bogdan | Frontend & UX — Interfață Web |
| Radu | AI/ML Specialist — Prediction Engine |

---
