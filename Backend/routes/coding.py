import os
import random
import json
import re
from fastapi import APIRouter
from google import genai
from google.genai.errors import ClientError

router = APIRouter()

# ===============================
# GEMINI CLIENT
# ===============================

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

# ===============================
# PYTHON FALLBACK QUESTIONS (5)
# ===============================

python_fallback = [
    {
        "title": "Check Even or Odd",
        "problem_statement": "Check if a number is even or odd.",
        "input_format": "An integer n.",
        "output_format": "Print 'Even' or 'Odd'.",
        "constraints": "-10^9 <= n <= 10^9",
        "example_input": "4",
        "example_output": "Even",
        "correct_solution": """n = int(input())
if n % 2 == 0:
    print("Even")
else:
    print("Odd")"""
    },
    {
        "title": "Palindrome String",
        "problem_statement": "Check if a string is palindrome.",
        "input_format": "A string s.",
        "output_format": "Print True or False.",
        "constraints": "1 <= len(s) <= 1000",
        "example_input": "madam",
        "example_output": "True",
        "correct_solution": """s = input()
print(s == s[::-1])"""
    },
    {
        "title": "Reverse a List",
        "problem_statement": "Reverse a list.",
        "input_format": "Space separated integers.",
        "output_format": "Print reversed list.",
        "constraints": "1 <= n <= 1000",
        "example_input": "1 2 3",
        "example_output": "3 2 1",
        "correct_solution": """lst = list(map(int, input().split()))
print(*lst[::-1])"""
    },
    {
        "title": "Count Vowels",
        "problem_statement": "Count vowels in a string.",
        "input_format": "A string s.",
        "output_format": "Print number of vowels.",
        "constraints": "1 <= len(s) <= 1000",
        "example_input": "hello",
        "example_output": "2",
        "correct_solution": """s = input().lower()
print(sum(1 for ch in s if ch in "aeiou"))"""
    },
    {
        "title": "Factorial",
        "problem_statement": "Find factorial of a number.",
        "input_format": "Integer n.",
        "output_format": "Print factorial.",
        "constraints": "0 <= n <= 20",
        "example_input": "5",
        "example_output": "120",
        "correct_solution": """n = int(input())
fact = 1
for i in range(1, n+1):
    fact *= i
print(fact)"""
    }
]

# ===============================
# JAVA FALLBACK QUESTIONS (5)
# ===============================

java_fallback = [
    {
        "title": "Check Even or Odd",
        "problem_statement": "Check if a number is even or odd.",
        "input_format": "Integer n.",
        "output_format": "Print Even or Odd.",
        "constraints": "-10^9 <= n <= 10^9",
        "example_input": "4",
        "example_output": "Even",
        "correct_solution": """import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        if(n % 2 == 0)
            System.out.println("Even");
        else
            System.out.println("Odd");
    }
}"""
    },
    {
        "title": "Palindrome String",
        "problem_statement": "Check if a string is palindrome.",
        "input_format": "String s.",
        "output_format": "Print True or False.",
        "constraints": "1 <= length <= 1000",
        "example_input": "madam",
        "example_output": "True",
        "correct_solution": """import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        String rev = new StringBuilder(s).reverse().toString();
        System.out.println(s.equals(rev));
    }
}"""
    },
    {
        "title": "Reverse Array",
        "problem_statement": "Reverse an array.",
        "input_format": "Array elements.",
        "output_format": "Print reversed array.",
        "constraints": "1 <= n <= 1000",
        "example_input": "1 2 3",
        "example_output": "3 2 1",
        "correct_solution": """import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int[] arr = {1,2,3};
        for(int i=arr.length-1; i>=0; i--)
            System.out.print(arr[i] + " ");
    }
}"""
    },
    {
        "title": "Factorial",
        "problem_statement": "Find factorial of a number.",
        "input_format": "Integer n.",
        "output_format": "Print factorial.",
        "constraints": "0 <= n <= 20",
        "example_input": "5",
        "example_output": "120",
        "correct_solution": """import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        long fact = 1;
        for(int i=1; i<=n; i++)
            fact *= i;
        System.out.println(fact);
    }
}"""
    },
    {
        "title": "Count Vowels",
        "problem_statement": "Count vowels in string.",
        "input_format": "String s.",
        "output_format": "Print count.",
        "constraints": "1 <= length <= 1000",
        "example_input": "hello",
        "example_output": "2",
        "correct_solution": """import java.util.*;
public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next().toLowerCase();
        int count = 0;
        for(char c : s.toCharArray()){
            if("aeiou".indexOf(c) != -1)
                count++;
        }
        System.out.println(count);
    }
}"""
    }
]

# ===============================
# JSON EXTRACTOR
# ===============================

def extract_json(text):
    try:
        text = text.replace("```json", "").replace("```", "")
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())
        return None
    except:
        return None

# ===============================
# HYBRID ROUTE
# ===============================

@router.get("/ai-coding-question/{language}/{difficulty}")
def generate_coding_question(language: str, difficulty: str):

    prompt = f"""
Generate one {difficulty} coding question in {language}.

Return ONLY valid JSON:

{{
"title": "",
"problem_statement": "",
"input_format": "",
"output_format": "",
"constraints": "",
"example_input": "",
"example_output": "",
"correct_solution": ""
}}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        data = extract_json(response.text)

        if data:
            return data

    except ClientError:
        pass

    # 👇 FALLBACK BASED ON LANGUAGE
    if language.lower() == "java":
        return random.choice(java_fallback)
    else:
        return random.choice(python_fallback)