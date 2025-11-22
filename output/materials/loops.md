# Loops (for and while)

## Overview
Loops are control flow statements that allow you to execute a block of code repeatedly. This is incredibly useful for tasks like iterating over collections of data or performing an action a specific number of times. Python provides two main types of loops: `for` loops and `while` loops.

## 1. `for` Loops
The `for` loop is used for iterating over a sequence (such as a list, tuple, string, or range) or other iterable objects. It executes a block of code once for each item in the sequence.

### Syntax:
```python
for item in sequence:
    # code to execute for each item
```

### a. Iterating through a List
```python
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(f"I love {fruit}s!")
# Output:
# I love apples!
# I love bananas!
# I love cherrys!
```

### b. Iterating through a String
```python
for char in "Python":
    print(char)
# Output:
# P
# y
# t
# h
# o
# n
```

### c. Iterating using `range()`
The `range()` function generates a sequence of numbers, which is commonly used with `for` loops to iterate a specific number of times.

*   `range(stop)`: Generates numbers from `0` up to (but not including) `stop`.
*   `range(start, stop)`: Generates numbers from `start` up to (but not including) `stop`.
*   `range(start, stop, step)`: Generates numbers from `start` up to (not including) `stop`, incrementing by `step`.

```python
# Loop 5 times (0, 1, 2, 3, 4)
for i in range(5):
    print(f"Counting: {i}")

# Loop from 2 to 6 (2, 3, 4, 5)
for num in range(2, 7):
    print(f"Number: {num}")

# Loop from 0 to 9, stepping by 2 (0, 2, 4, 6, 8)
for even_num in range(0, 10, 2):
    print(f"Even number: {even_num}")
```

### d. `for` loop with `enumerate()`
If you need both the index and the item while iterating, use `enumerate()`.

```python
names = ["Alice", "Bob", "Charlie"]
for index, name in enumerate(names):
    print(f"Index {index}: {name}")
# Output:
# Index 0: Alice
# Index 1: Bob
# Index 2: Charlie
```

## 2. `while` Loops
The `while` loop repeatedly executes a block of code as long as a specified condition is `True`. It's suitable when you don't know in advance how many times you need to loop.

### Syntax:
```python
while condition:
    # code to execute as long as condition is True
    # make sure to change a variable involved in the condition
    # to eventually make the condition False, or it will be an infinite loop!
```

### Example:
```python
count = 0
while count < 5:
    print(f"Count is: {count}")
    count += 1 # Increment count to eventually make the condition False
# Output:
# Count is: 0
# Count is: 1
# Count is: 2
# Count is: 3
# Count is: 4


# Example: User input loop
secret_number = 7
guess = 0

# while guess != secret_number:
#     try:
#         guess = int(input("Guess the secret number (0-9): "))
#         if guess != secret_number:
#             print("Wrong guess, try again!")
#     except ValueError:
#         print("Invalid input. Please enter a number.")

# print("Congratulations! You guessed it.")
```

## 3. Loop Control Statements
Python provides statements to alter the normal flow of a loop.

### a. `break`
The `break` statement immediately terminates the loop (both `for` and `while`) and transfers control to the statement immediately following the loop.

```python
for i in range(10):
    if i == 5:
        print("Breaking loop at 5")
        break
    print(i)
# Output:
# 0
# 1
# 2
# 3
# 4
# Breaking loop at 5
```

### b. `continue`
The `continue` statement skips the rest of the current iteration of the loop and moves to the next iteration.

```python
for i in range(10):
    if i % 2 == 0: # If i is an even number
        continue   # Skip the rest of this iteration
    print(i)       # Only odd numbers will be printed
# Output:
# 1
# 3
# 5
# 7
# 9
```

### c. `pass`
The `pass` statement is a null operation; nothing happens when it executes. It's often used as a placeholder where a statement is syntactically required but you don't want any code to run yet.

```python
# This would cause an IndentationError without 'pass'
def my_empty_function():
    pass # TODO: Implement this function later

for i in range(3):
    if i == 1:
        pass # Do nothing when i is 1
    else:
        print(i)
# Output:
# 0
# 2
```

### d. `else` with Loops (Optional)
Both `for` and `while` loops can have an optional `else` block. This `else` block is executed *only if the loop completes without encountering a `break` statement*.

```python
# Example with 'for-else'
for i in range(5):
    print(i)
else:
    print("Loop finished without breaking")
# Output:
# 0
# 1
# 2
# 3
# 4
# Loop finished without breaking


for i in range(5):
    if i == 2:
        break
    print(i)
else:
    print("This will NOT print because the loop broke")
# Output:
# 0
# 1
```

## Summary
Loops are powerful tools for repetitive tasks. You've learned:
*   `for` loops for iterating over sequences and using `range()` for numerical iterations.
*   `while` loops for repeating code as long as a condition is true, being mindful of infinite loops.
*   Loop control statements: `break` to exit a loop, `continue` to skip the current iteration, and `pass` as a placeholder.
*   The optional `else` block with loops, executed only if the loop completes normally.

Understanding loops is crucial for writing efficient and dynamic programs. Next, we'll explore functions, which help you organize and reuse your code.