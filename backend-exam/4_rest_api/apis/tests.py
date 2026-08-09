from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apis.models import Classroom, Gender, School, Student, Teacher


class BaseAPITestCase(APITestCase):
    """เตรียมข้อมูลตัวอย่างและ login ไว้ให้ทุก test case

    โครงสร้างข้อมูลที่ใช้ทดสอบ
      โรงเรียนสาธิต (DEMO)
        - ห้อง 6/1  ครู: สมชาย, สมหญิง   นักเรียน: ก้อง, ขวัญ
        - ห้อง 6/2  ครู: สมชาย            นักเรียน: คมสัน
      โรงเรียนวัดใหม่ (WATMAI)
        - ห้อง 1/1  ครู: มานี             นักเรียน: งามตา
    """

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(username='examiner', password='exam-pass-1234')

        cls.demo = School.objects.create(
            name='โรงเรียนสาธิต', abbreviation='DEMO', address='กรุงเทพมหานคร'
        )
        cls.watmai = School.objects.create(
            name='โรงเรียนวัดใหม่', abbreviation='WATMAI', address='นนทบุรี'
        )

        cls.demo_61 = Classroom.objects.create(school=cls.demo, grade=6, room=1)
        cls.demo_62 = Classroom.objects.create(school=cls.demo, grade=6, room=2)
        cls.watmai_11 = Classroom.objects.create(school=cls.watmai, grade=1, room=1)

        # สมชายสอนสองห้องในโรงเรียนเดียวกัน ใช้ทดสอบว่า filter/count ไม่นับซ้ำ
        cls.somchai = Teacher.objects.create(
            first_name='สมชาย', last_name='ใจดี', gender=Gender.MALE
        )
        cls.somchai.classrooms.set([cls.demo_61, cls.demo_62])

        cls.somying = Teacher.objects.create(
            first_name='สมหญิง', last_name='ใจงาม', gender=Gender.FEMALE
        )
        cls.somying.classrooms.set([cls.demo_61])

        cls.manee = Teacher.objects.create(
            first_name='มานี', last_name='รักเรียน', gender=Gender.FEMALE
        )
        cls.manee.classrooms.set([cls.watmai_11])

        cls.kong = Student.objects.create(
            first_name='ก้อง', last_name='ใจดี', gender=Gender.MALE, classroom=cls.demo_61
        )
        cls.kwan = Student.objects.create(
            first_name='ขวัญ', last_name='ศรีสุข', gender=Gender.FEMALE, classroom=cls.demo_61
        )
        cls.komsan = Student.objects.create(
            first_name='คมสัน', last_name='ศรีสุข', gender=Gender.MALE, classroom=cls.demo_62
        )
        cls.ngamta = Student.objects.create(
            first_name='งามตา', last_name='บุญมี', gender=Gender.FEMALE, classroom=cls.watmai_11
        )

    def setUp(self):
        self.client.force_authenticate(user=self.user)
        # settings กำหนดให้ BrowsableAPIRenderer มาเป็นลำดับแรก ถ้าไม่ระบุ Accept
        # การ negotiate จะเลือก renderer ตัวนั้นซึ่งแปลง 204 ของ DELETE เป็น 200
        # เพื่อให้แสดงหน้า HTML ได้ จึงขอ JSON ให้เหมือน client จริงที่เรียก API
        self.client.credentials(HTTP_ACCEPT='application/json')

    @staticmethod
    def results(response):
        """ดึงรายการออกจาก response ที่ถูกแบ่งหน้าแล้ว"""
        return response.data['results']

    def ids(self, response):
        return {item['id'] for item in self.results(response)}


class AuthenticationTests(BaseAPITestCase):

    def test_anonymous_user_is_rejected(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('v1:school-list'))
        self.assertIn(
            response.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )


class SchoolAPITests(BaseAPITestCase):

    def test_create_school(self):
        payload = {'name': 'โรงเรียนบ้านนา', 'abbreviation': 'BANNA', 'address': 'ชลบุรี'}
        response = self.client.post(reverse('v1:school-list'), payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(School.objects.filter(name='โรงเรียนบ้านนา').exists())

    def test_create_school_with_duplicated_name_is_rejected(self):
        payload = {'name': 'โรงเรียนสาธิต', 'abbreviation': 'DEMO2', 'address': 'กรุงเทพมหานคร'}
        response = self.client.post(reverse('v1:school-list'), payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_school(self):
        response = self.client.get(reverse('v1:school-list'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)

    def test_list_school_can_filter_with_name(self):
        response = self.client.get(reverse('v1:school-list'), {'name': 'สาธิต'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.ids(response), {self.demo.id})

    def test_school_detail_returns_related_counts(self):
        response = self.client.get(reverse('v1:school-detail', args=[self.demo.id]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['classroom_count'], 2)
        # สมชายสอนสองห้อง แต่ต้องถูกนับเป็นครูคนเดียว
        self.assertEqual(response.data['teacher_count'], 2)
        self.assertEqual(response.data['student_count'], 3)

    def test_update_school(self):
        response = self.client.patch(
            reverse('v1:school-detail', args=[self.demo.id]),
            {'address': 'ปทุมธานี'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.demo.refresh_from_db()
        self.assertEqual(self.demo.address, 'ปทุมธานี')

    def test_delete_school(self):
        response = self.client.delete(reverse('v1:school-detail', args=[self.watmai.id]))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(School.objects.filter(pk=self.watmai.id).exists())
        # ห้องเรียนและนักเรียนที่สังกัดอยู่ต้องถูกลบตามไปด้วย
        self.assertFalse(Classroom.objects.filter(pk=self.watmai_11.id).exists())
        self.assertFalse(Student.objects.filter(pk=self.ngamta.id).exists())


class ClassroomAPITests(BaseAPITestCase):

    def test_create_classroom(self):
        payload = {'school': self.demo.id, 'grade': 5, 'room': 3}
        response = self.client.post(reverse('v1:classroom-list'), payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], '5/3')

    def test_create_duplicated_classroom_is_rejected(self):
        payload = {'school': self.demo.id, 'grade': 6, 'room': 1}
        response = self.client.post(reverse('v1:classroom-list'), payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_classroom_into_existing_one_is_rejected(self):
        """แก้ห้อง 6/2 ให้กลายเป็น 6/1 ที่มีอยู่แล้วต้องไม่ผ่าน

        เคสนี้ยืนยันว่า UniqueTogetherValidator ที่ DRF สร้างให้อัตโนมัติ
        เติมค่า school กับ grade จาก instance เดิมให้ตอนส่ง PATCH มาไม่ครบ
        """
        response = self.client.patch(
            reverse('v1:classroom-detail', args=[self.demo_62.id]),
            {'room': 1},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_same_classroom_number_in_another_school_is_allowed(self):
        payload = {'school': self.watmai.id, 'grade': 6, 'room': 1}
        response = self.client.post(reverse('v1:classroom-list'), payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_classroom_can_filter_with_school(self):
        response = self.client.get(reverse('v1:classroom-list'), {'school': self.demo.id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.ids(response), {self.demo_61.id, self.demo_62.id})

    def test_classroom_detail_returns_teachers_and_students(self):
        response = self.client.get(reverse('v1:classroom-detail', args=[self.demo_61.id]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            {teacher['id'] for teacher in response.data['teachers']},
            {self.somchai.id, self.somying.id},
        )
        self.assertEqual(
            {student['id'] for student in response.data['students']},
            {self.kong.id, self.kwan.id},
        )

    def test_update_classroom(self):
        response = self.client.patch(
            reverse('v1:classroom-detail', args=[self.demo_62.id]),
            {'room': 9},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.demo_62.refresh_from_db()
        self.assertEqual(self.demo_62.room, 9)

    def test_delete_classroom(self):
        response = self.client.delete(reverse('v1:classroom-detail', args=[self.demo_62.id]))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Classroom.objects.filter(pk=self.demo_62.id).exists())
        # ครูไม่ถูกลบตาม เพียงแต่หลุดออกจากห้องเรียนนั้น
        self.assertTrue(Teacher.objects.filter(pk=self.somchai.id).exists())
        self.assertEqual(list(self.somchai.classrooms.all()), [self.demo_61])


class TeacherAPITests(BaseAPITestCase):

    def test_create_teacher_with_classrooms(self):
        payload = {
            'first_name': 'ปิติ',
            'last_name': 'ตั้งใจ',
            'gender': Gender.MALE,
            'classrooms': [self.demo_61.id, self.watmai_11.id],
        }
        response = self.client.post(reverse('v1:teacher-list'), payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        teacher = Teacher.objects.get(pk=response.data['id'])
        self.assertEqual(teacher.classrooms.count(), 2)

    def test_create_teacher_without_classroom_is_allowed(self):
        payload = {'first_name': 'วีระ', 'last_name': 'ขยัน', 'gender': Gender.MALE}
        response = self.client.post(reverse('v1:teacher-list'), payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_list_teacher_can_filter_with_school(self):
        response = self.client.get(reverse('v1:teacher-list'), {'school': self.demo.id})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # สมชายสอนสองห้องในโรงเรียนนี้ แต่ต้องปรากฏในผลลัพธ์แค่ครั้งเดียว
        self.assertEqual(len(self.results(response)), 2)
        self.assertEqual(self.ids(response), {self.somchai.id, self.somying.id})

    def test_list_teacher_can_filter_with_classroom(self):
        response = self.client.get(reverse('v1:teacher-list'), {'classroom': self.demo_62.id})

        self.assertEqual(self.ids(response), {self.somchai.id})

    def test_list_teacher_can_filter_with_first_name(self):
        response = self.client.get(reverse('v1:teacher-list'), {'first_name': 'สมหญิง'})

        self.assertEqual(self.ids(response), {self.somying.id})

    def test_list_teacher_can_filter_with_last_name(self):
        response = self.client.get(reverse('v1:teacher-list'), {'last_name': 'ใจ'})

        self.assertEqual(self.ids(response), {self.somchai.id, self.somying.id})

    def test_list_teacher_can_filter_with_gender(self):
        response = self.client.get(reverse('v1:teacher-list'), {'gender': Gender.FEMALE})

        self.assertEqual(self.ids(response), {self.somying.id, self.manee.id})

    def test_teacher_detail_returns_classroom_list(self):
        response = self.client.get(reverse('v1:teacher-detail', args=[self.somchai.id]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            {classroom['id'] for classroom in response.data['classrooms']},
            {self.demo_61.id, self.demo_62.id},
        )
        self.assertEqual(response.data['classrooms'][0]['school_name'], self.demo.name)

    def test_update_teacher_classrooms(self):
        response = self.client.patch(
            reverse('v1:teacher-detail', args=[self.somchai.id]),
            {'classrooms': [self.watmai_11.id]},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(list(self.somchai.classrooms.all()), [self.watmai_11])

    def test_delete_teacher(self):
        response = self.client.delete(reverse('v1:teacher-detail', args=[self.manee.id]))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Teacher.objects.filter(pk=self.manee.id).exists())
        # ลบครูแล้วห้องเรียนต้องยังอยู่
        self.assertTrue(Classroom.objects.filter(pk=self.watmai_11.id).exists())


class StudentAPITests(BaseAPITestCase):

    def test_create_student(self):
        payload = {
            'first_name': 'จันทร์',
            'last_name': 'เพ็ญ',
            'gender': Gender.FEMALE,
            'classroom': self.demo_62.id,
        }
        response = self.client.post(reverse('v1:student-list'), payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['classroom_name'], '6/2')

    def test_create_student_without_classroom_is_rejected(self):
        payload = {'first_name': 'จันทร์', 'last_name': 'เพ็ญ', 'gender': Gender.FEMALE}
        response = self.client.post(reverse('v1:student-list'), payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_student_can_filter_with_school(self):
        response = self.client.get(reverse('v1:student-list'), {'school': self.demo.id})

        self.assertEqual(self.ids(response), {self.kong.id, self.kwan.id, self.komsan.id})

    def test_list_student_can_filter_with_classroom(self):
        response = self.client.get(reverse('v1:student-list'), {'classroom': self.demo_61.id})

        self.assertEqual(self.ids(response), {self.kong.id, self.kwan.id})

    def test_list_student_can_filter_with_first_name(self):
        response = self.client.get(reverse('v1:student-list'), {'first_name': 'ก้อง'})

        self.assertEqual(self.ids(response), {self.kong.id})

    def test_list_student_can_filter_with_last_name(self):
        response = self.client.get(reverse('v1:student-list'), {'last_name': 'ศรีสุข'})

        self.assertEqual(self.ids(response), {self.kwan.id, self.komsan.id})

    def test_list_student_can_filter_with_gender(self):
        response = self.client.get(reverse('v1:student-list'), {'gender': Gender.MALE})

        self.assertEqual(self.ids(response), {self.kong.id, self.komsan.id})

    def test_list_student_can_combine_filters(self):
        response = self.client.get(
            reverse('v1:student-list'),
            {'school': self.demo.id, 'gender': Gender.FEMALE},
        )

        self.assertEqual(self.ids(response), {self.kwan.id})

    def test_student_detail_returns_classroom(self):
        response = self.client.get(reverse('v1:student-detail', args=[self.kong.id]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['classroom']['id'], self.demo_61.id)
        self.assertEqual(response.data['classroom']['name'], '6/1')
        self.assertEqual(response.data['classroom']['school_name'], self.demo.name)

    def test_update_student_classroom(self):
        response = self.client.patch(
            reverse('v1:student-detail', args=[self.kong.id]),
            {'classroom': self.demo_62.id},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.kong.refresh_from_db()
        self.assertEqual(self.kong.classroom, self.demo_62)

    def test_delete_student(self):
        response = self.client.delete(reverse('v1:student-detail', args=[self.komsan.id]))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Student.objects.filter(pk=self.komsan.id).exists())
