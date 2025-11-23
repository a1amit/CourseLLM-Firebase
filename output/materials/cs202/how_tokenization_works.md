# The Mechanics of Tokenization

A tokenizer is fundamentally a function that maps a text string to a list of integers. This process converts human-readable text into a numerical representation that an LLM can understand and process.

## Key Parameters of a Tokenizer

### Vocabulary Size (V)
The number of unique tokens the model can recognize. This is a crucial design choice, typically ranging from 30,000 to over 100,000 tokens. A larger vocabulary can capture more specific meanings but requires more computational resources.

### Maximum Context Length (L)
The maximum number of tokens the model can process at once. This defines the 'window' of text the LLM can consider when generating or understanding text. Common context lengths can range from a few hundred to tens of thousands of tokens.

## Objective Function

The goal of an efficient tokenization scheme is often summarized by an objective function:

`Minimize Σ Tokens(Sentenceᵢ) for i = 1 to N`
`Subject to VocabularySize ≤ V`

In simpler terms, tokenization aims to represent text using the fewest possible tokens while staying within a fixed vocabulary size. Shorter sequences of tokens lead to several benefits:
*   **Faster Inference:** Fewer tokens mean less computation during prediction.
*   **Lower Compute Cost:** Reduced resource usage for both training and inference.
*   **Larger Effective Context Window:** Since the context length is measured in tokens, shorter token sequences for the same semantic content allow the model to process more actual information within its fixed token limit.