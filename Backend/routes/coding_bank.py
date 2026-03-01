coding_bank = [

# ==================================================
# EASY
# ==================================================

{
    "id": 1,
    "title": "Find Largest of Three Numbers",
    "difficulty": "easy",
    "description": """
Find the largest among three numbers.

Input:
a = 5
b = 8
c = 10

Output:
10 is largest
""",
    "starter_code": """a = 5
b = 8
c = 10

# Write your code below

""",
    "expected_output": "10 is largest",
    "solution": """a = 5
b = 8
c = 10

if a >= b and a >= c:
    print(a, "is largest")
elif b >= a and b >= c:
    print(b, "is largest")
else:
    print(c, "is largest")
"""
},

{
    "id": 2,
    "title": "Check Palindrome",
    "difficulty": "easy",
    "description": """
Check whether string is palindrome.

Input:
s = "madam"

Output:
True
""",
    "starter_code": """s = "madam"

# Write your code below

""",
    "expected_output": "True",
    "solution": """s = "madam"

rev = ""
for ch in s:
    rev = ch + rev

print(s == rev)
"""
},

{
    "id": 3,
    "title": "Count Vowels",
    "difficulty": "easy",
    "description": """
Count vowels in string.

Input:
s = "education"

Output:
5
""",
    "starter_code": """s = "education"

# Write your code below

""",
    "expected_output": "5",
    "solution": """s = "education"

vowels = "aeiouAEIOU"
count = 0

for ch in s:
    if ch in vowels:
        count += 1

print(count)
"""
},

# ==================================================
# MEDIUM
# ==================================================

{
    "id": 4,
    "title": "Two Sum",
    "difficulty": "medium",
    "description": """
Find two indices that add up to target.

Input:
nums = [2,7,11,15]
target = 9

Output:
[0, 1]
""",
    "starter_code": """nums = [2,7,11,15]
target = 9

# Write your code below

""",
    "expected_output": "[0, 1]",
    "solution": """nums = [2,7,11,15]
target = 9

lookup = {}
for i, num in enumerate(nums):
    if target - num in lookup:
        print([lookup[target - num], i])
        break
    lookup[num] = i
"""
},

{
    "id": 5,
    "title": "Reverse String Using Loop",
    "difficulty": "medium",
    "description": """
Reverse a string using loop.

Input:
s = "python"

Output:
nohtyp
""",
    "starter_code": """s = "python"

# Write your code below

""",
    "expected_output": "nohtyp",
    "solution": """s = "python"

rev = ""
for ch in s:
    rev = ch + rev

print(rev)
"""
},

{
    "id": 6,
    "title": "Find Prime Number",
    "difficulty": "medium",
    "description": """
Check whether number is prime.

Input:
n = 7

Output:
Prime
""",
    "starter_code": """n = 7

# Write your code below

""",
    "expected_output": "Prime",
    "solution": """n = 7

if n <= 1:
    print("Not Prime")
else:
    for i in range(2, n):
        if n % i == 0:
            print("Not Prime")
            break
    else:
        print("Prime")
"""
},

# ==================================================
# HARD
# ==================================================

{
    "id": 7,
    "title": "Factorial Using Loop",
    "difficulty": "hard",
    "description": """
Find factorial of number.

Input:
n = 5

Output:
120
""",
    "starter_code": """n = 5

# Write your code below

""",
    "expected_output": "120",
    "solution": """n = 5

fact = 1
for i in range(1, n+1):
    fact *= i

print(fact)
"""
},

{
    "id": 8,
    "title": "Fibonacci Series",
    "difficulty": "hard",
    "description": """
Print first 5 Fibonacci numbers.

Output:
0 1 1 2 3
""",
    "starter_code": """n = 5

# Write your code below

""",
    "expected_output": "0 1 1 2 3",
    "solution": """n = 5

a, b = 0, 1
for i in range(n):
    print(a, end=" ")
    a, b = b, a + b
"""
},

{
    "id": 9,
    "title": "Armstrong Number",
    "difficulty": "hard",
    "description": """
Check Armstrong number.

Input:
n = 153

Output:
Armstrong
""",
    "starter_code": """n = 153

# Write your code below

""",
    "expected_output": "Armstrong",
    "solution": """n = 153

temp = n
sum = 0

while temp > 0:
    digit = temp % 10
    sum += digit ** 3
    temp //= 10

if sum == n:
    print("Armstrong")
else:
    print("Not Armstrong")
"""
}

]