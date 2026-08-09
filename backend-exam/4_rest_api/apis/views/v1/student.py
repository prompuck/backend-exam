from rest_framework import viewsets

from apis.filters import StudentFilter
from apis.models import Student
from apis.serializers import StudentDetailSerializer, StudentSerializer


class StudentViewSet(viewsets.ModelViewSet):
    """API ของนักเรียน

    list      GET    /api/v1/students/        กรองด้วย school, classroom, first_name, last_name, gender
    create    POST   /api/v1/students/
    detail    GET    /api/v1/students/{id}/   แสดงข้อมูลห้องเรียนที่สังกัด
    update    PUT    /api/v1/students/{id}/
              PATCH  /api/v1/students/{id}/
    delete    DELETE /api/v1/students/{id}/
    """

    # นักเรียนอยู่ห้องเดียว (fk) จึง select_related ได้ในคำสั่งเดียวกับการดึงนักเรียน
    queryset = Student.objects.select_related('classroom__school')
    serializer_class = StudentSerializer
    filterset_class = StudentFilter
    ordering_fields = ('first_name', 'last_name', 'created_at')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return StudentDetailSerializer
        return super().get_serializer_class()
