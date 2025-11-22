# File Operations: Reading and Writing Files

## Overview
Most real-world applications need to store and retrieve data persistently. This often involves reading from and writing to files. This module will teach you how to perform basic file operations in Python, including opening, reading, writing, and closing files.

## 1. Opening Files: The `open()` Function
Before you can read or write to a file, you must open it using the built-in `open()` function. This function returns a file object.

### Syntax:
```python
file_object = open("filename.txt", "mode")
```

*   **`"filename.txt"`:** The path to the file you want to open. If it's in the same directory as your script, just the name is sufficient. Otherwise, provide a full or relative path.
*   **`"mode"`:** A string specifying the purpose for opening the file.

#### Common File Modes:
| Mode | Description                                                               | Action if file exists | Action if file doesn't exist |
| :--- | :------------------------------------------------------------------------ | :-------------------- | :--------------------------- |
| `r`  | **Read** (default). Opens for reading.                                    | Read from start       | `FileNotFoundError`          |
| `w`  | **Write**. Opens for writing. **Truncates (empties) the file.**          | Content erased        | Creates new file             |
| `a`  | **Append**. Opens for writing, appending to the end of the file.          | Appends to end        | Creates new file             |
| `x`  | **Exclusive Creation**. Creates a new file and opens it for writing.       | `FileExistsError`     | Creates new file             |
| `r+` | **Read and Write**. Opens for both reading and writing.                   | Read/write from start | `FileNotFoundError`          |
| `w+` | **Write and Read**. Opens for both writing and reading. **Truncates.**   | Content erased        | Creates new file             |
| `a+` | **Append and Read**. Opens for both appending and reading.                | Appends/reads         | Creates new file             |

Add `b` to the mode for binary mode (e.g., `rb`, `wb`) for non-text files like images or executables. For text files, the default is text mode (`t`), so `r` is `rt` implicitly.

## 2. Reading from Files
Once a file is open in read mode (`'r'`), you can read its content.

### a. `read()`: Read entire file or specified bytes/characters
```python
# Create a dummy file for reading
with open("example.txt", "w") as f:
    f.write("Hello, file operations!\n")
    f.write("This is the second line.\n")
    f.write("And a third.")

# Read the entire file content
with open("example.txt", "r") as file:
    content = file.read()
    print("--- Entire File Content ---")
    print(content)

# Read a specified number of characters
with open("example.txt", "r") as file:
    first_5_chars = file.read(5)
    print("\n--- First 5 Characters ---")
    print(first_5_chars)
    remaining_content = file.read() # Reads from where the last read left off
    print("--- Remaining Content ---")
    print(remaining_content)
```

### b. `readline()`: Read one line at a time
```python
with open("example.txt", "r") as file:
    line1 = file.readline()
    line2 = file.readline()
    print("\n--- Line by Line ---")
    print(f"Line 1: {line1.strip()}") # .strip() removes trailing newline
    print(f"Line 2: {line2.strip()}")
```
`readline()` returns an empty string `''` when the end of the file is reached.

### c. `readlines()`: Read all lines into a list
```python
with open("example.txt", "r") as file:
    all_lines = file.readlines()
    print("\n--- All Lines as List ---")
    for line in all_lines:
        print(line.strip())
```

### d. Iterating through a file object (most memory-efficient for large files)
```python
print("\n--- Iterating through file object ---")
with open("example.txt", "r") as file:
    for line in file: # Iterates line by line automatically
        print(f"Line: {line.strip()}")
```

## 3. Writing to Files
When a file is open in write mode (`'w'`), append mode (`'a'`), or exclusive creation mode (`'x'`), you can write content to it.

### a. `write()`: Write a string to the file
```python
# Overwrites the file if it exists, creates if not
with open("output.txt", "w") as file:
    file.write("This is the first line.\n") # Must explicitly add newlines
    file.write("This is the second line.\n")
    file.write("A number: " + str(123) + "\n")

print("Content written to output.txt in write mode.")

# Append to the file
with open("output.txt", "a") as file:
    file.write("This line is appended.\n")
    file.write("Another appended line.\n")

print("Content appended to output.txt.")

# Exclusive creation (will fail if output2.txt already exists)
try:
    with open("output2.txt", "x") as file:
        file.write("This file was created exclusively.\n")
    print("output2.txt created exclusively.")
except FileExistsError:
    print("output2.txt already exists, skipping exclusive creation.")
```

### b. `writelines()`: Write a list of strings to the file
```python
lines_to_write = [
    "Line from writelines 1\n",
    "Line from writelines 2\n",
    "Line from writelines 3\n"
]

with open("output.txt", "a") as file:
    file.writelines(lines_to_write)

print("List of lines appended to output.txt.")
```
**Note:** `writelines()` does not add newlines automatically; you must include `\n` at the end of each string if you want them on separate lines.

## 4. Closing Files: The `with` Statement
It is crucial to **close files** after you are done with them to free up system resources and ensure all buffered writes are flushed to disk. Forgetting to close files can lead to data loss or resource leaks.

The best way to handle file operations in Python is using the `with` statement (a context manager). It ensures that the file is automatically closed, even if errors occur.

```python
# Using 'with' statement for automatic file closing
with open("example.txt", "r") as file:
    content = file.read()
    print(f"Content read using with statement:\n{content}")
# File is automatically closed here, outside the 'with' block

# Without 'with', you'd need explicit close()
try:
    file = open("another_example.txt", "w")
    file.write("Manually managed file.\n")
finally:
    file.close()
    print("File closed manually.")
```
**Always prefer the `with` statement** for file handling.

## 5. File System Operations (`os` module)
The `os` module provides functions to interact with the operating system, including file system operations like checking for file existence, deleting, renaming, etc.

```python
import os

# Check if a file exists
if os.path.exists("example.txt"):
    print("example.txt exists.")
else:
    print("example.txt does not exist.")

# Get file size
if os.path.exists("example.txt"):
    size = os.path.getsize("example.txt")
    print(f"Size of example.txt: {size} bytes")

# Rename a file
try:
    if os.path.exists("output.txt"):
        os.rename("output.txt", "renamed_output.txt")
        print("output.txt renamed to renamed_output.txt")
except FileNotFoundError:
    print("output.txt not found for renaming.")

# Delete a file
try:
    if os.path.exists("renamed_output.txt"):
        os.remove("renamed_output.txt")
        print("renamed_output.txt deleted.")
except FileNotFoundError:
    print("renamed_output.txt not found for deletion.")

# Create a directory
directory_name = "my_new_folder"
if not os.path.exists(directory_name):
    os.makedirs(directory_name) # os.mkdir for single directory
    print(f"Directory '{directory_name}' created.")
else:
    print(f"Directory '{directory_name}' already exists.")

# Clean up dummy files/folders
if os.path.exists("example.txt"):
    os.remove("example.txt")
if os.path.exists("output2.txt"):
    os.remove("output2.txt")
# os.rmdir(directory_name) # Will fail if directory is not empty
```

## Summary
File operations are fundamental for data persistence in applications. You've learned:
*   How to **open files** using `open()` with various modes (`r`, `w`, `a`, `x`, `+` variations).
*   Different methods for **reading file content**: `read()`, `readline()`, `readlines()`, and iterating directly over the file object.
*   Methods for **writing content to files**: `write()` and `writelines()`.
*   The importance of **closing files** and how to do it safely and automatically using the `with` statement.
*   Basic file system interactions using the `os` module.

With these skills, your programs can now store and retrieve data, making them much more robust. In the final core module, we'll discuss how to handle errors that might occur during program execution.