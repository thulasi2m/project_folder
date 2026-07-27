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

# IN-MEMORY STORAGE FOR LIVE DATA UPLOADS FROM ERP
latest_live_reading = None

# IN-MEMORY STORAGE FOR OTP
otp_store = {}

# AUTHENTICATION ENDPOINTS
class LoginRequest(BaseModel):
    password: str

class ResetPasswordRequest(BaseModel):
    username: str
    new_password: str

class OtpSendRequest(BaseModel):
    phone: str

class OtpVerifyRequest(BaseModel):
    phone: str
    code: str

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

@app.post("/api/auth/send-otp")
def send_otp(req: OtpSendRequest):
    import random
    code = str(random.randint(1000, 9999))
    otp_store[req.phone] = code
    
    tw_sid = os.getenv("TWILIO_ACCOUNT_SID")
    tw_token = os.getenv("TWILIO_AUTH_TOKEN")
    tw_from = os.getenv("TWILIO_PHONE_NUMBER")
    
    if tw_sid and tw_token and tw_from:
        try:
            client = Client(tw_sid, tw_token)
            client.messages.create(
                body=f"Your Cherry Precision verification code is: {code}",
                from_=tw_from,
                to=req.phone
            )
            return {"status": "success", "message": "OTP sent"}
        except Exception as e:
            print(f"Twilio SMS Error: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to send SMS: {str(e)}")
    else:
        print(f"MOCK SMS to {req.phone}: Your code is {code}")
        return {"status": "success", "message": "MOCK OTP sent"}

@app.post("/api/auth/verify-otp")
def verify_otp(req: OtpVerifyRequest):
    if req.phone in otp_store and otp_store[req.phone] == req.code:
        del otp_store[req.phone]
        return {"status": "success"}
    raise HTTPException(status_code=400, detail="Invalid OTP")

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

@app.post("/api/data/upload")
def upload_live_data(data: dict):
    global latest_live_reading
    latest_live_reading = data
    return {"status": "success", "message": "Data received"}

# 2. LIVE DATA ENDPOINT (Specific to an Air Gauge)
@app.get("/api/data/live/{airgauge_id}")
def get_live_data(airgauge_id: str):
    global latest_live_reading
    
    # Use uploaded ERP data if available
    if latest_live_reading:
        val = float(latest_live_reading.get("reading", 0))
        status = latest_live_reading.get("status", "Unknown")
        return {"reading": val, "status": status}
        
    # FALLBACK MOCK DATA (if no data uploaded yet)
    return {"reading": 20.016, "status": "Waiting for ERP Data"}

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
    # To run this server, use the command: uvicorn server:app --host 0.0.0.0 --port 8005 --reload
    uvicorn.run("server:app", host="0.0.0.0", port=8005, reload=True)
