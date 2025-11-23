# How Tokenizers Work

A tokenizer is fundamentally a function that maps a text string to a list of integers. Each integer represents a specific token from the model's vocabulary.

```python
def tokenize(text: str) -> list[int]:
    # Internal logic to break text into tokens and map to IDs
    pass
```

## Key Parameters of a Tokenizer

When designing or using a tokenizer, two key parameters are crucial:

**1. Vocabulary Size (V):**
The number of unique tokens the model can recognize. This is typically a fixed value, ranging from 30,000 to over 100,000 unique tokens. A larger vocabulary can capture more specific meanings but requires more memory and computational resources.

**2. Maximum Context Length (L):**
The maximum number of tokens the model can process at once. This defines the 'window' of text the LLM can consider for its predictions. If input text exceeds this length, it must be truncated.

## Objective Function of Tokenization

Tokenization is often optimized with the following objective in mind:

```
Minimize   Σ Tokens(Sentenceᵢ)   for i = 1 to N
Subject to VocabularySize ≤ V
```

This means the goal is to represent text using the fewest possible tokens while staying within a predefined vocabulary size. Why is this important?

*   **Faster Inference:** Fewer tokens mean less processing for the model.
*   **Lower Compute Cost:** Each token processed incurs a computational cost.
*   **Larger Effective Context Window:** By using fewer tokens to represent the same amount of information, more information can fit within the model's fixed maximum context length (L).