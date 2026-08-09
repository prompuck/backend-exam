"""
เขียบนโปรแกรมหาจำนวนเลข 0 ที่ออยู่ติดกันหลังสุดของค่า factorial โดยห้ามใช้ function from math

[Input]
number: as an integer

[Output]
count: count of tailing zero as an integer

[Example 1]
input = 7
output = 1

[Example 2]
input = -10
output = number can not be negative
"""


class Solution:

    def find_tailing_zeroes(self, number: int) -> int | str:
        """นับจำนวนเลข 0 ท้ายสุดของ number! โดยไม่ต้องคำนวณค่า factorial จริง

        เลข 0 ท้ายสุด 1 ตัวเกิดจากตัวประกอบ 2 x 5 หนึ่งคู่ ใน n! จำนวนตัวประกอบ 2
        มีมากกว่าจำนวนตัวประกอบ 5 เสมอ ดังนั้นจำนวน 0 ท้ายสุดจึงเท่ากับจำนวนตัวประกอบ 5
        ซึ่งนับได้จาก n//5 + n//25 + n//125 + ... (Legendre's formula)

        ทำให้ใช้เวลา O(log5 n) แทนที่จะต้องคูณ factorial ทั้งก้อนซึ่งเป็น O(n) และกินหน่วยความจำมาก
        """
        if number < 0:
            return 'number can not be negative'

        count = 0
        power_of_five = 5
        while power_of_five <= number:
            count += number // power_of_five
            power_of_five *= 5

        return count


if __name__ == '__main__':
    solution = Solution()
    print(solution.find_tailing_zeroes(7))    # 1
    print(solution.find_tailing_zeroes(-10))  # number can not be negative
    print(solution.find_tailing_zeroes(0))    # 0
    print(solution.find_tailing_zeroes(25))   # 6
    print(solution.find_tailing_zeroes(100))  # 24
