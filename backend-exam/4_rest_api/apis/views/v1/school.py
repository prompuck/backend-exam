from django.db.models import Count
from rest_framework import viewsets

from apis.filters import SchoolFilter
from apis.models import School
from apis.serializers import SchoolDetailSerializer, SchoolSerializer


class SchoolViewSet(viewsets.ModelViewSet):
    """API ของโรงเรียน

    list      GET    /api/v1/schools/        กรองด้วย name ได้
    create    POST   /api/v1/schools/
    detail    GET    /api/v1/schools/{id}/   แสดงจำนวนห้องเรียน ครู และนักเรียน
    update    PUT    /api/v1/schools/{id}/
              PATCH  /api/v1/schools/{id}/
    delete    DELETE /api/v1/schools/{id}/
    """

    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    filterset_class = SchoolFilter
    ordering_fields = ('name', 'abbreviation', 'created_at')

    def get_queryset(self):
        queryset = super().get_queryset()

        if self.action == 'retrieve':
            # นับทั้งสามค่าในคำสั่งเดียว ไม่ต้องยิง query เพิ่มตอน serialize
            # distinct=True จำเป็นมาก เพราะการ join ข้าม classrooms ไปยัง teachers
            # และ students พร้อมกันจะทำให้แต่ละแถวถูกคูณกันจนนับเกินจริง
            queryset = queryset.annotate(
                classroom_count=Count('classrooms', distinct=True),
                teacher_count=Count('classrooms__teachers', distinct=True),
                student_count=Count('classrooms__students', distinct=True),
            )

        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SchoolDetailSerializer
        return super().get_serializer_class()
