# Byte Pair Encoding (BPE)

Byte Pair Encoding (BPE) is one of the most widely used and influential subword tokenization algorithms, adopted by prominent models like GPT-3, LLaMA, and many others. It's an unsupervised data compression technique adapted for text tokenization.

## The BPE Process

BPE works by iteratively merging the most frequent adjacent characters or character sequences in a training corpus. The process typically involves these steps:

1.  **Initialization:** Start with a vocabulary that contains all unique characters present in the training text. Each character is initially a token.
2.  **Iterative Merging:** Repeatedly identify the most frequent **adjacent pair** of tokens in the training corpus. Once identified, this pair is merged into a new, single token. This new token is added to the vocabulary.
3.  **Stopping Condition:** Continue this merging process until a desired vocabulary size (`V`) is reached, or until no more pairs meet a certain frequency threshold. The choice of `V` is a key hyperparameter, balancing vocabulary coverage with token sequence length.

This greedy approach ensures that the most common linguistic patterns (like `_ing`, `_ed`, `un_`, `_tion`) are learned and represented as single tokens, leading to more compact and meaningful token sequences.

## BPE Example Walkthrough

Let's consider a simplified corpus to illustrate the BPE merging process.

**Initial Corpus and Frequencies:**
*   `lower` (occurs 5 times)
*   `newest` (occurs 2 times)
*   `widest` (occurs 3 times)

**Initial Vocabulary (all unique characters):** `['l', 'o', 'w', 'e', 'r', 'n', 's', 't', 'i', 'd']`

**Step 1:** Identify the most frequent adjacent pair.

    The pair `e` + `s` appears in `newest` (once) and `widest` (once). No, `es` appears once in `newest` and once in `widest`. But `st` also appears once in `newest` and once in `widest`. Let's assume `es` is picked first or is more frequent in a larger context.

    *Hypothetical Merge:* Merge `e` + `s` → `es`
    *New token added to vocabulary:* `es`

**Step 2:** Update corpus and find next most frequent pair.

    Now `newes` `t` and `wide` `st`. The pair `st` appears in `newest` and `widest`. Let's assume `st` is now the most frequent.

    *Hypothetical Merge:* Merge `e` + `st` (from `new**est**`, `wid**est**`) → `est`
    *New token added to vocabulary:* `est`

This process continues until the vocabulary size limit is reached. Common words or word parts eventually become single tokens.

## Tokenizing 