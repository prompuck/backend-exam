"""
เขียบนโปรแกรมแปลงตัวเลยเป็นคำอ่านภาษาไทย

[Input]
number: positive number rang from 0 to 10_000_000

[Output]
num_text: string of thai number call

[Example 1]
input = 101
output = หนึ่งร้อยเอ็ด

[Example 2]
input = -1
output = number can not less than 0
"""


class Solution:
    """แปลงจำนวนเต็มเป็นคำอ่านภาษาไทย

    กฎการอ่านที่ต้องดูแลเป็นพิเศษ
    - หลักหน่วยที่เป็น 1 และมีหลักอื่นนำหน้า อ่านว่า "เอ็ด"  (101 -> หนึ่งร้อยเอ็ด)
    - หลักสิบที่เป็น 1 อ่านว่า "สิบ" ไม่ใช่ "หนึ่งสิบ"        (11  -> สิบเอ็ด)
    - หลักสิบที่เป็น 2 อ่านว่า "ยี่สิบ" ไม่ใช่ "สองสิบ"        (21  -> ยี่สิบเอ็ด)
    - เลข 0 ในหลักกลางจะถูกข้าม                              (101 -> หนึ่งร้อยเอ็ด)
    - ตั้งแต่หลักล้านขึ้นไปจะวนอ่านซ้ำเป็นชุด ๆ ละ 6 หลัก      (10_000_000 -> สิบล้าน)
    """

    DIGITS = ('ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า')
    PLACES = ('', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน')
    MILLION = 1_000_000

    def number_to_thai(self, number: int) -> str:
        if number < 0:
            return 'number can not less than 0'

        if number == 0:
            return self.DIGITS[0]

        return self._read(number, has_prefix=False)

    def _read(self, number: int, has_prefix: bool) -> str:
        """อ่านจำนวนเต็มบวก โดยตัดหลักล้านออกมาอ่านแบบวนซ้ำ

        has_prefix บอกว่ามีคำอ่านของหลักที่สูงกว่านำหน้าอยู่แล้วหรือไม่
        ใช้ตัดสินว่าหลักหน่วยที่เป็น 1 ต้องอ่านว่า "เอ็ด" หรือ "หนึ่ง"
        เช่น 1_000_001 -> หนึ่งล้านเอ็ด
        """
        if number >= self.MILLION:
            millions, remainder = divmod(number, self.MILLION)
            text = self._read(millions, has_prefix) + 'ล้าน'
            if remainder:
                text += self._read_group(remainder, has_prefix=True)
            return text

        return self._read_group(number, has_prefix)

    def _read_group(self, number: int, has_prefix: bool) -> str:
        """อ่านจำนวนเต็ม 1 - 999,999 (ชุดละไม่เกิน 6 หลัก)"""
        digits = str(number)
        length = len(digits)
        text = ''

        for position, digit_char in enumerate(digits):
            digit = int(digit_char)
            place = length - position - 1  # 0 = หลักหน่วย, 1 = หลักสิบ, ...

            if digit == 0:
                continue

            if place == 0 and digit == 1 and (length > 1 or has_prefix):
                text += 'เอ็ด'
            elif place == 1 and digit == 1:
                text += self.PLACES[place]
            elif place == 1 and digit == 2:
                text += 'ยี่' + self.PLACES[place]
            else:
                text += self.DIGITS[digit] + self.PLACES[place]

        return text


if __name__ == '__main__':
    solution = Solution()
    print(solution.number_to_thai(101))         # หนึ่งร้อยเอ็ด
    print(solution.number_to_thai(-1))          # number can not less than 0
    print(solution.number_to_thai(0))           # ศูนย์
    print(solution.number_to_thai(11))          # สิบเอ็ด
    print(solution.number_to_thai(21))          # ยี่สิบเอ็ด
    print(solution.number_to_thai(999_999))     # เก้าแสนเก้าหมื่นเก้าพันเก้าร้อยเก้าสิบเก้า
    print(solution.number_to_thai(1_000_001))   # หนึ่งล้านเอ็ด
    print(solution.number_to_thai(10_000_000))  # สิบล้าน
