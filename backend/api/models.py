# backend/api/models.py
from django.db import models

class AlertLog(models.Model):
    # auto_now_add=True automatically sets the time when the log is created
    timestamp = models.DateTimeField(auto_now_add=True)

    # We can make this dynamic later, but 'CO-301' is good for now
    room_id = models.CharField(max_length=100, default="CO-301")

    # This will store our alert message, e.g., "ALERT: Devices ON in Empty Room!"
    event_type = models.CharField(max_length=200)

    class Meta:
        # This makes sure the newest alerts are shown first by default
        ordering = ['-timestamp']

    def __str__(self):
        # A clean way to see the log in the admin panel
        return f"[{self.timestamp.strftime('%Y-%m-%d %H:%M')}] - {self.event_type}"