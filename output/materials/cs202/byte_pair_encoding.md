# Byte Pair Encoding (BPE) in Detail

Byte Pair Encoding (BPE) is one of the most widely used sub-word tokenization algorithms, famously employed in models like OpenAI's GPT-3.

## BPE Process

BPE works by iteratively merging the most frequent adjacent pairs of characters or character sequences in a given text corpus. The process typically involves these steps:

1.  **Initialize:** Start with all unique characters in the corpus as the initial vocabulary.
2.  **Iterative Merging:** Repeatedly identify and merge the most frequent adjacent pair of characters or subword units in the corpus into a new single unit.
3.  **Vocabulary Expansion:** Add the newly merged unit to the vocabulary.
4.  **Stop Condition:** Continue this process until the desired vocabulary size is reached or no more merges meet a frequency threshold.

## Example Walkthrough

Consider a simplified initial corpus:
*   `lower` (5 occurrences)
*   `newest` (2 occurrences)
*   `widest` (3 occurrences)

Let's trace some hypothetical merges:
*   Initial unique characters: `l`, `o`, `w`, `e`, `r`, `n`, `s`, `t`, `i`, `d`
*   If `e` and `s` is the most frequent adjacent pair across the corpus, they are merged into `es`.
*   The vocabulary now includes `es`.
*   If `e` and `st` (from previous merges or high frequency) is the next most frequent pair, they merge into `est`.
*   The vocabulary now includes `est`.

## Tokenizing "lowering" with BPE

If our BPE vocabulary includes tokens like `l`, `o`, `w`, `er`, `i`, `n`, `g` (where `er` was a learned subword token from frequent pairs), the word `lowering` would be tokenized as:

`lowering` → `['l', 'o', 'w', 'er', 'i', 'n', 'g']`

Notice how `er` is treated as a single token, even though it's part of a larger word. This demonstrates BPE's ability to compress common sequences while still allowing for fine-grained representation.