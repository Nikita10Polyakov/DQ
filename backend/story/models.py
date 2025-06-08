from django.db import models
from django.conf import settings

class StoryArc(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    graph_json = models.JSONField(blank=True, null=True) 

    def __str__(self):
        return self.title
