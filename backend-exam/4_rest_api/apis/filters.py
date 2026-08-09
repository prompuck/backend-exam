from django_filters import filters
from django_filters.rest_framework import FilterSet

from apis.models import Classroom, Gender, School, Student, Teacher


class SchoolFilter(FilterSet):
    """filter สำหรับ school list"""

    # ค้นแบบบางส่วนและไม่สนตัวพิมพ์ใหญ่เล็ก เพราะเป็นการค้นหาชื่อจากผู้ใช้
    name = filters.CharFilter(lookup_expr='icontains', label='ชื่อโรงเรียน')
    abbreviation = filters.CharFilter(lookup_expr='icontains', label='ตัวย่อชื่อโรงเรียน')

    class Meta:
        model = School
        fields = ('name', 'abbreviation')


class ClassroomFilter(FilterSet):
    """filter สำหรับ classroom list"""

    school = filters.ModelChoiceFilter(queryset=School.objects.all(), label='โรงเรียน')
    grade = filters.NumberFilter(label='ชั้นปี')
    room = filters.NumberFilter(label='ทับ')

    class Meta:
        model = Classroom
        fields = ('school', 'grade', 'room')


class TeacherFilter(FilterSet):
    """filter สำหรับ teacher list

    ครูไม่ได้ผูกกับโรงเรียนโดยตรง แต่ผูกผ่านห้องเรียนที่สอน
    การกรองด้วย school จึงวิ่งข้ามความสัมพันธ์ classrooms -> school
    และต้องใส่ distinct=True กันแถวซ้ำเมื่อครูสอนหลายห้องในโรงเรียนเดียวกัน
    """

    school = filters.ModelChoiceFilter(
        field_name='classrooms__school',
        queryset=School.objects.all(),
        distinct=True,
        label='โรงเรียน',
    )
    classroom = filters.ModelChoiceFilter(
        field_name='classrooms',
        queryset=Classroom.objects.all(),
        distinct=True,
        label='ห้องเรียน',
    )
    first_name = filters.CharFilter(lookup_expr='icontains', label='ชื่อ')
    last_name = filters.CharFilter(lookup_expr='icontains', label='นามสกุล')
    gender = filters.ChoiceFilter(choices=Gender.choices, label='เพศ')

    class Meta:
        model = Teacher
        fields = ('school', 'classroom', 'first_name', 'last_name', 'gender')


class StudentFilter(FilterSet):
    """filter สำหรับ student list

    นักเรียนอยู่ได้ห้องเดียว การกรองด้วย school จึงวิ่งผ่าน classroom -> school
    ซึ่งเป็นความสัมพันธ์แบบ many-to-one ไม่ทำให้เกิดแถวซ้ำ จึงไม่ต้องใช้ distinct
    """

    school = filters.ModelChoiceFilter(
        field_name='classroom__school',
        queryset=School.objects.all(),
        label='โรงเรียน',
    )
    classroom = filters.ModelChoiceFilter(queryset=Classroom.objects.all(), label='ห้องเรียน')
    first_name = filters.CharFilter(lookup_expr='icontains', label='ชื่อ')
    last_name = filters.CharFilter(lookup_expr='icontains', label='นามสกุล')
    gender = filters.ChoiceFilter(choices=Gender.choices, label='เพศ')

    class Meta:
        model = Student
        fields = ('school', 'classroom', 'first_name', 'last_name', 'gender')
