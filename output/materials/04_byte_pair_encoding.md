# Byte Pair Encoding (BPE)

Byte Pair Encoding (BPE) is one of the most widely used and influential sub-word tokenization algorithms. It's employed in many prominent LLMs, including OpenAI's GPT-3.

## BPE Process

BPE works by iteratively merging the most frequent adjacent pairs of characters or character sequences in a given text corpus. The process is as follows:

1.  **Initialize Vocabulary:** Start with a vocabulary containing all unique characters present in the training corpus.
2.  **Iterative Merging:** Repeatedly identify the most frequently occurring adjacent pair of tokens (characters or existing merged subwords) in the corpus.
3.  **Create New Token:** Merge this most frequent pair into a new, single token.
4.  **Add to Vocabulary:** Add the new merged token to the vocabulary.
5.  **Repeat:** Continue steps 2-4 until a desired vocabulary size is reached, or no more merges meet a predefined frequency threshold.

## BPE Example Walkthrough

Let's consider a simplified corpus to illustrate the BPE process:

Initial corpus (with frequencies):
- `lower` (5 occurrences)
- `newest` (2 occurrences)
- `widest` (3 occurrences)

1.  **Initial Characters:** `l`, `o`, `w`, `e`, `r`, `n`, `s`, `t`, `i`, `d`

2.  **Identify Most Frequent Pair:** In our simplified example, let's say the pair `e` followed by `s` (`es`) is the most frequent adjacent pair across the corpus.

3.  **First Merge:** Merge `e` + `s` → `es` (add `es` to vocabulary)

4.  **New Corpus Representation:** Words like `newest` and `widest` would now internally contain the `es` token.

5.  **Identify Next Most Frequent Pair:** Now, perhaps `e` followed by `st` (`est`) becomes the most frequent (because `es` is now a single token, and `t` frequently follows `es`).

6.  **Second Merge:** Merge `es` + `t` → `est` (add `est` to vocabulary)

### Tokenizing "lowering" with BPE

Let's assume our BPE tokenizer has learned subwords like `er`, `ing`, etc. When tokenizing the word "lowering", it would break it down using the largest known subwords from its vocabulary:

`lowering` → `['l', 'o', 'w', 'er', 'i', 'n', 'g']`

Notice how `er` is a single token, rather than `e` and `r` separately. This is because `er` would have been identified as a frequent pair and merged during the BPE training process.