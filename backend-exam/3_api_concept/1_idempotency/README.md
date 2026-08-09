## Idempotency คืออะไร

Idempotency คือการที่เราสามารถเรียก API เดิมซ้ำหลายครั้งด้วยข้อมูลเดิม แล้ว **ผลลัพธ์ที่เกิดกับระบบยังเหมือนเดิม** ไม่เกิดข้อมูลหรือรายการซ้ำ

ตัวอย่างเช่น

```http
DELETE /orders/1
```

ถ้าเรียกครั้งแรก Order 1 ถูกลบ และเรียกซ้ำอีกครั้ง Order ก็ยังไม่มีอยู่ ดังนั้นถือว่าเป็น idempotent

แต่ถ้าเป็นการสร้าง Order

```http
POST /orders
```

เรียก 2 ครั้งก็อาจสร้าง Order 2 รายการ จึงไม่ idempotent โดยทั่วไป

### HTTP Method ที่เกี่ยวข้อง

* `GET` → Idempotent (เรียกซ้ำได้ ผลลัพธ์ไม่เปลี่ยน)
* `PUT` → Idempotent (เรียกซ้ำได้ ข้อมูลสุดท้ายเหมือนเดิม)
* `DELETE` → Idempotent (เรียกซ้ำได้ ข้อมูลก็ยังถูกลบ)
* `POST` → โดยทั่วไปไม่ Idempotent (เรียกซ้ำอาจสร้างข้อมูลใหม่หลายครั้ง)
* `PATCH` → ขึ้นอยู่กับวิธีที่เราออกแบบ API 

### ทำไมต้องใช้ Idempotency

ปัญหาที่เจอบ่อยคือ request ทำงานสำเร็จที่ server แล้ว แต่ response กลับมาที่ client ไม่สำเร็จ เช่น network timeout

```text
Client → POST /payment → Server
                         ↓
                     ตัดเงินสำเร็จ
                         ↓
                  Response หาย

Client → Retry → POST /payment
```

ถ้า API ไม่มีการป้องกัน อาจทำให้ลูกค้าถูกตัดเงิน 2 ครั้งได้

### วิธีแก้

วิธีที่ใช้บ่อยคือส่ง `Idempotency-Key` มากับ request

```http
POST /payments
Idempotency-Key: 123456
```

Server จะเก็บ key นี้ไว้ ถ้า request เดิมถูกส่งเข้ามาอีกครั้งด้วย key เดิม ก็ไม่ทำรายการซ้ำ แต่คืนผลลัพธ์เดิมกลับไป

ตัวอย่างเช่น

```text
Request 1 → Key: 123456 → สร้าง Payment สำเร็จ
Request 2 → Key: 123456 → ไม่สร้างซ้ำ → คืนผลลัพธ์เดิม
```

อีกวิธีคือใช้ `UNIQUE` ใน database เพื่อป้องกันข้อมูลซ้ำ เช่น `payment_reference` ต้องไม่ซ้ำ

```sql
UNIQUE(payment_reference)
```

### สรุป

Idempotency คือ **การเรียก request ซ้ำแล้วไม่ทำให้เกิดผลกระทบซ้ำ**

สำคัญกับ API ที่มีการ retry โดยเฉพาะระบบที่เกี่ยวกับการเงิน การสร้าง Order หรือการตัด Stock

หลักที่จะใช้คือ

1. ออกแบบ API ให้ idempotent ถ้าทำได้
2. ใช้ `Idempotency-Key` กับ operation ที่ต้องป้องกันการทำซ้ำ
3. ใช้ `UNIQUE constraint` ใน database เป็นตัวช่วยป้องกันข้อมูลซ้ำ
