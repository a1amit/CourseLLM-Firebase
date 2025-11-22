# Error Handling: Managing Exceptions

## Overview
Even the most carefully written programs can encounter unexpected situations during execution, leading to errors. In Python, these errors are called **exceptions**. This module will teach you how to anticipate and gracefully handle exceptions using `try`, `except`, `else`, and `finally` blocks, making your programs more robust.

## 1. What are Exceptions?
An exception is an event that disrupts the normal flow of a program. When a Python script encounters an error that it cannot handle, it raises an exception. If unhandled, this causes the program to terminate and display a traceback (error message).

### Common Built-in Exceptions:
*   **`NameError`:** Attempting to use a variable name that hasn't been defined.
*   **`TypeError`:** An operation is applied to an object of an inappropriate type (e.g., adding a number to a string).
*   **`ValueError`:** A function receives an argument of the correct type but an inappropriate value (e.g., `int("hello")`).
*   **`IndexError`:** Trying to access an index that is out of range for a sequence (list, tuple, string).
*   **`KeyError`:** Trying to access a non-existent key in a dictionary.
*   **`FileNotFoundError`:** Attempting to open a file that does not exist.
*   **`ZeroDivisionError`:** Attempting to divide a number by zero.

```python
# Example of an unhandled exception
# print(undefined_variable) # NameError
# print(10 + "text")      # TypeError
# print(int("abc"))       # ValueError
# my_list = [1]
# print(my_list[5])       # IndexError
```

## 2. The `try-except` Block
The `try-except` block is used to catch and handle exceptions. Code that might raise an exception is placed inside the `try` block. If an exception occurs, the code inside the corresponding `except` block is executed.

### Syntax:
```python
try:
    # Code that might raise an exception
    ...
except ExceptionType as e:
    # Code to execute if ExceptionType occurs
    # 'e' is an optional variable to hold the exception instance
    ...
except AnotherExceptionType:
    # Code to execute if AnotherExceptionType occurs
    ...
except:
    # (Optional) Catches any other exception not caught above
    # Generally discouraged for specific error handling
    ...
```

### Example:
```python
# Handling ZeroDivisionError
try:
    result = 10 / 0
    print(result)
except ZeroDivisionError:
    print("Error: Cannot divide by zero!")
# Output: Error: Cannot divide by zero!

# Handling ValueError during type conversion
user_input = input("Enter a number: ")
try:
    num = int(user_input)
    print(f"You entered: {num}")
except ValueError:
    print(f"Invalid input: '{user_input}' is not a valid integer.")

# Handling multiple specific exceptions
my_dict = {"a": 1}

try:
    value = my_dict["b"] # This will cause a KeyError
    # value = my_dict["a"] # This would work
    print(value[0])      # This would cause a TypeError if value is not a sequence
except KeyError:
    print("Error: Dictionary key not found.")
except TypeError:
    print("Error: Incorrect operation on data type.")
except Exception as e: # Catch any other unexpected exception
    print(f"An unexpected error occurred: {e}")

print("Program continues after exception handling.")
```
*   It's good practice to catch **specific exceptions** rather than using a bare `except` statement, as a bare `except` can hide programming errors.
*   The `Exception` class is the base class for most built-in exceptions. Catching `Exception` will catch almost all types of errors.

## 3. The `else` Block (with `try-except`)
An optional `else` block can be included after all `except` blocks. The code inside the `else` block is executed *only if no exception occurred* in the `try` block.

```python
try:
    num1 = int(input("Enter numerator: "))
    num2 = int(input("Enter denominator: "))
    quotient = num1 / num2
except ValueError:
    print("Invalid input. Please enter numbers.")
except ZeroDivisionError:
    print("Cannot divide by zero.")
else:
    print(f"The quotient is: {quotient}")
    print("No exceptions occurred in the try block.")
```

## 4. The `finally` Block
An optional `finally` block can be included after the `try`, `except`, and `else` blocks. The code inside the `finally` block is **always executed**, regardless of whether an exception occurred or not, and regardless of whether it was handled.

This is useful for cleanup operations that must happen no matter what, such as closing files or network connections.

```python
file_object = None # Initialize to None
try:
    file_object = open("non_existent_file.txt", "r")
    content = file_object.read()
    print(content)
except FileNotFoundError:
    print("Error: The file was not found.")
finally:
    if file_object:
        file_object.close()
        print("File object closed in finally block.")
    print("This always runs!")

print("\n--- Another example with finally ---")
def divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Caught division by zero!")
        return "Error"
    else:
        print("Division successful.")
        return result
    finally:
        print("Executing finally block.")

print(divide(10, 2)) # Output: Division successful. Executing finally block. 5.0
print(divide(10, 0)) # Output: Caught division by zero! Executing finally block. Error
```

## 5. Raising Exceptions (`raise`)
You can intentionally raise an exception in your code using the `raise` keyword. This is useful when you detect an error condition that your function cannot handle, and you want to propagate the error to the caller.

```python
def validate_age(age):
    if not isinstance(age, int) or age <= 0:
        raise ValueError("Age must be a positive integer.")
    if age > 120:
        raise ValueError("Age seems unrealistic.")
    print(f"Age {age} is valid.")

try:
    validate_age(30)
    validate_age(-5) # This will raise a ValueError
    validate_age("abc") # This will raise a TypeError (not int)
except ValueError as e:
    print(f"Caught validation error: {e}")
except TypeError as e:
    print(f"Caught type error: {e}")
```

## Summary
Error handling is a critical skill for writing robust and user-friendly Python applications. You've learned:
*   What **exceptions** are and why they occur.
*   How to use the **`try` and `except` blocks** to catch and handle specific or general exceptions.
*   The role of the **`else` block** for code that runs only if no exception occurs.
*   The purpose of the **`finally` block** for guaranteed cleanup operations.
*   How to **`raise` exceptions** to signal error conditions from your own code.

By effectively handling exceptions, you can prevent your programs from crashing unexpectedly and provide meaningful feedback to users or other parts of your application. This concludes the foundational modules for Python programming.