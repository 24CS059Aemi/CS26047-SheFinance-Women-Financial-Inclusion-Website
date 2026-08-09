import sys
import subprocess
import os

# ----------------------------------------------------
# Auto-Install Dependencies if missing
# ----------------------------------------------------
def install_dependencies():
    packages = {
        "flask": "flask",
        "flask-cors": "flask_cors",
        "pandas": "pandas",
        "scikit-learn": "sklearn"
    }
    for pkg, imp in packages.items():
        try:
            __import__(imp)
        except ImportError:
            print(f"Installing missing dependency: {pkg}...")
            try:
                subprocess.check_call([sys.executable, "-m", "pip", "install", pkg])
            except Exception as e:
                print(f"Failed to install {pkg}. Error: {e}")

install_dependencies()

# ----------------------------------------------------
# Imports
# ----------------------------------------------------
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsRegressor
from sklearn.linear_model import LinearRegression
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from frontend HTML pages

CSV_PATH = 'mock_savings_data.csv'

# ----------------------------------------------------
# Helper to load and preprocess data
# ----------------------------------------------------
def load_dataset():
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(f"Dataset {CSV_PATH} not found!")
    df = pd.read_csv(CSV_PATH)
    # Standardize column values
    df['Occupation'] = df['Occupation'].str.strip().str.lower()
    return df

# ----------------------------------------------------
# API Endpoint: Predict Financial Health & Peer Savings (k-NN)
# ----------------------------------------------------
@app.route('/api/predict_health', methods=['POST'])
def predict_health():
    try:
        data = request.json
        user_age = int(data.get('age', 30))
        user_occupation = str(data.get('occupation', 'salaried')).strip().lower()
        user_income = float(data.get('income', 25000))
        
        # Map frontend occupation keys to dataset occupation keys
        occ_map = {
            'student': 'student',
            'salaried': 'working professional',
            'freelancer': 'working professional',
            'business': 'entrepreneur',
            'homemaker': 'homemaker'
        }
        mapped_occ = occ_map.get(user_occupation, 'working professional')
        
        df = load_dataset()
        
        # Filter pool by occupation to match local peer group
        df_filtered = df[df['Occupation'] == mapped_occ]
        if df_filtered.empty:
            df_filtered = df  # fallback
            
        # Prepare training data for k-NN
        X = df_filtered[['Age', 'Monthly_Income']].values
        y_score = df_filtered['Financial_Health_Score'].values
        y_savings = df_filtered['Actual_Savings'].values
        
        # Train k-NN models
        knn_score = KNeighborsRegressor(n_neighbors=5)
        knn_score.fit(X, y_score)
        
        knn_savings = KNeighborsRegressor(n_neighbors=5)
        knn_savings.fit(X, y_savings)
        
        # Make Prediction
        user_features = np.array([[user_age, user_income]])
        pred_score = int(knn_score.predict(user_features)[0])
        pred_savings = int(knn_savings.predict(user_features)[0])
        
        return jsonify({
            "status": "success",
            "predicted_health_score": pred_score,
            "predicted_peer_savings": pred_savings,
            "peer_occupation": mapped_occ
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

# ----------------------------------------------------
# API Endpoint: Predict Goal Completion Date (Linear Regression)
# ----------------------------------------------------
@app.route('/api/predict_timeline', methods=['POST'])
def predict_timeline():
    try:
        data = request.json
        target_amount = float(data.get('target_amount'))
        saved_amount = float(data.get('saved_amount'))
        monthly_savings = float(data.get('monthly_savings'))
        target_date_str = str(data.get('target_date')) # YYYY-MM-DD
        
        target_date = datetime.strptime(target_date_str, '%Y-%m-%d')
        today = datetime.now()
        
        remaining_amount = target_amount - saved_amount
        
        if remaining_amount <= 0:
            return jsonify({
                "status": "success",
                "predicted_finish_date": today.strftime('%Y-%m-%d'),
                "status_label": "Achieved 🎉",
                "months_required": 0,
                "recommendation": "Congratulations! You have already achieved this goal!"
            })
            
        if monthly_savings <= 0:
            return jsonify({
                "status": "success",
                "predicted_finish_date": "Never",
                "status_label": "Critical Delay 🚨",
                "months_required": 999,
                "recommendation": "Your monthly savings rate is zero or negative. AI suggests revising your budget to save at least 15% of your income."
            })
            
        # ML Simulation: Linear Regression model (y = mx + c)
        # Training a simple regressor to predict month based on savings trend
        # m = monthly_savings, c = saved_amount
        # Target: y = target_amount, find x (months)
        # We simulate 12 months of savings data to fit the regressor
        months = np.arange(12).reshape(-1, 1)
        simulated_savings = saved_amount + months * monthly_savings
        
        reg = LinearRegression()
        reg.fit(simulated_savings, months)
        
        # Predict the month when target is reached
        pred_month = float(reg.predict(np.array([[target_amount]]))[0])
        days_required = pred_month * 30.4
        
        predicted_finish_date = today + timedelta(days=days_required)
        
        # Calculate status
        diff_days = (predicted_finish_date - target_date).days
        
        if diff_days <= 0:
            status_label = "On Track 🟢"
            early_months = abs(round(diff_days / 30.4))
            recommendation = f"Great work! You are on track to achieve this goal {early_months} month(s) early. Keep it up!"
        else:
            status_label = "Delayed ⚠️"
            delayed_months = round(diff_days / 30.4)
            required_monthly_savings = remaining_amount / ((target_date - today).days / 30.4)
            recommendation = f"At this rate, you will be delayed by {delayed_months} month(s). AI recommends increasing your monthly savings to ₹{int(required_monthly_savings):,} to stay on track."
            
        return jsonify({
            "status": "success",
            "predicted_finish_date": predicted_finish_date.strftime('%Y-%m-%d'),
            "status_label": status_label,
            "months_required": round(pred_month, 1),
            "recommendation": recommendation
        })
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

if __name__ == '__main__':
    print("--------------------------------------------------")
    print(" SheFinance Python ML Server Running on http://127.0.0.1:5000")
    print("--------------------------------------------------")
    app.run(port=5000, debug=True)
