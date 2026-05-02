from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI(title="Academic Performance Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["POST"],  
    allow_headers=["*"],
)

try:
    model = joblib.load("model.pkl")
except Exception as e:
    model = None
    print(f"Warning: Could not load model.pkl. Error: {e}")


class PredictionRequest(BaseModel):
    studytime: float
    failures: float
    absences: float
    G1: float
    G2: float

@app.post("/predict")
async def predict_grade(request: PredictionRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded on the server.")
        
    try:
        # Convert the Pydantic model dict to a Pandas DataFrame
        # The AI model was originally trained on a DataFrame, so it expects input in the same 2D data structure
        input_data = pd.DataFrame([request.model_dump()])
        
        # Run the model's predict method
        # It returns an array of predictions (one for each row), so we select the first [0] element
        prediction = model.predict(input_data)[0]
        
        # Return the prediction result. FastAPI will automatically serialize this dict to JSON.
        return {"predicted_G3": float(prediction)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
