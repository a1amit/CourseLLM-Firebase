# Functions: Organizing and Reusing Code

## Overview
Functions are blocks of organized, reusable code that perform a single, related action. They help break down complex problems into smaller, manageable chunks, making your code more modular, readable, and easier to maintain. This module covers how to define, call, and use functions effectively in Python.

## 1. Why Use Functions?
*   **Modularity:** Breaking down a program into smaller, logical functions makes it easier to understand, test, and debug.
*   **Reusability:** Once a function is defined, it can be called multiple times from different parts of your program without rewriting the same code.
*   **Readability:** Functions give names to blocks of code, making the program's purpose clearer.
*   **Maintainability:** If a change is needed, you only have to modify the function's code in one place.

## 2. Defining a Function
You define a function using the `def` keyword, followed by the function name, parentheses `()`, and a colon `:`. The code block forming the function's body must be indented.

### Syntax:
```python
def function_name(parameters):
    """Docstring: Explain what the function does."""
    # function body (indented code)
    statement1
    statement2
    return value # Optional: returns a value from the function
```

*   **`def`:** Keyword to start a function definition.
*   **`function_name`:** A descriptive name (use `snake_case` convention).
*   **`parameters` (optional):** Inputs passed to the function, defined inside the parentheses.
*   **`:` (colon):** Marks the end of the function header.
*   **Indentation:** The function body must be indented.
*   **Docstring:** A string literal immediately after the `def` line, used to document the function's purpose, arguments, and return value. Highly recommended for good practice.
*   **`return` (optional):** Used to send a value back from the function to the caller. If omitted, the function implicitly returns `None`.

### Example:
```python
def greet():
    """Prints a simple greeting message."""
    print("Hello, welcome to Python functions!")
```

## 3. Calling a Function
To execute the code inside a function, you **call** it by using its name followed by parentheses `()`.

```python
greet() # Calls the greet function
# Output: Hello, welcome to Python functions!

# You can call it multiple times
greet()
```

## 4. Function Parameters (Arguments)
Parameters are variables listed inside the parentheses in the function definition. They act as placeholders for values that will be passed into the function when it's called. These values are called **arguments**.

### a. Positional Arguments
Arguments passed based on their position in the function call.

```python
def greet_user(name):
    """Greets the user with their given name."""
    print(f"Hello, {name}!")

greet_user("Alice") # 'Alice' is passed as the 'name' argument
greet_user("Bob")
```

### b. Keyword Arguments
Arguments identified by their parameter names in the function call. This improves readability and allows arguments to be passed out of order.

```python
def describe_pet(animal_type, pet_name):
    """Displays information about a pet."""
    print(f"I have a {animal_type}.")
    print(f"Its name is {pet_name}.")

describe_pet(animal_type="hamster", pet_name="Harry")
describe_pet(pet_name="Dolly", animal_type="dog") # Order doesn't matter with keyword arguments
```

### c. Default Parameters
You can provide default values for parameters. If an argument for that parameter is not provided in the function call, the default value is used.

```python
def describe_city(city, country="USA"):
    """Describes a city and its country (defaulting to USA)."""
    print(f"{city} is in {country}.")

describe_city("New York")             # Uses default country: New York is in USA.
describe_city("London", "UK")        # Overrides default: London is in UK.
describe_city(city="Paris", country="France") # Using keyword arguments with defaults
```
**Important:** Default parameters must come after any non-default parameters.

### d. Arbitrary Arguments (`*args` and `**kwargs`)
*   **`*args` (Arbitrary Positional Arguments):** Allows a function to accept a variable number of non-keyword (positional) arguments. These arguments are packed into a `tuple` inside the function.
    ```python
    def sum_all(*numbers):
        """Calculates the sum of an arbitrary number of arguments."""
        total = 0
        for num in numbers:
            total += num
        return total

    print(sum_all(1, 2, 3))         # 6
    print(sum_all(10, 20, 30, 40))  # 100
    ```
*   **`**kwargs` (Arbitrary Keyword Arguments):** Allows a function to accept a variable number of keyword arguments. These arguments are packed into a `dictionary` inside the function.
    ```python
    def print_details(**details):
        """Prints all key-value pairs passed as keyword arguments."""
        for key, value in details.items():
            print(f"{key.replace('_', ' ').title()}: {value}")

    print_details(name="Alice", age=30, city="New York")
    # Output:
    # Name: Alice
    # Age: 30
    # City: New York
    ```

## 5. Return Values
The `return` statement is used to send a value (or values) back from the function to the place where it was called. This allows functions to produce results that can be used by other parts of the program.

```python
def add(a, b):
    """Returns the sum of two numbers."""
    result = a + b
    return result

def multiply(a, b):
    """Returns the product of two numbers."""
    return a * b # Direct return

sum_result = add(5, 3)
print(f"Sum: {sum_result}") # Output: Sum: 8

product_result = multiply(4, 2)
print(f"Product: {product_result}") # Output: Product: 8

# Functions can return multiple values (as a tuple)
def get_name_and_age():
    return "Charlie", 25

name, age = get_name_and_age() # Unpacking the tuple
print(f"Name: {name}, Age: {age}") # Output: Name: Charlie, Age: 25
```
If a function doesn't have an explicit `return` statement, it implicitly returns `None`.

```python
def do_nothing():
    pass # No return statement

result = do_nothing()
print(f"Result of do_nothing(): {result}") # Output: Result of do_nothing(): None
```

## 6. Scope of Variables (Local vs. Global)
*   **Local Variables:** Variables defined inside a function are local to that function. They can only be accessed within the function and cease to exist once the function finishes execution.
*   **Global Variables:** Variables defined outside any function are global. They can be accessed from anywhere in the program, both inside and outside functions.

```python
global_var = "I am global"

def my_function():
    local_var = "I am local"
    print(global_var) # Can access global_var
    print(local_var)  # Can access local_var

my_function()

print(global_var)
# print(local_var) # This would cause a NameError, as local_var is not defined outside the function
```

**Modifying Global Variables:** It's generally bad practice to modify global variables directly from within a function as it can lead to hard-to-track bugs. If you *must* modify a global variable from inside a function, use the `global` keyword.

```python
x = 10 # Global variable

def modify_global():
    global x # Declare intent to modify the global x
    x = 20   # This modifies the global x

def try_to_modify_global_without_global():
    y = 5 # This creates a NEW local variable 'y', it does not modify a global 'y' if one existed
    print(f"Inside function (local y): {y}")

print(f"Before modification: {x}") # 10
modify_global()
print(f"After modification: {x}")  # 20

try_to_modify_global_without_global()
# If there was a global 'y', it would remain unchanged
```

## Summary
Functions are indispensable for writing well-structured and efficient Python code. You've learned:
*   The benefits of using functions (modularity, reusability, readability, maintainability).
*   How to define a function using `def`, including parameters and docstrings.
*   How to call a function to execute its code.
*   Different types of parameters: positional, keyword, default, and arbitrary (`*args`, `**kwargs`).
*   How to use the `return` statement to send values back from a function.
*   The concept of variable scope (local vs. global) and the `global` keyword.

With functions, you can start building more complex and organized programs. Next, we'll look at how to use and create modules and packages to further structure your code.