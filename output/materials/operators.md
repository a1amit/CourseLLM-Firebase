# Operators in Python

## Overview
Operators are special symbols that perform operations on one or more values (operands). This module covers various types of operators available in Python, including arithmetic, comparison, logical, assignment, and identity operators.

## 1. Arithmetic Operators
These are used to perform mathematical calculations.

| Operator | Description      | Example       | Result   |
| :------- | :--------------- | :------------ | :------- |
| `+`      | Addition         | `5 + 3`       | `8`      |
| `-`      | Subtraction      | `5 - 3`       | `2`      |
| `*`      | Multiplication   | `5 * 3`       | `15`     |
| `/`      | Division         | `10 / 3`      | `3.33...`|
| `%`      | Modulus (Remainder) | `10 % 3`      | `1`      |
| `**`     | Exponentiation   | `2 ** 3`      | `8`      |
| `//`     | Floor Division   | `10 // 3`     | `3`      |

```python
a = 10
b = 3

print(f"a + b = {a + b}")  # 13
print(f"a - b = {a - b}")  # 7
print(f"a * b = {a * b}")  # 30
print(f"a / b = {a / b}")  # 3.333...
print(f"a % b = {a % b}")  # 1 (remainder of 10/3)
print(f"a ** b = {a ** b}") # 10 to the power of 3 = 1000
print(f"a // b = {a // b}") # 3 (floor division, discards fractional part)

# String concatenation
str1 = "Hello"
str2 = "World"
print(str1 + " " + str2) # "Hello World"

# String multiplication (repetition)
print(str1 * 3) # "HelloHelloHello"
```

## 2. Assignment Operators
Used to assign values to variables. The simple assignment operator is `=`. Others combine an arithmetic operation with assignment.

| Operator | Example    | Equivalent To | Result if `x=10, y=5` |
| :------- | :--------- | :------------ | :-------------------- |
| `=`      | `x = 5`    | `x = 5`       | `x` becomes `5`       |
| `+=`     | `x += y`   | `x = x + y`   | `x` becomes `15`      |
| `-=`     | `x -= y`   | `x = x - y`   | `x` becomes `5`       |
| `*=`     | `x *= y`   | `x = x * y`   | `x` becomes `50`      |
| `/=`     | `x /= y`   | `x = x / y`   | `x` becomes `2.0`     |
| `%=`     | `x %= y`   | `x = x % y`   | `x` becomes `0`       |
| `**=`    | `x **= y`  | `x = x ** y`  | `x` becomes `100000`  |
| `//=`    | `x //= y`  | `x = x // y`  | `x` becomes `2`       |

```python
x = 10
y = 5

x += y # x = x + y = 10 + 5 = 15
print(f"x after +=: {x}") # 15

x *= 2 # x = x * 2 = 15 * 2 = 30
print(f"x after *=: {x}") # 30
```

## 3. Comparison (Relational) Operators
Used to compare two values and return a Boolean result (`True` or `False`).

| Operator | Description                | Example       | Result   |
| :------- | :------------------------- | :------------ | :------- |
| `==`     | Equal to                   | `5 == 3`      | `False`  |
| `!=`     | Not equal to               | `5 != 3`      | `True`   |
| `>`      | Greater than               | `5 > 3`       | `True`   |
| `<`      | Less than                  | `5 < 3`       | `False`  |
| `>=`     | Greater than or equal to   | `5 >= 3`      | `True`   |
| `<=`     | Less than or equal to      | `5 <= 3`      | `False`  |

```python
a = 10
b = 20
c = 10

print(f"a == b: {a == b}") # False
print(f"a != b: {a != b}") # True
print(f"a > b: {a > b}")   # False
print(f"a < b: {a < b}")   # True
print(f"a >= c: {a >= c}") # True
print(f"b <= c: {b <= c}") # False

# Can also compare strings (lexicographical order)
print("apple" > "banana") # False
```

## 4. Logical Operators
Used to combine conditional statements and evaluate Boolean expressions.

| Operator | Description                                   | Example             | Result                  |
| :------- | :-------------------------------------------- | :------------------ | :---------------------- |
| `and`    | Returns `True` if both statements are true.   | `True and False`    | `False`                 |
| `or`     | Returns `True` if at least one statement is true. | `True or False`     | `True`                  |
| `not`    | Reverses the result; returns `False` if the result is true. | `not True`          | `False`                 |

```python
x = 5
y = 10

print(f"x > 0 and y < 20: {x > 0 and y < 20}") # True and True -> True
print(f"x < 0 or y < 5: {x < 0 or y < 5}")   # False or False -> False
print(f"not (x == 5): {not (x == 5)}")      # not True -> False

age = 25
has_license = True

if age >= 18 and has_license:
    print("Eligible to drive.")
else:
    print("Not eligible to drive.")
```

## 5. Identity Operators
Used to compare the memory locations of two objects. They check if two variables refer to the *exact same object*.

| Operator | Description                            | Example       | Result   |
| :------- | :------------------------------------- | :------------ | :------- |
| `is`     | Returns `True` if both variables are the same object. | `x is y`      | `False`  |
| `is not` | Returns `True` if both variables are not the same object. | `x is not y`  | `True`   |

```python
a = [1, 2, 3]
b = a            # b refers to the same list object as a
c = [1, 2, 3]    # c is a new list object, even if content is identical

print(f"a is b: {a is b}")       # True (they point to the same memory location)
print(f"a == b: {a == b}")      # True (their content is equal)

print(f"a is c: {a is c}")       # False (they are distinct objects in memory)
print(f"a == c: {a == c}")      # True (their content is equal)

# For small integers and common single-character strings, Python might optimize
# and reuse objects, leading to 'is' returning True even for distinct assignments.
# This is an implementation detail and should not be relied upon for general object comparison.
int1 = 1
int2 = 1
print(f"int1 is int2: {int1 is int2}") # True (often for small integers)

str_a = "hello"
str_b = "hello"
print(f"str_a is str_b: {str_a is str_b}") # True (often for interned strings)
```

## 6. Membership Operators
Used to test if a sequence (string, list, tuple, set, dictionary) contains a specific value.

| Operator | Description                                     | Example           | Result   |
| :------- | :---------------------------------------------- | :---------------- | :------- |
| `in`     | Returns `True` if a value is found in the sequence. | `'a' in 'banana'` | `True`   |
| `not in` | Returns `True` if a value is not found in the sequence. | `'z' not in 'banana'`| `True`   |

```python
my_list = [10, 20, 30, 40]
my_string = "Python Programming"
my_dict = {"name": "Alice", "age": 25}

print(f"20 in my_list: {20 in my_list}")     # True
print(f"50 in my_list: {50 in my_list}")     # False

print(f"'Pro' in my_string: {'Pro' in my_string}") # True (substring check)
print(f"'java' not in my_string: {'java' not in my_string}") # True

# For dictionaries, 'in' checks for keys, not values by default
print(f"'name' in my_dict: {'name' in my_dict}")     # True
print(f"'Alice' in my_dict: {'Alice' in my_dict}")   # False (Alice is a value, not a key)
print(f"'Alice' in my_dict.values(): {'Alice' in my_dict.values()}") # True
```

## Operator Precedence
When multiple operators are in an expression, operator precedence determines the order in which they are evaluated. Parentheses `()` can be used to override the default precedence.

*   `**` (Exponentiation) - Highest
*   `*`, `/`, `//`, `%` (Multiplication, Division, Modulus)
*   `+`, `-` (Addition, Subtraction)
*   Comparison operators (`==`, `!=`, `>`, `<`, `>=`, `<= `)
*   `not`
*   `and`
*   `or` - Lowest

```python
result = 10 + 5 * 2 # Multiplication before addition: 10 + (5 * 2) = 10 + 10 = 20
print(result) # 20

result_with_paren = (10 + 5) * 2 # Parentheses override: (15) * 2 = 30
print(result_with_paren) # 30
```

## Summary
Operators are essential for performing computations, making comparisons, and controlling program flow. You've learned about:
*   Arithmetic operators for math calculations.
*   Assignment operators for assigning values efficiently.
*   Comparison operators for making logical comparisons.
*   Logical operators (`and`, `or`, `not`) for combining conditions.
*   Identity operators (`is`, `is not`) for checking if objects are the same.
*   Membership operators (`in`, `not in`) for checking presence in sequences.
*   Operator precedence and how parentheses affect evaluation order.

These operators are critical for the next module on conditional statements, where you'll use them to make decisions in your code.