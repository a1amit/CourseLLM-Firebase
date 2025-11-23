# How Tokenizers Work: Mechanics and Objectives

## The Tokenization Process

A tokenizer is fundamentally a function that maps a raw text string to a list of integers (token IDs). This process involves looking up parts of the input text in the tokenizer's predefined vocabulary and converting them into their corresponding numerical representations.

## Key Parameters of a Tokenizer

To understand how tokenizers are designed and operate, it's important to grasp two key parameters:

**1. Vocabulary Size (V):**
This is the total number of unique tokens the model can recognize. For modern LLMs, this typically ranges from 30,000 to over 100,000 unique tokens. A larger vocabulary can represent more concepts directly but also increases model size and complexity.

**2. Maximum Context Length (L):**
This defines the maximum number of tokens the model can process at once. Text sequences longer than this limit must be truncated, as the model cannot attend to tokens beyond this window. This parameter directly impacts how much information an LLM can 'remember' or use in a single interaction.

## The Objective Function of Tokenization

Tokenizer algorithms are designed with a specific goal in mind, often formalized by an objective function. A primary objective is to make token sequences as short as possible while maintaining a manageable vocabulary size.

```
Minimize   Σ Tokens(Sentenceᵢ)   for i = 1 to N
Subject to VocabularySize ≤ V
```

### Why Minimize Token Count?

*   **Faster Inference:** Shorter sequences require fewer computational steps, leading to faster response times from the LLM.
*   **Lower Compute Cost:** Fewer tokens mean less processing, resulting in reduced computational resources and energy consumption.
*   **Larger Effective Context Window:** By representing the same amount of information with fewer tokens, more actual text can fit within the model's fixed maximum context length, effectively increasing the 'memory' or scope of understanding for the LLM.