from rest_framework import serializers
from .models import UploadedFile

class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ['id', 'name', 'content_type', 'size', 'data', 'uploaded_at', 'uploaded_by', 'import_job']
        read_only_fields = ['id', 'uploaded_at', 'uploaded_by']

