# The Need and Purpose of Tokenization

## Why Tokenization is Essential

The core problem for an LLM is that its vocabulary (the set of all tokens it knows) is fixed and finite. Tokenization solves several fundamental challenges to bridge the gap between human language and an LLM's fixed vocabulary and numerical processing capabilities.

### Purposes of Tokenization

**1. Numerical Conversion**
LLMs process numerical vectors. Tokens convert unstructured text into a sequence of discrete integers (IDs), which can then be mapped to embedding vectors for mathematical processing. This is a crucial step in transforming human-readable text into a format an algorithm can understand and manipulate.

**2. Vocabulary Management**
A purely word-based vocabulary would require hundreds of thousands of entries to cover all words, names, and variations across a language (or multiple languages). This would lead to an excessively large and inefficient model. Tokenization keeps vocabulary size manageable (typically 30,000-100,000+ unique tokens) by using subword units, which allows for broader coverage with fewer unique entries.

**3. Handling Out-of-Vocabulary (OOV) Words**
By breaking words into subword units, the model can represent new, rare, or complex words like `untokenizeable` even if it never saw the full word during training. For instance, `untokenizeable` might be broken into `un`, `token`, `ize`, `able`, all of which are common subword units. This significantly improves the model's robustness to unseen data.