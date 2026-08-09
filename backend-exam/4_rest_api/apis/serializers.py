from rest_framework import serializers

from apis.models import Classroom, School, Student, Teacher


# ---------------------------------------------------------------------------
# Summary serializer — ใช้เป็นข้อมูลย่อยที่ฝังอยู่ใน detail ของ resource อื่น
# แยกออกมาเพื่อไม่ให้ nested response บวมและไม่เกิดการอ้างอิงวนไปมา
# ---------------------------------------------------------------------------

class ClassroomSummarySerializer(serializers.ModelSerializer):
    """ห้องเรียนแบบย่อ ใช้ใน teacher detail และ student detail"""

    name = serializers.ReadOnlyField()
    school_name = serializers.CharField(source='school.name', read_only=True)

    class Meta:
        model = Classroom
        fields = ('id', 'school', 'school_name', 'grade', 'room', 'name')


class TeacherSummarySerializer(serializers.ModelSerializer):
    """ครูแบบย่อ ใช้ใน classroom detail"""

    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Teacher
        fields = ('id', 'first_name', 'last_name', 'full_name', 'gender')


class StudentSummarySerializer(serializers.ModelSerializer):
    """นักเรียนแบบย่อ ใช้ใน classroom detail"""

    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Student
        fields = ('id', 'first_name', 'last_name', 'full_name', 'gender')


# ---------------------------------------------------------------------------
# School
# ---------------------------------------------------------------------------

class SchoolSerializer(serializers.ModelSerializer):
    """ใช้กับ create / list / update"""

    class Meta:
        model = School
        fields = ('id', 'name', 'abbreviation', 'address', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class SchoolDetailSerializer(SchoolSerializer):
    """school detail — เพิ่มจำนวนห้องเรียน ครู และนักเรียน

    ทั้งสามค่ามาจาก annotate ใน viewset จึงไม่เกิด query เพิ่มต่อหนึ่งแถว
    """

    classroom_count = serializers.IntegerField(read_only=True)
    teacher_count = serializers.IntegerField(read_only=True)
    student_count = serializers.IntegerField(read_only=True)

    class Meta(SchoolSerializer.Meta):
        fields = SchoolSerializer.Meta.fields + (
            'classroom_count',
            'teacher_count',
            'student_count',
        )


# ---------------------------------------------------------------------------
# Classroom
# ---------------------------------------------------------------------------

class ClassroomSerializer(serializers.ModelSerializer):
    """ใช้กับ create / list / update"""

    name = serializers.ReadOnlyField()
    school_name = serializers.CharField(source='school.name', read_only=True)

    class Meta:
        model = Classroom
        fields = (
            'id', 'school', 'school_name', 'grade', 'room', 'name',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')
        # ไม่ต้องเขียน validate() กันห้องเรียนซ้ำเอง เพราะ ModelSerializer อ่าน
        # UniqueConstraint('school', 'grade', 'room') จาก Meta.constraints ของ model
        # แล้วสร้าง UniqueTogetherValidator ให้อัตโนมัติ จึงได้ 400 พร้อมข้อความอธิบาย
        # แทนที่จะเป็น 500 จาก IntegrityError อยู่แล้ว และรองรับ partial update ให้ด้วย
        # โดยเติมค่าที่ client ไม่ได้ส่งมาจาก instance เดิม


class ClassroomDetailSerializer(ClassroomSerializer):
    """classroom detail — เพิ่มรายชื่อครูและนักเรียนในห้องเรียนนั้น"""

    teachers = TeacherSummarySerializer(many=True, read_only=True)
    students = StudentSummarySerializer(many=True, read_only=True)

    class Meta(ClassroomSerializer.Meta):
        fields = ClassroomSerializer.Meta.fields + ('teachers', 'students')


# ---------------------------------------------------------------------------
# Teacher
# ---------------------------------------------------------------------------

class TeacherSerializer(serializers.ModelSerializer):
    """ใช้กับ create / list / update — รับ classrooms เป็น list ของ id"""

    full_name = serializers.ReadOnlyField()
    classrooms = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Classroom.objects.all(),
        required=False,
    )

    class Meta:
        model = Teacher
        fields = (
            'id', 'first_name', 'last_name', 'full_name', 'gender', 'classrooms',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class TeacherDetailSerializer(TeacherSerializer):
    """teacher detail — แสดงรายการห้องเรียนแบบเต็มแทนที่จะเป็นแค่ id"""

    classrooms = ClassroomSummarySerializer(many=True, read_only=True)


# ---------------------------------------------------------------------------
# Student
# ---------------------------------------------------------------------------

class StudentSerializer(serializers.ModelSerializer):
    """ใช้กับ create / list / update — รับ classroom เป็น id เดียว"""

    full_name = serializers.ReadOnlyField()
    classroom_name = serializers.CharField(source='classroom.name', read_only=True)

    class Meta:
        model = Student
        fields = (
            'id', 'first_name', 'last_name', 'full_name', 'gender',
            'classroom', 'classroom_name',
            'created_at', 'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')


class StudentDetailSerializer(StudentSerializer):
    """student detail — แสดงข้อมูลห้องเรียนแบบเต็มแทนที่จะเป็นแค่ id"""

    classroom = ClassroomSummarySerializer(read_only=True)
