# JSON vs Protocol Buffer

JSON และ Protocol Buffer ใช้สำหรับส่งข้อมูลระหว่างระบบเหมือนกัน แต่มีวิธีการทำงานต่างกัน

## JSON

JSON เป็นรูปแบบข้อมูลแบบ Text ทำให้คนสามารถอ่านข้อมูลได้ง่าย เช่น สามารถเปิดดูผ่าน Browser, Postman หรือ Log ได้โดยตรง

ตัวอย่าง:

```json
{
  "id": 12345,
  "first_name": "สมชาย",
  "last_name": "ใจดี",
  "gender": "male",
  "classroom_id": 7
}
```

ข้อดีของ JSON คือใช้งานง่าย ไม่จำเป็นต้องกำหนด Schema ก่อน และ Browser รองรับโดยตรง จึงเหมาะกับ REST API, Public API และ Web Application

ข้อเสียคือข้อมูลจะมีชื่อ Field ติดไปด้วย เช่น `first_name`, `last_name` ทำให้ข้อมูลมีขนาดใหญ่กว่า Binary format และถ้ามีข้อมูลจำนวนมากก็จะใช้ Bandwidth มากขึ้น

JSON ยังมี Type ที่ไม่ละเอียดมาก เช่น ไม่มี `int32`, `int64` หรือ `bytes` โดยตรง ถ้าต้องการส่งข้อมูล Binary มักต้องแปลงเป็น Base64 ก่อน

## Protocol Buffer

Protocol Buffer เป็นรูปแบบข้อมูลแบบ Binary ดังนั้นข้อมูลที่ส่งจะไม่สามารถอ่านได้โดยตรงเหมือน JSON

ก่อนใช้งานต้องกำหนดโครงสร้างข้อมูลในไฟล์ `.proto`

```proto
syntax = "proto3";

message Student {
  int32 id = 1;
  string first_name = 2;
  string last_name = 3;
  Gender gender = 4;
  int32 classroom_id = 5;
}

enum Gender {
  GENDER_UNSPECIFIED = 0;
  GENDER_MALE = 1;
  GENDER_FEMALE = 2;
}
```

จากนั้นใช้ `protoc` เพื่อ Generate Code สำหรับภาษาที่ใช้งาน เช่น Python, Go, Java หรือ C#

Protocol Buffer จะใช้หมายเลข Field เช่น `id = 1`, `first_name = 2` ในการระบุข้อมูล จึงไม่ต้องส่งชื่อ Field ไปทุกครั้ง ทำให้ข้อมูลมีขนาดเล็กกว่า JSON

ข้อดีคือข้อมูลมีขนาดเล็กกว่า Encode และ Decode ได้เร็ว และมี Schema ที่ชัดเจน เหมาะกับระบบที่มีการสื่อสารระหว่าง Service เช่น Microservices และ gRPC

ข้อเสียคืออ่านข้อมูลโดยตรงไม่ได้ และต้องมีขั้นตอนเพิ่มเติมในการจัดการ `.proto`, `protoc` และการ Generate Code

## JSON กับ Protocol Buffer สิ่งที่แตกต่างกัน

ถ้าเป็น JSON เราสามารถส่งข้อมูลแบบนี้ได้เลย

```json
{
  "id": 12345,
  "first_name": "สมชาย",
  "last_name": "ใจดี"
}
```

ข้อมูลที่ส่งจะมีทั้งชื่อ Field และ Value

แต่ Protocol Buffer จะ Serialize ข้อมูลเป็น Binary เช่น

```text
08 B9 60 12 09 ...
```

จึงไม่สามารถเปิดอ่านเหมือน JSON ได้โดยตรง แต่ข้อดีคือข้อมูลมีขนาดเล็กและเหมาะกับการส่งข้อมูลระหว่างระบบ

## เลือกใช้ JSON

ถ้าเป็น REST API, Public API หรือ Web Application จะเลือก JSON เพราะ Client เรียกใช้งานง่าย และเวลามีปัญหาสามารถ Debug ได้ง่าย

JSON ยังเหมาะกับระบบที่ต้องการพัฒนาเร็ว และข้อมูลไม่ได้มีปริมาณมากจน Performance หรือ Bandwidth เป็นปัญหา

## เลือกใช้ Protocol Buffer

ถ้าเป็นการสื่อสารระหว่าง Microservices หรือใช้ gRPC จะเลือก Protocol Buffer เพราะมี Schema ที่ชัดเจน ข้อมูลมีขนาดเล็ก และเหมาะกับระบบที่ต้องการ Performance

โดยเฉพาะกรณีที่ Service ใช้หลายภาษา เช่น Service หนึ่งใช้ Go และอีก Service ใช้ Python ก็สามารถใช้ `.proto` เป็นตัวกำหนดโครงสร้างข้อมูลร่วมกันได้

## ใช้ JSON และ Protocol Buffer ร่วมกัน

ในระบบจริงสามารถใช้ทั้งสองแบบร่วมกันได้ เช่น

```text
Browser
    |
    | REST + JSON
    v
API Gateway
    |
    | gRPC + Protocol Buffer
    v
Microservices
```

ในรูปแบบนี้ Browser ติดต่อกับ API Gateway ด้วย REST และ JSON เพราะใช้งานง่าย ส่วน API Gateway ใช้ gRPC และ Protocol Buffer ติดต่อกับ Microservices ภายใน

## สรุป

ถ้าต้องการ **ใช้ง่าย อ่านง่าย และรองรับ Client ได้หลากหลาย** เลือก JSON

ถ้าต้องการ **ข้อมูลขนาดเล็ก Performance ที่ดี และมี Schema ที่ชัดเจน** เลือก Protocol Buffer
