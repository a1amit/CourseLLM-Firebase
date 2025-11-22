# Variables and Data Types

## Overview
In programming, data is central to everything. This module introduces you to **variables**, which are containers for storing data, and **data types**, which classify the kind of data a variable holds.

## 1. Variables
A variable is a named storage location in memory. You use variables to store values that can change during the program's execution.

### Declaring and Assigning Variables
In Python, you create a variable by giving it a name and assigning a value to it using the assignment operator (`=`).

```python
# Assigning an integer to a variable
score = 100

# Assigning a string to a variable
player_name = "Mario"

# Assigning a boolean to a variable
is_game_over = False

print(score)
print(player_name)
print(is_game_over)
```

### Variable Naming Rules and Conventions
*   **Must start with:** A letter (a-z, A-Z) or an underscore (`_`).
*   **Cannot start with:** A number.
*   **Can contain:** Letters, numbers, and underscores.
*   **Case-sensitive:** `age`, `Age`, and `AGE` are three different variables.
*   **Cannot be:** Python keywords (e.g., `if`, `for`, `while`, `print`).
*   **Convention (PEP 8):** Use `snake_case` (lowercase words separated by underscores) for variable and function names (e.g., `my_variable_name`).

```python
# Valid variable names
my_age = 30
_private_var = "secret"
user_id_2 = 101

# Invalid variable names (will cause SyntaxError or NameError)
# 2nd_user = "Luigi" # Cannot start with a number
# class = "Warrior" # 'class' is a keyword
# my-variable = 5   # Hyphens are not allowed
```

## 2. Data Types
Python is dynamically typed, meaning you don't need to explicitly declare the data type of a variable. Python infers the type based on the assigned value. You can check the type of any variable using the `type()` function.

### a. Numeric Types
Used to store numerical values.

*   **`int` (Integer):** Whole numbers (positive, negative, or zero) without a fractional part.
    ```python
    age = 30
    temperature = -5
    print(type(age))        # <class 'int'>
    ```
*   **`float` (Floating-point number):** Numbers with a decimal point.
    ```python
    price = 19.99
    pi = 3.14159
    print(type(price))      # <class 'float'>
    ```
*   **`complex` (Complex number):** Numbers with a real and imaginary part (e.g., `3 + 4j`). Less common in general programming.
    ```python
    z = 1 + 2j
    print(type(z))          # <class 'complex'>
    ```

### b. String Type (`str`)
Used to store sequences of characters (text). Strings are enclosed in single quotes (`'`), double quotes (`"`), or triple quotes (`"""` or `'''`).

```python
name = 'Alice'
description = "This is a long text."
multi_line_string = """This string
spans multiple
lines."""

print(type(name))         # <class 'str'>
print(len(description))   # Returns the length of the string (19)
print(name[0])            # Accesses the first character: 'A'
print(description[5:9])   # Slicing: 'is a'
```

### c. Boolean Type (`bool`)
Used to store logical values: `True` or `False`. Used extensively in conditional logic.

```python
is_active = True
has_permission = False

print(type(is_active))    # <class 'bool'>
```

### d. Sequence Types
Ordered collections of items.

*   **`list`:** An ordered, mutable (changeable) collection of items. Items can be of different data types. Defined by square brackets `[]`.
    ```python
    fruits = ["apple", "banana", "cherry"]
    numbers = [1, 2, 3, 4, 5]
    mixed_list = ["text", 10, True, 3.14]

    print(type(fruits))      # <class 'list'>
    print(fruits[1])         # Access by index: "banana"
    fruits.append("orange")  # Add an item
    print(fruits)            # ['apple', 'banana', 'cherry', 'orange']
    ```
*   **`tuple`:** An ordered, immutable (unchangeable) collection of items. Defined by parentheses `()`.
    ```python
    coordinates = (10.0, 20.0)
    rgb_color = (255, 0, 0)

    print(type(coordinates)) # <class 'tuple'>
    print(coordinates[0])    # Access by index: 10.0
    # coordinates.append(30.0) # This would cause an AttributeError (immutable)
    ```
*   **`range`:** An immutable sequence of numbers, often used in `for` loops. (Will be covered more with loops).
    ```python
    # range(start, stop, step)
    my_range = range(0, 5) # Represents numbers 0, 1, 2, 3, 4
    print(type(my_range))  # <class 'range'>
    print(list(my_range))  # Convert to list to see values: [0, 1, 2, 3, 4]
    ```

### e. Mapping Type

*   **`dict` (Dictionary):** An unordered, mutable collection of key-value pairs. Keys must be unique and immutable (e.g., strings, numbers, tuples). Defined by curly braces `{}`.
    ```python
    person = {"name": "Alice", "age": 30, "city": "New York"}

    print(type(person))      # <class 'dict'>
    print(person["name"])    # Access value by key: "Alice"
    person["age"] = 31       # Modify a value
    person["job"] = "Engineer" # Add a new key-value pair
    print(person)            # {'name': 'Alice', 'age': 31, 'city': 'New York', 'job': 'Engineer'}
    ```

### f. Set Types

*   **`set`:** An unordered collection of unique, immutable items. Useful for mathematical set operations (union, intersection) and removing duplicates. Defined by curly braces `{}`.
    ```python
    unique_numbers = {1, 2, 3, 3, 4, 1}
    print(type(unique_numbers)) # <class 'set'>
    print(unique_numbers)       # {1, 2, 3, 4} (duplicates removed, order not guaranteed)
    ```
*   **`frozenset`:** An immutable version of a set.

## 3. Type Conversion (Type Casting)
Sometimes you need to convert a value from one data type to another. Python provides built-in functions for this.

```python
# int() for converting to integer
num_str = "10"
num_int = int(num_str)
print(num_int, type(num_int)) # 10 <class 'int'>

# float() for converting to float
num_float = float("10.5")
print(num_float, type(num_float)) # 10.5 <class 'float'>

# str() for converting to string
num = 123
num_to_str = str(num)
print(num_to_str, type(num_to_str)) # "123" <class 'str'>

# list() for converting to list
my_tuple = (1, 2, 3)
my_list = list(my_tuple)
print(my_list, type(my_list)) # [1, 2, 3] <class 'list'>

# int("hello") # This would cause a ValueError as "hello" cannot be converted to an integer
```

## Summary
Understanding variables and data types is fundamental. You've learned:
*   How to declare and assign values to variables.
*   Python's dynamic typing and how to check types with `type()`.
*   The most common data types: `int`, `float`, `str`, `bool`, `list`, `tuple`, `dict`, and `set`.
*   How to convert data between different types using built-in functions.

Next, we'll see how to perform operations on these variables using operators.