from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import StoryArc
from .serializers import StoryArcSerializer


class StoryArcViewSet(viewsets.ModelViewSet):
    queryset = StoryArc.objects.all()
    serializer_class = StoryArcSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
