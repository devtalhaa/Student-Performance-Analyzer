import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib

def main():
    # Load the dataset. We assume a standard CSV format structure.
    # If the original UCI dataset is used, you may need to add sep=';'
    df = pd.read_csv('student-por.csv')
    
    # We select a subset of numeric features that intuitively impact student performance
    # G1 and G2 are highly correlated with the final grade G3.
    features = ['studytime', 'failures', 'absences', 'G1', 'G2']
    target = 'G3'
    
    # Drop any rows with missing values in our selected features to prevent training errors
    df_clean = df.dropna(subset=features + [target])
    
    X = df_clean[features]
    y = df_clean[target]
    
    # Split the dataset: 80% for training the model, 20% for testing its accuracy
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # We use a Random Forest Regressor because grades are numeric and 
    # tree-based models capture non-linear relationships well without complex scaling
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    
    # Train the chosen model using our training data partition
    model.fit(X_train, y_train)
    
    # Evaluate the model to verify it learned correctly
    predictions = model.predict(X_test)
    mse = mean_squared_error(y_test, predictions)
    r2 = r2_score(y_test, predictions)
    
    print(f"Model Evaluation -> MSE: {mse:.2f}, R2 Score: {r2:.2f}")
    
    # Export the trained model to a .pkl file so the FastAPI backend can load it for predictions
    joblib.dump(model, 'model.pkl')
    print("Model successfully trained and saved as 'model.pkl'.")

if __name__ == '__main__':
    main()
