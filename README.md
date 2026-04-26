# RealEstate Predictor AI

**Estimarea prețului de piață pentru locuințe din România prin machine learning**

> Proiect academic · Universitatea 1 Decembrie 1918 · Alba Iulia  
> Python · FastAPI · CatBoost · React · TypeScript

---

## Prezentare generală

RealEstate Predictor AI este o aplicație web full-stack care estimează prețul de piață al oricărei locuințe rezidențiale din România. În loc să se bazeze pe comparații manuale sau pe anunțuri învechite, sistemul colectează automat date imobiliare, antrenează un model de regresie de tip gradient-boosting pe zeci de mii de anunțuri reale și oferă estimări instantanee de preț printr-un API REST consumat de o interfață web interactivă.

Proiectul a fost construit ca un exercițiu academic colaborativ, cu o separare clară a responsabilităților: un coleg se ocupă de pipeline-ul de date, unul de modelul ML, unul de serviciul backend și unul de frontend. Fiecare modul este dezvoltat independent pe propriul branch de Git și integrat în `main` prin pull request-uri.

---

## Ce face aplicația

Un utilizator care accesează aplicația completează caracteristicile unei locuințe — orașul, cartierul, suprafața, etajul, numărul de camere și anul construcției — și primește imediat o estimare de preț în EUR, generată în timp real de modelul de regresie CatBoost care rulează pe backend. Alături de estimare, dashboard-ul afișează statistici agregate de piață: prețuri mediane pe oraș și cartier, distribuții de prețuri, defalcări după numărul de camere și tendințe pe decade de construcție — toate calculate din același set de date pe care a fost antrenat modelul.

Datele care stau la baza întregului sistem provin de pe **imobiliare.ro**, cel mai mare portal imobiliar din România, colectate automat și curățate înainte de a fi introduse în pipeline-ul de antrenare. Rezultatul este un sistem ancorat în realitatea actuală a pieței, nu în date sintetice sau selectate manual.

---

## Arhitectură

Sistemul este compus din patru module independente care comunică prin interfețe bine definite.

**Pipeline-ul de date** colectează anunțurile brute de pe imobiliare.ro folosind un scraper personalizat, după care aplică un pipeline de curățare și normalizare care filtrează valorile aberante, gestionează valorile lipsă și produce un set de date CSV consistent. Acesta reprezintă sursa unică de adevăr atât pentru antrenarea modelului, cât și pentru statisticile de piață servite de API.

**Motorul de predicție - Modelul ML** preia setul de date curățat și antrenează un regressor de tip gradient-boosting bazat pe [CatBoost](https://catboost.ai/). CatBoost a fost ales tocmai pentru că gestionează nativ variabilele categoriale — oraș și cartier — fără a necesita encoding manual, lucru important dat fiind diversitatea localităților din România. Modelul antrenat este serializat ca artefact `.cbm` și transmis backend-ului.

**API-ul backend** este un serviciu [FastAPI](https://fastapi.tiangolo.com/) care încarcă artefactul modelului la pornire și îl expune prin HTTP. Gestionează validarea cererilor prin scheme Pydantic, rulează inferența sincron și pre-calculează și memorează în cache toate statisticile de piață din CSV la pornire, astfel încât interogările din dashboard sunt servite instantaneu din memorie. API-ul este complet documentat prin Swagger UI generat automat, disponibil la `/docs`.

**Frontend-ul** este o aplicație single-page construită cu [React](https://react.dev/) și TypeScript, folosind Vite. Comunică cu backend-ul printr-un URL de bază configurabil și prezintă formularul de predicție, rezultatul estimat și dashboard-ul de statistici într-o interfață unitară.

```
imobiliare.ro
      │
      ▼
 Web Scraper ──▶ Pipeline date ──▶ imobiliare_data.csv
                                          │
                              ┌───────────┴───────────┐
                              ▼                       ▼
                     train_model.py           cache statistici piață
                              │                       │
                              ▼                       ▼
                   artefact model.cbm        Backend FastAPI
                              │                       │
                              └───────────┬───────────┘
                                          │ REST / JSON
                                          ▼
                                  React + TypeScript
                                     Frontend
```

---

## Referință API

Backend-ul expune următoarele endpoint-uri. Documentația interactivă completă este disponibilă la `http://localhost:8080/docs` când serverul rulează.

**`GET /health`** returnează starea curentă a serviciului și confirmă dacă modelul ML a fost încărcat cu succes. Este util ca verificare de stare înainte de a face cereri de predicție.

**`POST /predict`** este endpoint-ul principal. Acceptă un corp JSON care descrie o proprietate și returnează un preț estimat în EUR. Câmpul `neighborhood` este opțional și implicit devine `"Unknown"` dacă este omis — util atunci când utilizatorul nu cunoaște cartierul exact. Toate celelalte câmpuri sunt validate față de aceleași constrângeri aplicate în timpul antrenării (de exemplu, suprafața între 15–500 m², numărul de camere între 1–10).

```json
POST /predict
{
  "surface_m2": 70,
  "rooms": 3,
  "floor": 4,
  "max_floor": 8,
  "neighborhood": "Floreasca",
  "city": "București",
  "year_built": 2018
}

→ { "predicted_price": 142350.75, "currency": "EUR", "inputs": { ... } }
```

**`GET /metadata`** returnează lista completă a orașelor, cartierele asociate fiecăruia și statisticile de prețuri curente per oraș — tot ce are nevoie frontend-ul pentru a popula dropdown-urile și a afișa contextul de piață. Este gândit ca un singur apel făcut o singură dată la încărcarea aplicației.

**`GET /metadata/city?city=Cluj-Napoca`** returnează aceleași informații limitate la un singur oraș, util pentru încărcarea lazy a datelor despre cartiere și prețuri atunci când utilizatorul selectează un oraș.

**`GET /market-stats`** returnează statistici agregate din întregul set de date pentru dashboard: KPI-uri generale (număr total de anunțuri, preț median, preț mediu per m²), defalcări pe oraș, număr de camere, decadă de construcție și o histogramă a distribuției prețurilor în intervale de 25.000 EUR.

**`GET /market-stats/city?city=Brașov`** returnează o analiză detaliată pentru un singur oraș, incluzând prețuri la nivel de cartier și defalcări după numărul de camere.

---

## Fluxul de predicție

Când un utilizator trimite formularul de predicție, frontend-ul trimite o cerere `POST /predict` către backend. FastAPI validează JSON-ul primit față de schema Pydantic `PredictRequest` — respingând datele malformate cu o eroare structurată 422 înainte ca acestea să ajungă la model. Dacă validarea trece, cererea este transmisă în `model.py`, care construiește un DataFrame Pandas cu un singur rând în ordinea exactă a coloanelor pe care a fost antrenat modelul CatBoost, se asigură că variabilele categoriale sunt de tip string și apelează `model.predict()`. Valoarea float brută returnată este limitată la minimum zero (pentru a preveni predicțiile negative ocazionale pe inputuri neobișnuite), rotunjită la două zecimale și returnată împreună cu o copie a datelor de intrare pentru ca frontend-ul să le poată afișa.

Modelul în sine este încărcat o singură dată la pornirea serverului prin managerul de context `lifespan` al FastAPI și păstrat în memorie pe toată durata de viață a procesului. Nu există niciun overhead de încărcare a modelului per cerere.

---

## Fluxul statisticilor de piață

La pornire, odată cu modelul, aplicația încarcă întregul set de date CSV în memorie și pre-calculează toate statisticile — clasamentele pe orașe, defalcările pe camere, tendințele pe decade, histogramele de prețuri — stocându-le într-un dicționar la nivel de modul. Fiecare apel la `/market-stats` este astfel o simplă citire din dicționar, fără niciun calcul Pandas la momentul cererii. Analizele detaliate la nivel de oraș (`/market-stats/city`) sunt calculate la cerere din DataFrame-ul memorat în cache, deoarece există aproximativ 130 de orașe și pre-calcularea tuturor la pornire ar fi ineficientă.

---

## Pornirea aplicației

### Cerințe prealabile

- Python 3.11 sau mai nou
- Node.js 18 sau mai nou și npm
- Git

### Clonează repository-ul

```bash
git clone https://github.com/john33889/Real_Estate_Predictor.git
cd Real_Estate_Predictor
```

### Antrenează modelul

Artefactul `.cbm` al modelului nu este inclus în controlul versiunilor din cauza dimensiunii sale. Rulează scriptul de antrenare o singură dată pentru a-l genera:

```bash
python train_model.py
mv real_estate_catboost_model.cbm backend/model/
```

Antrenarea durează câteva minute pe un laptop obișnuit. La final, scriptul afișează MAE, RMSE și R² pe setul de test.

### Pornește backend-ul

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env          # ajustează CORS_ORIGINS dacă este necesar
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```

API-ul va fi disponibil la `http://localhost:8080`. Documentația interactivă se găsește la `http://localhost:8080/docs`.

### Pornește frontend-ul

Într-un terminal separat:

```bash
cd frontend
npm install
npm run dev
```

Aplicația va fi disponibilă la `http://localhost:5173`. Asigură-te că `VITE_API_URL` din `frontend/.env` indică spre `http://localhost:8080`.

---

## Structura repository-ului

```
Real_Estate_Predictor/
│
├── backend/                        # Serviciu REST API (Sorin)
│   ├── app/
│   │   ├── main.py                 # Aplicația FastAPI, CORS, ciclul de viață la pornire
│   │   ├── model.py                # Încărcarea modelului și inferența
│   │   ├── stats.py                # Calculul și cache-ul statisticilor de piață
│   │   ├── schemas.py              # Modele Pydantic pentru cereri și răspunsuri
│   │   └── routes/
│   │       ├── health.py           # GET /health
│   │       ├── predict.py          # POST /predict
│   │       ├── metadata.py         # GET /metadata, /metadata/city
│   │       └── market_stats.py     # GET /market-stats, /market-stats/city
│   ├── model/
│   │   ├── real_estate_catboost_model.cbm   # generat de train_model.py
│   │   └── metadata.json                    # index de orașe și cartiere
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
│
├── frontend/                       # Interfață React + TypeScript (Bogdan)
│   ├── src/
│   │   ├── api/                    # Funcții client pentru API
│   │   ├── components/             # Componente UI reutilizabile
│   │   ├── pages/                  # Componente de pagină la nivel de rută
│   │   ├── types/                  # Definiții de tipuri TypeScript
│   │   └── utils/                  # Funcții ajutătoare și formatoare
│   └── package.json
│
├── RealEstate_Scrapper/            # Colectare date (Adi)
│   └── main.py
│
├── train_model.py                  # Pipeline de antrenare CatBoost (Radu)
├── imobiliare_data.csv             # Set de date curățat (~50k anunțuri)
└── README.md
```

---

## Workflow Git

Proiectul urmează un model de ramificare câte un branch per modul. Fiecare membru al echipei lucrează pe un branch dedicat și integrează modificările în `main` prin pull request-uri cu recenzie din partea colegilor.

| Branch | Responsabil | Scop |
|--------|-------------|------|
| `main` | — | Cod stabil, integrat |
| `backend` | Sorin | Dezvoltarea serviciului API |
| `feature/frontend` | Bogdan | Dezvoltarea frontend-ului |
| `Scrapper` | Adi | Scraper și pipeline de date |
| `re-train` | Radu | Experimente și reantrenare model |

Toate modificările trec printr-un pull request astfel încât cel puțin un alt membru al echipei să aibă vizibilitate înainte de a face merge.

---

## Setul de date

Setul de date conține aproximativ **50.000 de anunțuri rezidențiale** colectate de pe imobiliare.ro în martie 2026. Fiecare înregistrare include prețul anunțului (EUR), suprafața (m²), numărul de camere, etajul și numărul total de etaje, cartierul, orașul, anul construcției și URL-ul original al anunțului. După curățare — eliminarea anunțurilor cu prețuri sub 10.000 €, a proprietăților în afara intervalului 15–500 m² și a înregistrărilor cu numere invalide de camere — rămân aproximativ 45.000 de înregistrări pentru antrenare și evaluare.

Datele acoperă **133 de orașe din România** și peste **875 de cartiere distincte**, ceea ce face din oraș și cartier unele dintre cele mai informative variabile din model.

---

## Echipa

| Membru | Rol |
|--------|-----|
| **Adi** | Colectare date — scraper web și pipeline de curățare a datelor |
| **Radu** | Model ML — antrenarea și optimizarea modelului CatBoost |
| **Sorin** | Backend — proiectarea și implementarea API-ului REST |
| **Bogdan** | Frontend — interfața React și dashboard-ul interactiv |
