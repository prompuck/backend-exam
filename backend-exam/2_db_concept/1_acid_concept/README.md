# ACID Concept

ACID เป็นหลักการของ Transaction ใน Database มี 4 ข้อ คือ Atomicity, Consistency, Isolation และ Durability

### 1. Atomicity

คือ **ทำทั้งหมดหรือไม่ทำเลย**

เช่น การโอนเงินมี 2 ขั้นตอน

```text
1. หักเงินจากบัญชี A
2. เพิ่มเงินให้บัญชี B
```

ถ้าขั้นตอนใดขั้นตอนหนึ่งผิดพลาด ต้อง Rollback กลับไปเหมือนเดิม เพื่อไม่ให้เกิดกรณีที่เงินถูกหักแล้วแต่ไม่ได้เข้าบัญชีปลายทาง

ใน Django สามารถใช้ `transaction.atomic()` ได้ เช่น

```python
from django.db import transaction

with transaction.atomic():
    source.withdraw(amount)
    target.deposit(amount)
```

### 2. Consistency

คือข้อมูลหลังจาก Transaction ทำงานเสร็จแล้ว ต้องยังถูกต้องตามกฎที่กำหนดไว้

เช่น

* Stock ต้องไม่ติดลบ
* Email ต้องไม่ซ้ำ
* Foreign Key ต้องอ้างอิงข้อมูลที่มีอยู่จริง

Database สามารถช่วยตรวจสอบได้ด้วย Constraint เช่น `UNIQUE`, `FOREIGN KEY` และ `CHECK`

ส่วนกฎทางธุรกิจบางอย่าง Application ต้องเป็นคนตรวจสอบ เช่น ลูกค้าแต่ละคนซื้อสินค้าได้ไม่เกินวงเงินที่กำหนด

### 3. Isolation

คือเวลาที่มีหลาย Transaction ทำงานพร้อมกัน ต้องควบคุมไม่ให้ข้อมูลผิดจากการทำงานพร้อมกัน

เช่น มีสินค้าเหลือ 1 ชิ้น แต่มีลูกค้า 2 คนกดซื้อพร้อมกัน ถ้าไม่จัดการให้ดี ทั้งสองคนอาจซื้อสำเร็จได้

ใน Django สามารถใช้ `select_for_update()` เพื่อ Lock ข้อมูลที่กำลังแก้ไขได้

```python
with transaction.atomic():
    product = Product.objects.select_for_update().get(pk=product_id)
    product.stock -= 1
    product.save()
```

### 4. Durability

คือถ้า Transaction `COMMIT` สำเร็จแล้ว ข้อมูลต้องถูกบันทึกไว้ และไม่ควรหายเมื่อระบบ Restart หรือเกิดปัญหา

ดังนั้น Application ควรตรวจสอบให้แน่ใจว่า Transaction Commit สำเร็จก่อนที่จะแจ้งผู้ใช้ว่าการทำงานสำเร็จ

### สรุป

```text
Atomicity  = ทำทั้งหมด หรือไม่ทำเลย
Consistency = ข้อมูลต้องถูกต้องตามกฎ
Isolation   = Transaction ที่ทำพร้อมกันต้องไม่ทำให้ข้อมูลผิด
Durability  = Commit แล้วข้อมูลต้องคงอยู่
```
