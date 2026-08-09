"""
เขียบนโปรแกรมแปลงตัวเลยเป็นตัวเลข roman

[Input]
number: list of numbers

[Output]
roman_text: roman number

[Example 1]
input = 101
output = CI

[Example 2]
input = -1
output = number can not less than 0
"""


class Solution:
    """แปลงจำนวนเต็มเป็นเลขโรมันด้วยวิธี greedy

    ไล่หักค่าจากสัญลักษณ์ที่มีค่ามากไปน้อย โดยใส่รูปแบบ subtractive (CM, CD, XC, XL, IX, IV)
    ลงในตารางไปเลย ทำให้ไม่ต้องเขียนเงื่อนไขพิเศษแยกออกมา

    หมายเหตุ: เลขโรมันไม่มีสัญลักษณ์แทนศูนย์ ดังนั้น 0 จึงคืนค่าเป็นข้อความว่าง
    """

    NUMERALS = (
        (1000, 'M'),
        (900, 'CM'),
        (500, 'D'),
        (400, 'CD'),
        (100, 'C'),
        (90, 'XC'),
        (50, 'L'),
        (40, 'XL'),
        (10, 'X'),
        (9, 'IX'),
        (5, 'V'),
        (4, 'IV'),
        (1, 'I'),
    )

    def number_to_roman(self, number: int) -> str:
        if number < 0:
            return 'number can not less than 0'

        parts = []
        for value, symbol in self.NUMERALS:
            if number < value:
                continue
            count, number = divmod(number, value)
            parts.append(symbol * count)

        return ''.join(parts)


if __name__ == '__main__':
    solution = Solution()
    print(solution.number_to_roman(101))   # CI
    print(solution.number_to_roman(-1))    # number can not less than 0
    print(solution.number_to_roman(0))     # (ข้อความว่าง)
    print(solution.number_to_roman(4))     # IV
    print(solution.number_to_roman(1994))  # MCMXCIV
    print(solution.number_to_roman(3999))  # MMMCMXCIX
