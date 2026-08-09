# Database Index

Index คือโครงสร้างที่ช่วยให้ Database ค้นหาข้อมูลได้เร็วขึ้น โดยไม่ต้องอ่านข้อมูลทุกแถวใน Table

ตัวอย่างเช่น ถ้ามี Table `users` ที่มีข้อมูลจำนวนมาก และมี Query

```sql
SELECT *
FROM users
WHERE email = 'test@example.com';
```

ถ้า `email` มี Index Database สามารถใช้ Index เพื่อค้นหา record ที่ต้องการได้ แทนที่จะต้องค้นหาทีละแถว

## ข้อดีของ Index

### 1. ทำให้การค้นหาข้อมูลเร็วขึ้น

เหมาะกับ Column ที่ถูกใช้ใน `WHERE` บ่อย ๆ เช่น

```sql
SELECT *
FROM users
WHERE email = 'test@example.com';
```

ถ้า `email` มี Index การค้นหาข้อมูลจะเร็วขึ้น โดยเฉพาะเมื่อ Table มีข้อมูลจำนวนมาก

### 2. ช่วยในการ JOIN

ถ้ามีการ JOIN ตารางด้วย Column ที่มี Index Database สามารถค้นหาข้อมูลที่เกี่ยวข้องได้เร็วขึ้น

```sql
SELECT *
FROM orders o
JOIN users u
    ON o.user_id = u.id;
```

### 3. ช่วยเรื่อง ORDER BY

Index สามารถช่วย Query ที่มีการเรียงข้อมูลได้ เช่น

```sql
SELECT *
FROM orders
ORDER BY created_at DESC;
```

ถ้ามี Index ที่เหมาะสม Database อาจใช้ Index ในการอ่านข้อมูลตามลำดับได้

### 4. ใช้ป้องกันข้อมูลซ้ำได้

สามารถใช้ Unique Index เพื่อป้องกันข้อมูลซ้ำ เช่น

```sql
CREATE UNIQUE INDEX idx_users_email
ON users(email);
```

ทำให้ไม่สามารถมี User ที่ใช้ `email` เดียวกันได้

---

## ข้อเสียของ Index

### 1. ทำให้การเพิ่มและแก้ไขข้อมูลมีต้นทุนเพิ่ม

เมื่อมีการ `INSERT`, `UPDATE` หรือ `DELETE` Database ต้องปรับข้อมูลใน Index ที่เกี่ยวข้องด้วย

ดังนั้นถ้ามี Index เยอะเกินไป การเขียนข้อมูลอาจช้าลง

### 2. ใช้พื้นที่เพิ่ม

Index ต้องใช้พื้นที่ในการจัดเก็บเพิ่มเติม ดังนั้นถ้าสร้าง Index จำนวนมากก็จะใช้พื้นที่เพิ่มขึ้น

### 3. ไม่ใช่ทุก Query ที่จะใช้ Index

การมี Index ไม่ได้หมายความว่า Database จะเลือกใช้เสมอ

เช่น Column ที่มีค่าซ้ำกันจำนวนมาก Database อาจเลือก Full Table Scan เพราะอาจเร็วกว่าใช้ Index

ดังนั้นควรดู Execution Plan ก่อนตัดสินใจเพิ่ม Index

---

## Composite Index

Composite Index คือ Index ที่มีหลาย Column

ตัวอย่าง

```sql
CREATE INDEX idx_student_classroom_name
ON students(classroom_id, last_name);
```

Index นี้เหมาะกับ Query เช่น

```sql
SELECT *
FROM students
WHERE classroom_id = 10
AND last_name = 'สมชาย';
```

ลำดับของ Column มีความสำคัญ เช่น Index

```text
(classroom_id, last_name)
```

จะเหมาะกับการค้นหาที่เริ่มจาก `classroom_id`

ถ้าค้นหาด้วย `last_name` อย่างเดียว Index นี้อาจไม่สามารถใช้ได้อย่างเต็มประสิทธิภาพ

---

## ตัวอย่าง Query ที่ทำให้ใช้ Index ได้ไม่ดี

เช่น

```sql
SELECT *
FROM orders
WHERE YEAR(created_at) = 2026;
```

ถ้า `created_at` มี Index การใช้ Function กับ Column อาจทำให้ Database ใช้ Index ได้ไม่เต็มประสิทธิภาพ

สามารถเปลี่ยนเป็น

```sql
SELECT *
FROM orders
WHERE created_at >= '2026-01-01'
AND created_at < '2027-01-01';
```

อีกตัวอย่างคือ

```sql
WHERE name LIKE '%สมชาย%'
```

การใช้ `%` ด้านหน้าอาจทำให้ B-Tree Index ไม่สามารถช่วยค้นหาได้ดี

---

## ควรสร้าง Index เมื่อไหร่

ก่อนสร้าง Index ควรดูว่า Query ไหนใช้งานบ่อยหรือทำงานช้า แล้วใช้ `EXPLAIN` หรือ `EXPLAIN ANALYZE` ตรวจสอบ Execution Plan

ตัวอย่างขั้นตอนที่ใช้คือ

1. ดู Query ที่ทำงานช้า
2. ตรวจสอบ Execution Plan
3. ดูว่า Database ใช้ Index หรือ Full Table Scan
4. เพิ่มหรือปรับ Index ตาม Query
5. ทดสอบความเร็วอีกครั้ง

ไม่ควรสร้าง Index ทุก Column เพราะจะทำให้ใช้พื้นที่เพิ่มและทำให้การเขียนข้อมูลมีต้นทุนเพิ่มขึ้น

## สรุป

Index ช่วยให้ Database ค้นหาข้อมูลได้เร็วขึ้น แต่ก็มีต้นทุนเรื่องพื้นที่และการเขียนข้อมูล

ดังนั้นการสร้าง Index ควรดูจาก Query ที่ใช้งานจริงและ Execution Plan ว่า Index นั้นช่วยได้จริงหรือไม่
