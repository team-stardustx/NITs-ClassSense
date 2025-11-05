# backend/api/views.py
from django.http import JsonResponse
import requests
from .models import AlertLog 

DETECTION_SERVER_URL = "http://127.0.0.1:5000/api/detection_status"

def get_status(request):
    """
    Fetches the person AND device count from the detection server
    and returns the classroom status based on FULL project logic.
    """
    try:
        # 1. Call the detection server
        response = requests.get(DETECTION_SERVER_URL, timeout=2)
        response.raise_for_status()
        
        detection_data = response.json()
        person_count = detection_data.get("person_count", 0)
        device_count = detection_data.get("device_count", 0)

        # 2. Apply the FULL project logic from your PPT
        if person_count == -1: # Error code from app.py
            occupancy_status = "Error"
            device_status = "N/A"
            alert_message = "ALERT: Video Stream Offline!"
        
        elif person_count > 0:
            occupancy_status = f"{person_count} Person(s) Detected"
            device_status = "N/A (Room Occupied)"
            alert_message = "All Clear (Room Occupied)"
        
        else: # person_count is 0 (Room is Empty)
            occupancy_status = "Empty"
            if device_count > 0:
                device_status = f"{device_count} Device(s) ON"
                alert_message = "ALERT: Devices ON in Empty Room!"
            else:
                device_status = "Devices OFF"
                alert_message = "All Clear (Room Empty, Devices OFF)"

    except requests.exceptions.RequestException as e:
        print(f"Error calling detection server: {e}")
        occupancy_status = "Error"
        device_status = "N/A"
        alert_message = "ALERT: Detection Server Offline!"
    
    
    # --- Block to save log ---
    # We check if it's not one of the "server offline" alerts
    if alert_message.startswith("ALERT") and "Offline" not in alert_message:
        try:
            # Check if the last log was the same, to avoid spamming
            last_log = AlertLog.objects.first() # Gets the most recent log
            if last_log is None or last_log.event_type != alert_message:
                AlertLog.objects.create(event_type=alert_message)
        
        # --- FIX 1: Completed the 'except' block ---
        except Exception as e:
            # If saving fails, just print an error
            print(f"Failed to save alert to database: {e}")

    
    # --- FIX 2: Added the missing end of the function ---
    data = {
        "occupancy": occupancy_status,
        "device_status": device_status,
        "alert": alert_message
    }
    return JsonResponse(data)


# --- This is the second function from your paste ---

def get_alert_logs(request):
    """
    Fetches the 100 most recent alert logs from the database
    and returns them as JSON.
    """
    try:
        # Get the 100 most recent logs from the AlertLog table
        # We already set the default ordering in models.py
        logs = AlertLog.objects.all()[:100]
        
        # Format the data into a list of dictionaries
        data = [
            {
                "id": log.id,
                "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                # --- FIX 3: Corrected 'log.log.room_id' to 'log.room_id' ---
                "room_id": log.room_id,
                "event_type": log.event_type
            }
            for log in logs
        ]
        
        return JsonResponse(data, safe=False) # safe=False is needed to send a list
        
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)