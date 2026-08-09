from rest_framework import viewsets

from apis.filters import TeacherFilter
from apis.models import Teacher
from apis.serializers import TeacherDetailSerializer, TeacherSerializer


class TeacherViewSet(viewsets.ModelViewSet):
    """API ของครู

    list      GET    /api/v1/teachers/        กรองด้วย school, classroom, first_name, last_name, gender
    create    POST   /api/v1/teachers/
    detail    GET    /api/v1/teachers/{id}/   แสดงรายการห้องเรียนที่สอน
    update    PUT    /api/v1/teachers/{id}/
              PATCH  /api/v1/teachers/{id}/
    delete    DELETE /api/v1/teachers/{id}/
    """

    # ครูมีหลายห้องเรียน (m2m) จึงใช้ prefetch_related และดึง school ที่ผูกกับห้องมาด้วย
    queryset = Teacher.objects.prefetch_related('classrooms__school')
    serializer_class = TeacherSerializer
    filterset_class = TeacherFilter
    ordering_fields = ('first_name', 'last_name', 'created_at')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TeacherDetailSerializer
        return super().get_serializer_class()
