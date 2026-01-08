# from fastapi import FastAPI, UploadFile, File
# from fastapi.middleware.cors import CORSMiddleware
# from tensorflow.keras.models import load_model
# from PIL import Image
# import numpy as np
# import io
# import joblib
# import os

# app = FastAPI()

# # --- CORS setup ---
# origins = [
#     "http://localhost:5173",  # your React dev server
#     "http://127.0.0.1:5173",
#     "https://structurecrackdetection.netlify.app",
#     # Add your production domain later if needed
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,        # allow React app
#     allow_credentials=True,
#     allow_methods=["*"],          # allow all HTTP methods
#     allow_headers=["*"],          # allow all headers
# )


# model = load_model("app/saved_models/crack_classifier")
# water_quality_model = load_model("app/saved_models/water_quality_model")
# scaler = joblib.load("app/saved_models/water_scaler.pkl") 
# # BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# # # Models folder path
# # MODEL_DIR = os.path.join(BASE_DIR, "saved_models")

# # print("BASE_DIR:", BASE_DIR)
# # print("MODEL_DIR:", MODEL_DIR)
# # print("Saved models:", os.listdir(MODEL_DIR))

# # # Load models
# # model = load_model(os.path.join(MODEL_DIR, "crack_classifier"))
# # water_quality_model = load_model(os.path.join(MODEL_DIR, "water_quality_model"))
# # scaler = joblib.load(os.path.join(MODEL_DIR, "water_scaler.pkl"))


# @app.post("/predict")
# async def predict(file: UploadFile = File(...)):
#     img = Image.open(io.BytesIO(await file.read())).resize((224,224))
#     img = np.array(img)/255.0
#     img = img.reshape(1,224,224,3)

#     pred = model.predict(img)[0][0]
#     label = "crack" if pred > 0.5 else "no_crack"

#     return {
#         "prediction": label,
#         "confidence": float(pred)
#     }
# @app.post("/predict_water_quality")
# async def predict_water_quality(data: dict):

#     features = np.array([[
#         data["ph"],
#         data["Hardness"],
#         data["Solids"],
#         data["Chloramines"],
#         data["Sulfate"],
#         data["Conductivity"],
#         data["Organic_carbon"],
#         data["Trihalomethanes"],
#         data["Turbidity"]
#     ]])

#     features = scaler.transform(features)  

#     pred = water_quality_model.predict(features)[0][0]

#     return {
#         "prediction": "potable" if pred > 0.5 else "not_potable",
#         "confidence": float(pred)
#     }


# # if __name__ == "__main__":
# #     import uvicorn
# #     port = int(os.environ.get("PORT", 10000))  # use Render's PORT
# #     uvicorn.run("app.main:app", host="0.0.0.0", port=port)

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io
import joblib
import os

app = FastAPI()

# --- CORS setup ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://structurecrackdetection.netlify.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# IMPORTANT: Use absolute paths for Render/Docker
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Go up one level from app/
MODEL_DIR = os.path.join(BASE_DIR, "app", "saved_models")

print("=" * 50)
print("DEBUG INFO - Model Loading")
print("=" * 50)
print(f"Current directory: {os.getcwd()}")
print(f"BASE_DIR: {BASE_DIR}")
print(f"MODEL_DIR: {MODEL_DIR}")
print(f"MODEL_DIR exists: {os.path.exists(MODEL_DIR)}")

if os.path.exists(MODEL_DIR):
    print(f"Files in MODEL_DIR: {os.listdir(MODEL_DIR)}")
    crack_path = os.path.join(MODEL_DIR, "crack_classifier")
    print(f"Crack model path: {crack_path}")
    print(f"Crack model exists: {os.path.exists(crack_path)}")
    if os.path.exists(crack_path):
        print(f"Contents of crack_classifier: {os.listdir(crack_path)}")

print("=" * 50)


try:
    # Correct path for Docker container
    crack_model_path = os.path.join(MODEL_DIR, "crack_classifier")
    print(f"Loading crack model from: {crack_model_path}")
    model = load_model(crack_model_path)
    print("✅ Crack model loaded successfully")
    
    water_model_path = os.path.join(MODEL_DIR, "water_quality_model")
    print(f"Loading water model from: {water_model_path}")
    water_quality_model = load_model(water_model_path)
    print("✅ Water quality model loaded successfully")
    
    scaler_path = os.path.join(MODEL_DIR, "water_scaler.pkl")
    print(f"Loading scaler from: {scaler_path}")
    scaler = joblib.load(scaler_path)
    print("✅ Scaler loaded successfully")
    
except Exception as e:
    print(f"❌ ERROR loading models: {e}")
    print(f"Error type: {type(e)}")
    import traceback
    traceback.print_exc()
    raise

@app.get("/")
async def root():
    return {"message": "Crack Detection API is running"}

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

@app.get("/health")
async def health_check():
    return {"status": "healthy", "models_loaded": True}