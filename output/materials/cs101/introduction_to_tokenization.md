# Introduction to Tokenization

Tokenization is the critical first step in an LLM's workflow. It involves breaking raw text into smaller, meaningful units called **tokens**. The Large Language Model (LLM) operates exclusively on these tokens---not on raw characters or words themselves.

## The Core Idea

Imagine an LLM as a sophisticated calculator that can only understand numbers. Raw text, like a sentence you type, is not directly understandable by this calculator. Tokenization acts as a translator, converting your human-readable text into a numerical format that the LLM can process.

Each token is assigned a unique numerical ID, and these IDs are what the LLM truly works with. This conversion is fundamental to how LLMs learn from and generate text.