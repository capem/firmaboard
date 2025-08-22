from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import UploadedFileSerializer
from .models import UploadedFile
import logging

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_file(request):
    """
    Accept a multipart/form-data upload and store file bytes in the database.
    Fields:
      - file: the uploaded file
      - import_job (optional): ID of ImportJob to associate
    Returns metadata for the stored file.
    """
    try:
        uploaded_file = request.FILES.get("file")
        if not uploaded_file:
            return Response(
                {"detail": "No file provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Read bytes once
        file_bytes = uploaded_file.read()

        # Create the record directly to avoid serializer BinaryField input format issues
        # Coerce optional import_job to FK id if provided
        import_job_val = request.data.get("import_job")
        import_job_id = None
        if import_job_val not in (None, "", "null"):
            try:
                import_job_id = int(import_job_val)
            except (TypeError, ValueError):
                logger.warning("Invalid import_job value provided: %r", import_job_val)
                import_job_id = None

        instance = UploadedFile.objects.create(
            name=uploaded_file.name,
            content_type=uploaded_file.content_type or "application/octet-stream",
            size=uploaded_file.size,
            data=file_bytes,
            uploaded_by=request.user,
            import_job_id=import_job_id,
        )

        # Return serialized metadata
        return Response(
            UploadedFileSerializer(instance).data, status=status.HTTP_201_CREATED
        )

    except Exception as e:
        logger.exception("Error while handling file upload")
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
