# Setting Up Your Python Environment

## Overview
Before you can write and run Python code, you need to set up your development environment. This module will guide you through installing Python and choosing a code editor or Integrated Development Environment (IDE).

## 1. Installing Python
Python has different versions. It's recommended to use the latest stable version, which is Python 3.x. Python 2.x is officially deprecated and should not be used for new projects.

### Windows
1.  Go to the official Python website: [python.org/downloads/](https://www.python.org/downloads/).
2.  Download the latest Python 3.x installer (e.g., "Windows installer (64-bit)").
3.  Run the installer.
4.  **CRITICAL STEP:** On the first screen of the installer, make sure to check the box that says "Add Python X.X to PATH". This allows you to run Python commands from any directory in your command prompt.
5.  Click "Install Now" and follow the prompts.
6.  To verify the installation, open your Command Prompt (search for `cmd`) and type:
    ```bash
    python --version
    ```
    You should see the installed Python version.

### macOS
1.  macOS often comes with an older version of Python 2.x pre-installed. You need to install Python 3.x separately.
2.  Go to the official Python website: [python.org/downloads/](https://www.python.org/downloads/).
3.  Download the latest Python 3.x macOS installer.
4.  Run the installer and follow the prompts. The installer usually handles adding Python to your PATH automatically.
5.  To verify the installation, open your Terminal (search for `Terminal`) and type:
    ```bash
    python3 --version
    ```
    You should see the installed Python 3.x version.

### Linux (Ubuntu/Debian)
1.  Most modern Linux distributions come with Python 3 pre-installed. You can check its version:
    ```bash
    python3 --version
    ```
2.  If you need to install or update it, use your package manager:
    ```bash
    sudo apt update
    sudo apt install python3 python3-pip
    ```

## 2. Choosing a Code Editor / IDE
A code editor or IDE (Integrated Development Environment) is where you will write your Python code. While you can use a simple text editor, these tools offer features like syntax highlighting, autocompletion, and debugging that greatly improve your productivity.

Here are some popular choices:

*   **VS Code (Visual Studio Code):** Highly recommended for beginners and professionals. It's free, lightweight, cross-platform, and has excellent Python support through extensions. ([code.visualstudio.com](https://code.visualstudio.com/))
    *   **Recommendation:** Install the "Python" extension by Microsoft from the Extensions view within VS Code.
*   **PyCharm:** A powerful, dedicated Python IDE. It comes in two versions: Community (free and open-source) and Professional (paid). PyCharm Community is a great choice if you prefer a full-featured IDE. ([jetbrains.com/pycharm/](https://www.jetbrains.com/pycharm/))
*   **Jupyter Notebooks / JupyterLab:** Excellent for data science, machine learning, and interactive computing where you combine code, output, and explanatory text in a single document. Often installed as part of the Anaconda distribution. ([jupyter.org](https://jupyter.org/))

For this course, **VS Code** will be assumed for general code editing due to its popularity and ease of use.

## 3. Your First Program (Test Drive)
Let's ensure everything is working by writing and running a simple Python script.

1.  Open your chosen code editor (e.g., VS Code).
2.  Create a new file and save it as `hello_world.py`.
3.  Type the following code into the file:
    ```python
    print("Hello, World!")
    ```
4.  Save the file.
5.  Open your Command Prompt (Windows) or Terminal (macOS/Linux).
6.  Navigate to the directory where you saved `hello_world.py` using the `cd` command (e.g., `cd Documents/PythonProjects`).
7.  Run the script using the Python interpreter:
    ```bash
    python hello_world.py
    ```
    or on macOS/Linux (or if you explicitly installed `python3`):
    ```bash
    python3 hello_world.py
    ```

    You should see `Hello, World!` printed in your console.

Congratulations! Your environment is set up, and you've run your first Python program. In the next module, we'll dive into the basic syntax of Python.