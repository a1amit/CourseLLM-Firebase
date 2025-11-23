# Why LLMs Need Tokenization

## The Core Challenge: Fixed Vocabulary

The fundamental problem for an LLM is that its vocabulary – the set of all tokens it knows and understands – is fixed. It cannot magically learn new words or concepts on the fly. Tokenization is essential because it solves several key challenges that arise from this fixed vocabulary constraint.

## Purposes of Tokenization

Tokenization serves multiple vital functions:

### 1. Numerical Conversion for Machine Processing

LLMs, like all computer systems, process numerical vectors, not text directly. Tokens convert unstructured, human-readable text into a sequence of discrete integers (IDs). Each token corresponds to a unique ID in the model's vocabulary. These IDs can then be mapped to embedding vectors, which are numerical representations that the LLM can use for all its mathematical computations and predictions.

### 2. Efficient Vocabulary Management

If an LLM tried to process raw words, its vocabulary would be impossibly vast. Consider the sheer number of possible words, including plurals, verb conjugations, proper nouns, abbreviations, and even words across multiple languages. A purely word-based vocabulary would require hundreds of thousands, if not millions, of entries, making the model unwieldy and inefficient. Tokenization allows for a much more manageable vocabulary size, often ranging from tens of thousands to over a hundred thousand, even while covering a vast range of linguistic expressions and multiple languages.

### 3. Handling Out-of-Vocabulary (OOV) Words

Even with an extensive vocabulary, it's impossible to predict every single word a model might encounter in real-world text. New words are constantly being invented, and rare words exist. By breaking words into **subword units** (pieces smaller than a full word but larger than a single character), the model can intelligently represent new or rare words, even if it never saw the full word during training. For example, a word like `untokenizeable` might not be in the vocabulary, but its subwords like `un`, `token`, `ize`, `able` might be, allowing the model to 