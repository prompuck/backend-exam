from rest_framework import viewsets

from apis.filters import ClassroomFilter
from apis.models import Classroom
from apis.serializers import ClassroomDetailSerializer, ClassroomSerializer


class ClassroomViewSet(viewsets.ModelViewSet):
    """API ของห้องเรียน

    list      GET    /api/v1/classrooms/        กรองด้วย school ได้
    create    POST   /api/v1/classrooms/
    detail    GET    /api/v1/classrooms/{id}/   แสดงรายชื่อครูและนักเรียนในห้อง
    update    PUT    /api/v1/classrooms/{id}/
              PATCH  /api/v1/classrooms/{id}/
    delete    DELETE /api/v1/classrooms/{id}/
    """

    # select_related กัน N+1 จากการอ่าน school.name ในทุกแถว
    queryset = Classroom.objects.select_related('school')
    serializer_class = ClassroomSerializer
    filterset_class = ClassroomFilter
    ordering_fields = ('grade', 'room', 'created_at')

    def get_queryset(self):
        queryset = super().get_queryset()

        if self.action == 'retrieve':
            # ดึงครูและนักเรียนมาล่วงหน้า เหลือแค่ 2 query แทนที่จะยิงทีละคน
            queryset = queryset.prefetch_related('teachers', 'students')

        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ClassroomDetailSerializer
        return super().get_serializer_class()
