"""
เขียบนโปรแกรมหา index ของตัวเลขที่มีค่ามากที่สุดใน list

[Input]
numbers: list of numbers

[Output]
index: index of maximum number in list

[Example 1]
input = [1,2,1,3,5,6,4]
output = 5

[Example 2]
input = []
output = list can not blank
"""


class Solution:

    def find_max_index(self, numbers: list) -> int | str:
        """หา index ของค่าที่มากที่สุดใน list ด้วยการไล่เทียบรอบเดียว O(n)

        ถ้ามีค่าสูงสุดซ้ำกันหลายตำแหน่ง จะคืน index แรกที่เจอ (ใช้ > ไม่ใช่ >=)
        """
        if not numbers:
            return 'list can not blank'

        max_index = 0
        for index in range(1, len(numbers)):
            if numbers[index] > numbers[max_index]:
                max_index = index

        return max_index


if __name__ == '__main__':
    solution = Solution()
    print(solution.find_max_index([1, 2, 1, 3, 5, 6, 4]))  # 5
    print(solution.find_max_index([]))                     # list can not blank
    print(solution.find_max_index([7]))                    # 0
    print(solution.find_max_index([-5, -1, -9]))           # 1
    print(solution.find_max_index([3, 9, 9, 2]))           # 1 (เจอตัวแรกก่อน)
