# Conditional Statements (if/elif/else)

## Overview
Conditional statements are fundamental to programming logic. They allow your program to make decisions and execute different blocks of code based on whether certain conditions are true or false. This module will introduce you to `if`, `elif`, and `else` statements in Python.

## 1. The `if` Statement
The `if` statement is the simplest form of a conditional. It executes a block of code only if a specified condition is `True`.

### Syntax:
```python
if condition:
    # code to execute if condition is True
    statement1
    statement2
```

*   The `condition` is an expression that evaluates to `True` or `False` (often using comparison or logical operators).
*   The colon `:` marks the end of the `if` statement line.
*   The code block to be executed is **indented** (typically 4 spaces) beneath the `if` statement.

### Example:
```python
age = 20

if age >= 18:
    print("You are old enough to vote.")
print("This line runs regardless of the condition.")


temperature = 35
if temperature > 30:
    print("It's a hot day!")
```

## 2. The `if-else` Statement
An `if-else` statement allows you to execute one block of code if the condition is `True` and a different block of code if the condition is `False`.

### Syntax:
```python
if condition:
    # code to execute if condition is True
else:
    # code to execute if condition is False
```

### Example:
```python
has_license = True

if has_license:
    print("You can drive.")
else:
    print("You cannot drive without a license.")


score = 75
if score >= 60:
    print("You passed the exam!")
else:
    print("You did not pass the exam.")
```

## 3. The `if-elif-else` Statement
The `if-elif-else` (short for "else if") statement allows you to test multiple conditions sequentially. It's useful when you have more than two possible outcomes.

### Syntax:
```python
if condition1:
    # code to execute if condition1 is True
elif condition2:
    # code to execute if condition2 is True
elif condition3:
    # code to execute if condition3 is True
else:
    # code to execute if none of the above conditions are True
```

*   Python evaluates conditions from top to bottom.
*   As soon as a condition evaluates to `True`, its corresponding code block is executed, and the rest of the `elif` and `else` blocks are skipped.
*   The `else` block is optional but provides a fallback if none of the `if` or `elif` conditions are met.

### Example:
```python
weather = "sunny"

if weather == "rainy":
    print("Bring an umbrella.")
elif weather == "sunny":
    print("Wear sunscreen.")
elif weather == "cloudy":
    print("It might be cool.")
else:
    print("Check the weather forecast.")
# Output: Wear sunscreen.


# Example with numerical ranges
grade = 85

if grade >= 90:
    print("Grade: A")
elif grade >= 80:
    print("Grade: B")
elif grade >= 70:
    print("Grade: C")
elif grade >= 60:
    print("Grade: D")
else:
    print("Grade: F")
# Output: Grade: B
```

## 4. Nested Conditional Statements
You can place `if`, `elif`, and `else` statements inside other `if`, `elif`, or `else` blocks. This is called nesting and allows for more complex decision-making logic.

```python
user_role = "admin"
is_logged_in = True

if is_logged_in:
    print("User is logged in.")
    if user_role == "admin":
        print("Welcome, administrator!")
        permission_level = 5
        if permission_level > 3:
            print("You have high privileges.")
        else:
            print("You have standard admin privileges.")
    elif user_role == "editor":
        print("Welcome, editor!")
    else:
        print("Welcome, regular user!")
else:
    print("Please log in.")
```

## 5. Short-Hand `if` (Ternary Operator)
For simple `if-else` statements, Python offers a concise one-line syntax, often called the ternary operator.

### Syntax:
```python
value_if_true if condition else value_if_false
```

### Example:
```python
age = 20
status = "Adult" if age >= 18 else "Minor"
print(f"Status: {status}") # Output: Status: Adult


price = 100
discount = 10 if price > 50 else 0
final_price = price - discount
print(f"Final price: {final_price}") # Output: Final price: 90
```

## Summary
Conditional statements are the backbone of decision-making in your programs. You've learned about:
*   The `if` statement for executing code based on a `True` condition.
*   The `if-else` statement for choosing between two code blocks.
*   The `if-elif-else` statement for handling multiple possible conditions.
*   Nesting conditional statements for complex logic.
*   The short-hand `if` (ternary operator) for concise `if-else` expressions.

These constructs allow your programs to respond dynamically to different situations, making them much more powerful and versatile. Next, we'll explore loops, which allow your programs to repeat actions.