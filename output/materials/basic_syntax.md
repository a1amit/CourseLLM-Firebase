# Basic Python Syntax and Your First Program

## Overview
This module introduces the fundamental building blocks of Python syntax. You'll learn how to write basic instructions, understand code structure, and use comments to make your code more understandable.

## 1. Comments
Comments are notes within your code that the Python interpreter ignores. They are crucial for explaining what your code does, making it easier for you and others to understand later.

*   **Single-line comments:** Start with a `#` symbol.
    ```python
    # This is a single-line comment
    print("Hello") # This comment explains the print statement
    ```
*   **Multi-line comments (docstrings):** While Python doesn't have a dedicated multi-line comment syntax like `/* */` in some languages, you can use triple quotes (`"""` or `'''`) to create multi-line strings that are often used as docstrings (documentation strings) for functions, classes, or modules. When they are not assigned to a variable, they act like multi-line comments.
    ```python
    """This is a multi-line comment.
    It can span several lines.
    Python ignores it if it's not assigned to a variable.
    """
    print("World")
    ```

## 2. The `print()` Function
The `print()` function is one of the most commonly used functions in Python. Its purpose is to display output to the console (your screen).

```python
print("Hello, Python!") # Prints the string "Hello, Python!"
print(123)           # Prints the number 123
print(True)          # Prints the boolean value True

# You can print multiple items, separated by commas
print("My name is", "Alice")

# By default, print() adds a newline at the end. 
# You can change this using the 'end' parameter
print("Hello", end=" ") # Prints "Hello " (space at the end, no newline)
print("there!")       # Prints "there!" on the same line after "Hello "

# You can also change the separator between items using the 'sep' parameter
print("apple", "banana", "cherry", sep="-") # Prints "apple-banana-cherry"
```

## 3. Indentation: Python's Structure
Unlike many other programming languages that use curly braces `{}` to define blocks of code, Python uses **indentation**. This means that the whitespace (spaces or tabs) at the beginning of a line is significant.

*   A consistent level of indentation indicates a block of code.
*   Typically, **4 spaces** are used for each level of indentation. Do not mix tabs and spaces.
*   Incorrect indentation will lead to `IndentationError`.

```python
# Correct indentation example
if True:
    print("This line is indented by 4 spaces")
    print("So is this line, it's part of the same block")

# Incorrect indentation example (will cause an IndentationError)
# if True:
#     print("This is fine")
#   print("This line has inconsistent indentation")
```

## 4. Statements and Expressions
*   **Statement:** An instruction that the Python interpreter can execute. Examples include `print("Hello")`, variable assignments, and control flow statements.
*   **Expression:** A combination of values, variables, operators, and functions that evaluates to a single value. Expressions are often part of a statement.

```python
x = 10 # This is a statement (assignment statement)
print(x + 5) # x + 5 is an expression that evaluates to 15
             # print(x + 5) is a statement
```

## 5. Case Sensitivity
Python is **case-sensitive**. This means `myVariable` is different from `myvariable`.

```python
message = "Hello"
# Print(message) would cause an error because 'Print' is not 'print'
print(message)
```

## Summary
In this module, you've learned about:
*   Using `#` for single-line comments and `"""` for multi-line strings often used as comments/docstrings.
*   The `print()` function to display output.
*   The critical role of indentation in defining code blocks.
*   The difference between statements and expressions.
*   Python's case-sensitive nature.

With these basics, you're ready to start writing more meaningful code using variables and different data types.