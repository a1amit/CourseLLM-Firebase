# Modules and Packages: Structuring Larger Projects

## Overview
As your Python programs grow, organizing your code becomes crucial. **Modules** and **packages** are Python's way of structuring your code into logical, reusable files and directories. This module will explain what they are and how to use them to manage larger projects.

## 1. What is a Module?
A **module** is simply a Python file (`.py` extension) containing Python code, such as functions, classes, and variables. Any Python file can be a module. When you import a module, you gain access to all the definitions within it.

### Creating a Module
Let's create a simple module. Save the following code as `my_math.py`:

```python
# my_math.py

def add(a, b):
    """Returns the sum of two numbers."""
    return a + b

def subtract(a, b):
    """Returns the difference between two numbers."""
    return a - b

PI = 3.14159

if __name__ == "__main__":
    print("This code runs when my_math.py is executed directly.")
    print(f"10 + 5 = {add(10, 5)}")
```

### Importing a Module
You can use the `import` statement to make the definitions from `my_math.py` available in another Python file (e.g., `main.py` in the same directory).

**Option 1: Import the entire module**
```python
# main.py
import my_math

result_add = my_math.add(7, 3)
print(f"Result of addition: {result_add}") # Output: Result of addition: 10

result_sub = my_math.subtract(10, 4)
print(f"Result of subtraction: {result_sub}") # Output: Result of subtraction: 6

print(f"Value of PI: {my_math.PI}") # Output: Value of PI: 3.14159
```
*   When you import `my_math`, you access its contents using the module name as a prefix (`my_math.add`, `my_math.PI`).
*   The `if __name__ == "__main__":` block inside `my_math.py` ensures that the code inside it only runs when `my_math.py` is executed directly, not when it's imported as a module.

**Option 2: Import with an alias**
```python
# main.py
import my_math as mm

print(f"Result using alias: {mm.add(100, 20)}") # Output: Result using alias: 120
```
*   Useful for long module names or to avoid name collisions.

**Option 3: Import specific definitions**
```python
# main.py
from my_math import add, PI

print(f"Result of add directly: {add(1, 2)}") # Output: Result of add directly: 3
print(f"PI directly: {PI}")              # Output: PI directly: 3.14159

# print(subtract(5, 2)) # This would cause a NameError, as subtract was not imported
```
*   Allows you to use the imported functions/variables directly without the module prefix.

**Option 4: Import all definitions (generally discouraged)**
```python
# main.py
from my_math import *

print(f"Result of add directly (all): {add(2, 2)}") # Output: Result of add directly (all): 4
print(f"PI directly (all): {PI}")              # Output: PI directly (all): 3.14159
```
*   Imports all public names (not starting with `_`) into the current namespace.
*   **Discouraged in production code** as it can lead to name clashes and make it harder to tell where a function or variable came from.

## 3. What is a Package?
A **package** is a way of organizing related modules into a directory hierarchy. It's essentially a directory containing a special file named `__init__.py` and other modules/sub-packages.

### Creating a Package
Let's create a package structure:

```
my_project/
├── main.py
└── calculations/
    ├── __init__.py
    ├── basic_ops.py
    └── advanced_ops.py
```

**`calculations/__init__.py`** (can be empty, but often contains package-level initialization or defines what's exposed when `*` is used):
```python
# calculations/__init__.py
# This file makes the 'calculations' directory a Python package.
# You can also import specific modules from within the package here
# to make them directly accessible when importing the package.

# Example: from . import basic_ops
# This would allow 'from calculations import basic_ops'
# or 'import calculations.basic_ops'
```

**`calculations/basic_ops.py`**:
```python
# calculations/basic_ops.py
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b
```

**`calculations/advanced_ops.py`**:
```python
# calculations/advanced_ops.py
def power(base, exp):
    return base ** exp

def square_root(num):
    return num ** 0.5
```

### Importing from a Package
Now, from `main.py`, you can import specific modules or functions from your `calculations` package:

```python
# main.py

# Import an entire module from the package
import calculations.basic_ops
print(f"Basic add: {calculations.basic_ops.add(10, 5)}")

# Import a specific function from a module within the package
from calculations.advanced_ops import power
print(f"Power: {power(2, 3)}") # 2^3 = 8

# Import a module with an alias
from calculations import basic_ops as ops
print(f"Basic subtract (alias): {ops.subtract(20, 7)}")

# If __init__.py exposed something like 'from . import basic_ops',
# you could then do: from calculations import basic_ops
# print(f"Access via init: {basic_ops.add(1,1)}")
```

## 4. The Python Standard Library
Python comes with a vast collection of pre-built modules and packages known as the **Python Standard Library**. These modules provide ready-to-use functionalities for common programming tasks, avoiding the need to rewrite common code.

Some commonly used standard library modules:
*   **`math`:** Mathematical functions (e.g., `math.sqrt`, `math.cos`, `math.pi`).
*   **`random`:** Functions for generating random numbers.
*   **`datetime`:** Classes for working with dates and times.
*   **`os`:** Provides a way of using operating system dependent functionality like reading or writing to the file system.
*   **`sys`:** Provides access to system-specific parameters and functions.

```python
import math
print(f"Square root of 16: {math.sqrt(16)}")
print(f"Value of pi: {math.pi}")

import random
print(f"Random number between 1 and 10: {random.randint(1, 10)}")

from datetime import datetime
now = datetime.now()
print(f"Current date and time: {now}")
```

## 5. Third-Party Packages (PyPI)
Beyond the standard library, there's a huge ecosystem of third-party packages available on the Python Package Index (PyPI). These packages are created by the community and provide solutions for almost any task imaginable.

To install third-party packages, you use `pip` (Python's package installer), which usually comes with Python 3.x.

```bash
pip install package_name
# Example: pip install requests (for HTTP requests)
# Example: pip install numpy (for numerical computing)
```
Once installed, you can import and use them just like standard library modules.

## Summary
Modules and packages are fundamental for organizing larger Python projects and leveraging existing code. You've learned:
*   What a **module** is (a `.py` file).
*   Different ways to **import** modules and their definitions (`import module`, `import module as alias`, `from module import name`, `from module import *`).
*   What a **package** is (a directory with `__init__.py` and modules/sub-packages).
*   How to **import from packages**.
*   The importance of the **Python Standard Library** for built-in functionalities.
*   How to use **`pip`** to install **third-party packages** from PyPI.

This knowledge is vital for building maintainable and scalable applications. In the next module, we'll explore how your programs can interact with users through input and output.