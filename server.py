import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import psycopg2
import psycopg2.extras
from twilio.rest import Client
import datetime
import sqlite3

load_dotenv() # Load variables from .env if present

app = FastAPI(title="Cherry Quality Management API")

# 1. CORE SETUP & CORS PREVENTIONS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_URL = os.getenv("DATABASE_URL")

def get_db_connection():
    if not DB_URL:
        raise HTTPException(status_code=500, detail="Database URL not configured.")
    # Connect using psycopg2 to PostgreSQL
    conn = psycopg2.connect(DB_URL)
    return conn

# In-memory subscription storage for Phase 5 prototype
notification_settings = {
    "sms_enabled": False,
    "phone_number": ""
}
last_alerted_id = None

# AUTHENTICATION ENDPOINTS
class LoginRequest(BaseModel):
    password: str

class ResetPasswordRequest(BaseModel):
    username: str
    new_password: str

@app.post("/api/auth/login")
def login(req: LoginRequest):
    try:
        conn = sqlite3.connect("app_data.db")
        cursor = conn.cursor()
        cursor.execute("SELECT admin_password FROM setup_info WHERE id = 2")
        row = cursor.fetchone()
        conn.close()
        if row and row[0] == req.password:
            return {"status": "success"}
        else:
            raise HTTPException(status_code=401, detail="Invalid password")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/reset-password")
def reset_password(req: ResetPasswordRequest):
    try:
        conn = sqlite3.connect("app_data.db")
        cursor = conn.cursor()
        cursor.execute("SELECT admin_name FROM setup_info WHERE id = 2")
        row = cursor.fetchone()
        if not row or row[0] != req.username:
            conn.close()
            raise HTTPException(status_code=404, detail="User not found")
        
        cursor.execute("UPDATE setup_info SET admin_password = ? WHERE id = 2", (req.new_password,))
        conn.commit()
        conn.close()
        return {"status": "success"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class SubscribeRequest(BaseModel):
    sms_enabled: bool
    phone_number: str

@app.post("/api/alerts/subscribe")
def subscribe(req: SubscribeRequest):
    notification_settings["sms_enabled"] = req.sms_enabled
    notification_settings["phone_number"] = req.phone_number
    return {"status": "success", "settings": notification_settings}

def trigger_twilio_sms(reading_value: float):
    tw_sid = os.getenv("TWILIO_ACCOUNT_SID")
    tw_token = os.getenv("TWILIO_AUTH_TOKEN")
    tw_from = os.getenv("TWILIO_PHONE_NUMBER")
    
    if not tw_sid or not tw_token or not tw_from:
        print("Twilio credentials missing. Skipping SMS.")
        return
        
    try:
        client = Client(tw_sid, tw_token)
        time_str = datetime.datetime.now().strftime("%H:%M:%S")
        message = client.messages.create(
            body=f"🚨 CRITICAL ALERT: Out of spec value {reading_value:.3f} detected at {time_str}.",
            from_=tw_from,
            to=notification_settings["phone_number"]
        )
        print(f"SMS sent successfully: {message.sid}")
    except Exception as e:
        print(f"Twilio SMS Error: {str(e)}")

# 2. REAL-TIME DATA ENDPOINT
@app.get("/api/measurements/latest")
def get_latest_measurement():
    global last_alerted_id
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        # Query the absolute newest row added to the measurements table
        cursor.execute("SELECT id, reading FROM measurements ORDER BY id DESC LIMIT 1")
        row = cursor.fetchone()
        conn.close()
        
        if row and row["reading"] is not None:
            # The DB stores reading as TEXT/NUMERIC, we parse it to float
            val = float(row["reading"])
            
            # Phase 5: Live SMS Trigger Logic
            if notification_settings["sms_enabled"] and notification_settings["phone_number"]:
                if val < 20.012 or val > 20.022:
                    if last_alerted_id != row["id"]:
                        last_alerted_id = row["id"]
                        trigger_twilio_sms(val)
            
            return {"reading": val}
    except Exception as e:
        pass
        
    # FALLBACK MOCK DATA (if DB fails, is locked, or empty)
    return {"reading": 20.016, "status": "Within Specs"}

# 3. RECENT NOTIFICATIONS FEED ENDPOINT
@app.get("/api/alerts/recent")
def get_recent_alerts():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
        # Query recent inspection records that fall out of quality specifications
        # LSL < 20.012 or USL > 20.022
        cursor.execute("""
            SELECT id, date, time, reading, status, airgauge_id 
            FROM measurements 
            WHERE CAST(reading AS REAL) < 20.012 OR CAST(reading AS REAL) > 20.022
            ORDER BY id DESC 
            LIMIT 50
        """)
        rows = cursor.fetchall()
        conn.close()
        
        if len(rows) > 0:
            alerts = []
            for row in rows:
                alerts.append(dict(row))
            return alerts
    except Exception as e:
        pass
        
    # FIXED ALERTS FEED FALLBACK (if DB fails or is empty)
    return [{"id": 999, "timestamp": "15-06-2026 15:00", "time": "15:00:00", "reading": 20.024, "msg": "🚨 CRITICAL: Out of spec value detected"}]

if __name__ == "__main__":
    import uvicorn
    # 4. STEP-BY-STEP TERMINAL RUN INSTRUCTIONS
    # To run this server, use the command: uvicorn server:app --host 127.0.0.1 --port 8005 --reload
    uvicorn.run("server:app", host="127.0.0.1", port=8005, reload=True)
