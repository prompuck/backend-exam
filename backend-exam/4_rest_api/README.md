# School REST API (Django REST Framework)

API สำหรับเก็บข้อมูลโรงเรียนและบุคลากรในโรงเรียน ตาม requirement ใน [`api_exam.md`](./api_exam.md)

---

## วิธีติดตั้งและรัน

```bash
cd 4_rest_api

python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate
python manage.py createsuperuser   # API ตั้งค่าเป็น IsAuthenticated จึงต้องมี user ก่อน
python manage.py runserver
```

เปิด `http://127.0.0.1:8000/api/v1/` เพื่อดู browsable API หรือ `http://127.0.0.1:8000/admin/` สำหรับหน้า admin

### รัน test

```bash
python manage.py test apis
```

---

## โครงสร้างโปรเจกต์

```
apis/
├── models.py              School, Classroom, Teacher, Student
├── serializers.py         serializer แยกชุดสำหรับ list/write, detail และ nested summary
├── filters.py             FilterSet ของ django_filter ทั้ง 4 resource
├── urls.py                ลงทะเบียน viewset เข้ากับ DefaultRouter ภายใต้ namespace v1
├── admin.py
├── tests.py
├── migrations/
│   └── 0001_initial.py
└── views/
    └── v1/
        ├── school.py
        ├── classroom.py
        ├── teacher.py
        └── student.py
```

---

## Data model

```
School  1 ──── n  Classroom  1 ──── n  Student
                       │
                       └──── n:n ──── Teacher
```

| Model | Field | หมายเหตุ |
| :--- | :--- | :--- |
| `School` | `name`, `abbreviation`, `address` | `name` และ `abbreviation` ต้องไม่ซ้ำ |
| `Classroom` | `school`, `grade`, `room` | `grade` = ชั้นปี, `room` = ทับ (เช่น ป.6/2 คือ `grade=6, room=2`) |
| `Teacher` | `first_name`, `last_name`, `gender`, `classrooms` | many-to-many กับ `Classroom` |
| `Student` | `first_name`, `last_name`, `gender`, `classroom` | foreign key ไปยัง `Classroom` (อยู่ได้ห้องเดียว) |

ทุก model สืบทอด `TimeStampedModel` จึงมี `created_at` และ `updated_at` ให้อัตโนมัติ

### การตัดสินใจในการออกแบบ

**1. `Classroom` ผูกกับ `School` โดยตรง**  
`api_exam.md` ระบุ field ของห้องเรียนไว้แค่ชั้นปีกับทับ แต่กำหนดให้ classroom list กรองด้วย `school` ได้ และให้ school detail นับจำนวนห้องเรียนได้ จึงต้องมี foreign key นี้

**2. `Teacher` และ `Student` ไม่มี foreign key ตรงไปยัง `School`**  
ความสัมพันธ์กับโรงเรียนถูกอนุมานผ่านห้องเรียน (`classrooms__school` และ `classroom__school`) ตามโครงสร้างที่โจทย์กำหนด การเก็บ `school` ซ้ำอีกชุดจะเปิดช่องให้ข้อมูลขัดแย้งกันเอง เช่น ครูสังกัดโรงเรียน A แต่ถูก assign เข้าห้องเรียนของโรงเรียน B

**3. `on_delete` เป็น `CASCADE` ทั้งหมด**  
เพราะ requirement กำหนดให้ทุก resource ต้องลบได้ ห้องเรียนเป็นส่วนหนึ่งของโรงเรียน และนักเรียนสังกัดห้องเรียน การลบต้นทางจึงลบข้อมูลที่สังกัดอยู่ตามไปด้วย ส่วนครูเป็น many-to-many จึงแค่ถูกถอดออกจากห้องเรียนโดยตัวครูยังอยู่

> ในระบบ production จริงควรพิจารณา `PROTECT` แทน แล้วจัดการ `ProtectedError` ให้ตอบ `409 Conflict` เพื่อกันการลบข้อมูลนักเรียนโดยไม่ตั้งใจ

**4. `UniqueConstraint` บน `(school, grade, room)`**  
กันไม่ให้สร้างห้องเรียนซ้ำในโรงเรียนเดียวกัน แต่ยังสร้างห้อง 6/1 ในคนละโรงเรียนได้ และเนื่องจาก `ModelSerializer` อ่าน `Meta.constraints` ของ model แล้วสร้าง `UniqueTogetherValidator` ให้เอง client จึงได้ `400` พร้อมข้อความอธิบายแทน `500` จาก `IntegrityError` โดยไม่ต้องเขียน `validate()` เพิ่ม — รองรับทั้ง `POST` และ `PATCH` ที่ส่งค่ามาไม่ครบ

---

## Endpoints

ทุก endpoint อยู่ภายใต้ `/api/v1/` และรองรับครบทั้ง `GET` / `POST` / `PUT` / `PATCH` / `DELETE` ตามรูปแบบของ `ModelViewSet`

| Resource | URL |
| :--- | :--- |
| school | `/api/v1/schools/` , `/api/v1/schools/{id}/` |
| classroom | `/api/v1/classrooms/` , `/api/v1/classrooms/{id}/` |
| teacher | `/api/v1/teachers/` , `/api/v1/teachers/{id}/` |
| student | `/api/v1/students/` , `/api/v1/students/{id}/` |

### Filter ที่รองรับ (ผ่าน `django_filter`)

| Resource | Query parameter |
| :--- | :--- |
| school | `name` *(ค้นบางส่วน)*, `abbreviation` *(ค้นบางส่วน)* |
| classroom | `school`, `grade`, `room` |
| teacher | `school`, `classroom`, `first_name` *(ค้นบางส่วน)*, `last_name` *(ค้นบางส่วน)*, `gender` |
| student | `school`, `classroom`, `first_name` *(ค้นบางส่วน)*, `last_name` *(ค้นบางส่วน)*, `gender` |

ใช้ร่วมกันหลายตัวได้ เช่น `/api/v1/students/?school=1&gender=female&last_name=ศรีสุข`

นอกจากนี้ยังเปิด `OrderingFilter` ไว้ด้วย เช่น `/api/v1/students/?ordering=-created_at`

### ข้อมูลเพิ่มเติมใน detail

| Resource | สิ่งที่เพิ่มขึ้นมาจาก list |
| :--- | :--- |
| school | `classroom_count`, `teacher_count`, `student_count` |
| classroom | `teachers[]`, `students[]` |
| teacher | `classrooms[]` แบบเต็ม (จาก list ที่เป็นแค่ array ของ id) |
| student | `classroom` แบบเต็ม (จาก list ที่เป็นแค่ id) |

---

## ตัวอย่างการใช้งาน

```bash
# สร้างโรงเรียน
curl -u admin:password -X POST http://127.0.0.1:8000/api/v1/schools/ \
  -H 'Content-Type: application/json' \
  -d '{"name": "โรงเรียนสาธิต", "abbreviation": "DEMO", "address": "กรุงเทพมหานคร"}'

# สร้างห้องเรียน ป.6/1
curl -u admin:password -X POST http://127.0.0.1:8000/api/v1/classrooms/ \
  -H 'Content-Type: application/json' \
  -d '{"school": 1, "grade": 6, "room": 1}'

# สร้างครูที่สอนสองห้อง
curl -u admin:password -X POST http://127.0.0.1:8000/api/v1/teachers/ \
  -H 'Content-Type: application/json' \
  -d '{"first_name": "สมชาย", "last_name": "ใจดี", "gender": "male", "classrooms": [1, 2]}'

# สร้างนักเรียน
curl -u admin:password -X POST http://127.0.0.1:8000/api/v1/students/ \
  -H 'Content-Type: application/json' \
  -d '{"first_name": "ก้อง", "last_name": "ใจดี", "gender": "male", "classroom": 1}'

# ดู detail ของโรงเรียนพร้อมจำนวนที่เกี่ยวข้อง
curl -u admin:password -H 'Accept: application/json' http://127.0.0.1:8000/api/v1/schools/1/
```

ตัวอย่าง response ของ school detail

```json
{
  "id": 1,
  "name": "โรงเรียนสาธิต",
  "abbreviation": "DEMO",
  "address": "กรุงเทพมหานคร",
  "created_at": "2026-08-09T03:11:22.104512Z",
  "updated_at": "2026-08-09T03:11:22.104512Z",
  "classroom_count": 2,
  "teacher_count": 2,
  "student_count": 3
}
```

---

## เรื่องประสิทธิภาพที่ดูแลไว้

- **school detail** ใช้ `annotate()` พร้อม `distinct=True` ทั้งสาม `Count` นับทุกอย่างในคำสั่งเดียว หากไม่ใส่ `distinct` การ join ข้าม `classrooms` ไปหา `teachers` และ `students` พร้อมกันจะทำให้แถวคูณกันจนนับเกินจริง
- **classroom** ใช้ `select_related('school')` และ `prefetch_related('teachers', 'students')` เฉพาะตอน retrieve
- **teacher** ใช้ `prefetch_related('classrooms__school')` เพราะเป็นความสัมพันธ์แบบ many-to-many
- **student** ใช้ `select_related('classroom__school')` ดึงมาในคำสั่งเดียวได้เพราะเป็น foreign key
- serializer ของ detail ถูกแยกจาก list เพื่อไม่ให้ list ต้องแบกข้อมูล nested ที่ไม่ได้ใช้
- filter ที่วิ่งข้าม many-to-many (`teacher.school`, `teacher.classroom`) ใส่ `distinct=True` กันครูคนเดียวโผล่ซ้ำหลายแถว
- เปิด pagination ไว้เป็นค่าเริ่มต้นที่หน้าละ 20 รายการ
- ใส่ index ให้ `last_name` และ `gender` ซึ่งเป็นคอลัมน์ที่ใช้กรองบ่อย

---

## หมายเหตุ

- การตั้งค่า authentication/permission และลำดับ renderer เป็นค่าที่มากับโครงสร้างเดิมของโจทย์ จึงคงไว้ตามนั้น — `DEFAULT_PERMISSION_CLASSES` เป็น `IsAuthenticated` ดังนั้นทุก request ต้องยืนยันตัวตนก่อน และเนื่องจาก `BrowsableAPIRenderer` อยู่ลำดับแรก การเรียกผ่าน `curl` ควรใส่ `-H 'Accept: application/json'` เพื่อให้ได้ JSON กลับมา
- สิ่งที่เพิ่มเข้าไปใน `settings.py` มีเพียง `OrderingFilter` และ pagination เท่านั้น
