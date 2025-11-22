# Input and Output: Interacting with the User

## Overview
For a program to be truly useful, it needs to interact with the outside world. This module focuses on how Python programs can take input from the user (via the keyboard) and display output to the console (screen).

## 1. Output with `print()` (Review)
We've already seen the `print()` function multiple times. It's the primary way to display information to the console.

```python
print("Hello, world!") # Prints a string

name = "Alice"
age = 30
print("Name:", name, "Age:", age) # Prints multiple arguments separated by space

# Using f-strings (formatted string literals) for easy formatting
print(f"My name is {name} and I am {age} years old.")

# Changing separator and end character
print("Item1", "Item2", "Item3", sep="|", end="...")
print("End of list")
# Output: Item1|Item2|Item3...End of list
```

## 2. Input with `input()`
The `input()` function allows your program to pause and wait for the user to type something and press Enter. It reads a line of text from the console and returns it as a string.

### Syntax:
```python
variable = input("Prompt message to user: ")
```

*   The `prompt message` (optional) is displayed to the user before they enter input.
*   The value entered by the user is always returned as a **string**, even if they type numbers.

### Example:
```python
# Basic input
user_name = input("Enter your name: ")
print(f"Hello, {user_name}!")

# Inputting numbers requires type conversion
# The input will be a string, e.g., "25"
birth_year_str = input("Enter your birth year: ")

# Convert the string input to an integer
try:
    birth_year = int(birth_year_str)
    current_year = 2024 # Example current year
    age = current_year - birth_year
    print(f"You are approximately {age} years old.")
except ValueError:
    print("Invalid year entered. Please enter a number.")
```
**Important:** Always remember that `input()` returns a string. If you need to perform numerical operations, you must explicitly convert the input string to an `int` or `float` using `int()` or `float()`. This conversion can fail if the user enters non-numeric text, leading to a `ValueError`, which you should handle (as shown in the `try-except` block above, to be covered in more detail later).

## 3. Standard Input, Output, and Error Streams
Behind the scenes, `print()` and `input()` interact with standard I/O streams:

*   **`sys.stdin` (Standard Input):** Typically connected to the keyboard. `input()` reads from here.
*   **`sys.stdout` (Standard Output):** Typically connected to the console screen. `print()` writes to here.
*   **`sys.stderr` (Standard Error):** Also typically connected to the console screen, but used for error messages. Separate from `stdout` so error messages can be redirected independently.

You can access and even redirect these streams using the `sys` module.

```python
import sys

# Writing to stdout directly
sys.stdout.write("This is written to standard output.\n")

# Writing to stderr for error messages
sys.stderr.write("This is an error message!\n")

# Reading from stdin directly (less common than input() for interactive use)
# user_input_raw = sys.stdin.readline().strip() # .strip() removes trailing newline
# print(f"You typed: {user_input_raw}")
```

## Summary
Interacting with the user is a core part of many applications. You've learned:
*   To use the `print()` function to display output to the console, including formatting options.
*   To use the `input()` function to get text input from the user.
*   The critical need for **type conversion** (`int()`, `float()`) when expecting numerical input from `input()`, and the potential for `ValueError`.
*   A brief introduction to standard I/O streams (`sys.stdin`, `sys.stdout`, `sys.stderr`).

These methods enable your programs to communicate effectively with their users. Next, we'll expand our I/O capabilities to include working with files.