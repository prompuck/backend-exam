from django.db import models


class Gender(models.TextChoices):
    """เพศของบุคลากรในโรงเรียน"""

    MALE = 'male', 'ชาย'
    FEMALE = 'female', 'หญิง'
    OTHER = 'other', 'อื่น ๆ'


class TimeStampedModel(models.Model):
    """base class สำหรับเก็บเวลาสร้าง/แก้ไขล่าสุดของทุกตาราง"""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class School(TimeStampedModel):
    """โรงเรียน"""

    name = models.CharField(max_length=255, unique=True)          # ชื่อโรงเรียน
    abbreviation = models.CharField(max_length=20, unique=True)   # ตัวย่อชื่อโรงเรียน
    address = models.TextField()                                  # ที่อยู่

    class Meta:
        ordering = ('name',)

    def __str__(self):
        return self.name


class Classroom(TimeStampedModel):
    """ห้องเรียน เช่น ป.6/2 -> grade = 6, room = 2

    ห้องเรียนต้องสังกัดโรงเรียนเสมอ เพราะ requirement กำหนดให้กรอง classroom ด้วย school
    และให้ school detail นับจำนวนห้องเรียนได้
    """

    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name='classrooms')
    grade = models.PositiveSmallIntegerField()  # ชั้นปี
    room = models.PositiveSmallIntegerField()   # ทับ

    class Meta:
        ordering = ('school', 'grade', 'room')
        constraints = [
            # ในโรงเรียนเดียวกันห้ามมีห้องเรียนชั้นปี/ทับ ซ้ำกัน
            models.UniqueConstraint(
                fields=('school', 'grade', 'room'),
                name='unique_classroom_per_school',
            ),
        ]

    def __str__(self):
        return f'{self.school.abbreviation} {self.name}'

    @property
    def name(self) -> str:
        return f'{self.grade}/{self.room}'


class Person(TimeStampedModel):
    """ข้อมูลพื้นฐานของบุคลากร ใช้ร่วมกันระหว่างครูและนักเรียน"""

    first_name = models.CharField(max_length=150)  # ชื่อ
    last_name = models.CharField(max_length=150)   # นามสกุล
    gender = models.CharField(max_length=10, choices=Gender.choices)  # เพศ

    class Meta:
        abstract = True
        ordering = ('first_name', 'last_name')

    def __str__(self):
        return self.full_name

    @property
    def full_name(self) -> str:
        return f'{self.first_name} {self.last_name}'


class Teacher(Person):
    """ครู — อยู่ได้หลายห้องเรียน และแต่ละห้องเรียนก็มีครูได้หลายคน (many-to-many)"""

    classrooms = models.ManyToManyField(Classroom, related_name='teachers', blank=True)

    class Meta:
        ordering = ('first_name', 'last_name')
        indexes = [
            models.Index(fields=['last_name'], name='teacher_last_name_idx'),
            models.Index(fields=['gender'], name='teacher_gender_idx'),
        ]


class Student(Person):
    """นักเรียน — อยู่ได้เพียงห้องเรียนเดียว แต่ห้องเรียนหนึ่งมีนักเรียนได้หลายคน (many-to-one)"""

    classroom = models.ForeignKey(Classroom, on_delete=models.CASCADE, related_name='students')

    class Meta:
        ordering = ('first_name', 'last_name')
        indexes = [
            models.Index(fields=['last_name'], name='student_last_name_idx'),
            models.Index(fields=['gender'], name='student_gender_idx'),
        ]
