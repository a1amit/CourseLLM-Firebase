# Byte Pair Encoding (BPE)

Byte Pair Encoding (BPE) is one of the most widely used subword tokenization algorithms, famously employed in models like OpenAI's GPT-3, GPT-4, and others. It is an iterative algorithm that starts with a base vocabulary of individual characters and progressively merges the most frequent adjacent pairs of characters or character sequences to form new tokens.

## BPE Process

The BPE algorithm typically follows these steps:

1.  **Initialize Vocabulary:** Start with a base vocabulary consisting of all unique individual characters present in the training corpus.
2.  **Count Pair Frequencies:** Identify all adjacent pairs of tokens in the corpus and count their frequencies.
3.  **Merge Most Frequent Pair:** Identify the most frequently occurring adjacent pair of tokens. Create a new token by merging these two tokens into a single unit.
4.  **Update Corpus and Vocabulary:** Replace all occurrences of the merged pair in the corpus with the new, single token. Add the new token to the vocabulary.
5.  **Repeat:** Go back to step 2 and repeat the process until the desired vocabulary size is reached or no more pairs can be merged.

## BPE Example

Let's illustrate with a simplified example. Consider an initial corpus where words appear with these counts:

*   `lower` (5 times)
*   `newest` (2 times)
*   `widest` (3 times)

Initial character vocabulary: `[l, o, w, e, r, n, s, t, i, d]`

**Step 1: Initial pairs and counts (simplified)**

Frequent pairs might include `es`, `er`, `st`, etc.

**Step 2: Merge `e` + `s` → `es`** (Assuming `es` is the most frequent pair)

Now, wherever `es` appeared, it's replaced by the new token `es`.

**Step 3: Merge `e` + `st` → `est`** (Assuming `est` becomes the most frequent after the previous merge)

The process continues. For a word like `lowering`, here's how it might be tokenized after a series of merges:

`lowering` → `['l', 'o', 'w', 'er', 'i', 'n', 'g']`

Notice how `er` has been merged into a single token, as it's a common subword unit, while `low` and `ing` might remain as individual characters or further merge into other subword units depending on the full vocabulary learned.