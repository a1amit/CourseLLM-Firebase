# Why Tokenization is Essential for LLMs

The core problem for an LLM is that its vocabulary (the set of all tokens it knows) is fixed. Tokenization solves several challenges crucial for an LLM's functionality and efficiency.

## Purposes of Tokenization

### 1. Numerical Conversion
LLMs process numerical vectors. Tokens convert unstructured text into a sequence of discrete integers (IDs), which can then be mapped to embedding vectors for mathematical processing. This transformation is vital because neural networks, at their core, operate on numbers.

### 2. Vocabulary Management
A purely word-based vocabulary would require hundreds of thousands of entries to cover all words, names, and variations across a language (or multiple languages). Tokenization keeps vocabulary size manageable---typically between 30,000 to 100,000+ unique tokens---which is essential for model training efficiency and memory usage.

### 3. Handling Out-of-Vocabulary (OOV) Words
By breaking words into subword units, the model can represent new or rare words even if it never saw them during training. For example, a word like `untokenizeable` might be broken down into `un`, `token`, `ize`, `able`. This prevents the model from encountering completely unknown words, making it more robust.