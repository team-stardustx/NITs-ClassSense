# app.py
from flask import Flask, Response, jsonify
import cv2
import time
from ultralytics import YOLO

# --- Configuration ---
app = Flask(__name__)

# --- NEW: Define the classes we want to detect ---
# YOLO Class IDs: 0 = 'person', 62 = 'tvmonitor', 63 = 'laptop'
# We will count monitors and laptops as "devices".
CLASSES_TO_DETECT = [0, 62, 63]

# Load the YOLOv8 model
model = YOLO("yolov8n.pt")
model.classes = CLASSES_TO_DETECT # Tell the model to ONLY find these classes

# Use global variables to store counts
global_person_count = 0
global_device_count = 0 # --- NEW: Add a device counter ---

# --- Video Streaming (with AI) ---

def generate_frames():
    """Reads from the video source, performs AI detection, 
    and streams the annotated video."""
    
    global global_person_count, global_device_count # Use global variables
    
    # --- This is the part you will change tomorrow ---
    # VIDEO_SOURCE = "placeholder.mp4" # Use placeholder for today
    # VIDEO_SOURCE = "p1.mp4" # Use placeholder for today
    # VIDEO_SOURCE = "p2.mp4" # Use placeholder for today
    VIDEO_SOURCE = "p3.mp4" # Use placeholder for today
    # VIDEO_SOURCE = "rtsp://admin:YOUR_PASSWORD@172.16.30.2:554/unicast/c1/s0/live"
    # ---
    
    while True:
        video_capture = cv2.VideoCapture(VIDEO_SOURCE)
        if not video_capture.isOpened():
            print(f"Error: Could not open video source: {VIDEO_SOURCE}")
            global_person_count = -1 # Error code
            global_device_count = -1 # Error code
            time.sleep(5)
            continue

        while True:
            success, frame = video_capture.read()
            if not success:
                print("Video stream ended or failed. Reconnecting...")
                break # Break inner loop to reconnect

            # 1. Run AI detection on the frame
            results = model(frame, verbose=False)

            # --- NEW: Count people and devices separately ---
            person_count = 0
            device_count = 0
            
            # Loop through all detected boxes
            for box in results[0].boxes:
                class_id = int(box.cls[0]) # Get the class ID
                if class_id == 0:
                    person_count += 1
                elif class_id in [62, 63]:
                    device_count += 1
            
            global_person_count = person_count
            global_device_count = device_count
            # --- End of NEW counting logic ---

            # 3. Draw all detection boxes on the frame
            annotated_frame = results[0].plot()

            # 4. Encode the ANNOTATED frame as JPEG
            ret, buffer = cv2.imencode('.jpg', annotated_frame)
            if not ret:
                print("Failed to encode frame")
                continue
                
            frame_bytes = buffer.tobytes()
            
            # 5. Yield the frame to the browser
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
            
            time.sleep(1/30) 

        video_capture.release()

@app.route('/video_feed')
def video_feed():
    """Video streaming route. Streams annotated video."""
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')

# --- API for Django ---

@app.route('/api/detection_status')
def detection_status():
    """Provides the person AND device count to the Django backend."""
    # --- NEW: Return both counts ---
    return jsonify({
        "person_count": global_person_count,
        "device_count": global_device_count 
    })

# --- Main ---
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, threaded=True)