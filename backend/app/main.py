from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io
import joblib

app = FastAPI()

# --- CORS setup ---
origins = [
    "http://localhost:5173",  # your React dev server
    "http://127.0.0.1:5173",
    "https://structurecrackdetection.netlify.app",
    # Add your production domain later if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # allow React app
    allow_credentials=True,
    allow_methods=["*"],          # allow all HTTP methods
    allow_headers=["*"],          # allow all headers
)

model = load_model("saved_models/crack_classifier")
water_quality_model = load_model("saved_models/water_quality_model")
scaler = joblib.load("saved_models/water_scaler.pkl") 

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    img = Image.open(io.BytesIO(await file.read())).resize((224,224))
    img = np.array(img)/255.0
    img = img.reshape(1,224,224,3)

    pred = model.predict(img)[0][0]
    label = "crack" if pred > 0.5 else "no_crack"

    return {
        "prediction": label,
        "confidence": float(pred)
    }
@app.post("/predict_water_quality")
async def predict_water_quality(data: dict):

    features = np.array([[
        data["ph"],
        data["Hardness"],
        data["Solids"],
        data["Chloramines"],
        data["Sulfate"],
        data["Conductivity"],
        data["Organic_carbon"],
        data["Trihalomethanes"],
        data["Turbidity"]
    ]])

    features = scaler.transform(features)  

    pred = water_quality_model.predict(features)[0][0]

    return {
        "prediction": "potable" if pred > 0.5 else "not_potable",
        "confidence": float(pred)
    }
