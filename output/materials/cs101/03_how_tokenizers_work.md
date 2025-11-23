# How Tokenizers Work: Parameters and Objectives

A **tokenizer** is essentially a function that takes a raw text string as input and maps it to a list of integers (token IDs). This conversion is fundamental for an LLM to process and understand the text.

`text_string -> [integer_id_1, integer_id_2, ..., integer_id_N]`

## Key Parameters of a Tokenizer

When designing or working with tokenizers, two crucial parameters define their capabilities and limitations:

### Vocabulary Size (V)

This is the total number of unique tokens the model can recognize. It's the size of the mapping from token IDs back to human-readable strings. Typical vocabulary sizes for modern LLMs range from 30,000 to over 100,000 unique tokens. A larger vocabulary can represent more concepts directly, but also increases model complexity and memory requirements.

### Maximum Context Length (L)

This parameter defines the maximum number of tokens the model can process at once in a single input sequence. If an input text exceeds this length after tokenization, it must be truncated. For example, a model might have a context length of 2048 or 4096 tokens, meaning it can only 