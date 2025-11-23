# Introduction to Tokenization

## What is Tokenization?
Tokenization is the critical first step in a Large Language Model's (LLM) workflow. It involves breaking raw text into smaller, meaningful units called **tokens**. The LLM operates exclusively on these tokens---not on raw characters or words themselves.

## The Need for Tokenization
The core problem for an LLM is that its vocabulary (the set of all tokens it knows) is fixed. Tokenization solves several challenges:

### Purposes of Tokenization

**1. Numerical Conversion**
LLMs process numerical vectors. Tokens convert unstructured text into a sequence of discrete integers (IDs), which can then be mapped to embedding vectors for mathematical processing. This is fundamental because computers understand numbers, not raw text.

**2. Vocabulary Management**
A purely word-based vocabulary would require hundreds of thousands of entries to cover all words, names, and variations, especially across multiple languages. Tokenization keeps vocabulary size manageable, making models more efficient to train and use.

**3. Handling Out-of-Vocabulary (OOV) Words**
By breaking words into subword units (e.g., `untokenizeable` becomes `un`, `token`, `ize`, `able`), the model can represent new or rare words even if it never saw the full word during training. This significantly improves a model's robustness and generalization capabilities.