from rest_framework import serializers
from .models import StoryArc

class StoryArcSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoryArc
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'author']
