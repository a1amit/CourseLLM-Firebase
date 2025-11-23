# Byte Pair Encoding (BPE)

Byte Pair Encoding (BPE) is one of the most widely used subword tokenization algorithms in modern Large Language Models, notably employed in models like GPT-3. It's an unsupervised data compression technique adapted for text tokenization.

## How BPE Works

The BPE algorithm is relatively straightforward and works by iteratively merging the most frequent adjacent pairs of characters or character sequences in a training corpus.

### BPE Process

1.  **Initialization**: Start by considering every unique character in your corpus as an initial 'token'. Each word is represented as a sequence of these characters.
2.  **Iteration**: Repeatedly find the most frequent adjacent pair of tokens (whether individual characters or previously merged subwords) in the entire corpus.
3.  **Merge**: Create a new token representing this frequent pair. Replace all occurrences of the pair with this new, merged token.
4.  **Stopping Condition**: Continue merging until a desired vocabulary size is reached, or no more pairs can be found that meet a certain frequency threshold.

This process builds a vocabulary of subword units, ranging from individual characters to common words or word parts, optimized for the specific language and domain of the training corpus.

### Example Walkthrough

Let's illustrate with a small example. Suppose we have the following initial corpus and their counts:

*   `lower` (5 occurrences)
*   `newest` (2 occurrences)
*   `widest` (3 occurrences)

Initially, our vocabulary would consist of individual characters: `l, o, w, e, r, n, s, t, i, d`. Each word would be represented as a sequence of these characters, e.g., `l o w e r`.

1.  **First Merge**: Identify the most frequent adjacent pair. Let's say `e` + `s` is the most frequent. We merge them into `es`.
    Now, `new`**`es`**`t` and `wid`**`es`**`t` become `new` `es` `t` and `wid` `es` `t`.

2.  **Second Merge**: After updating, perhaps `e` + `st` (from `new` + `es` + `t` and `wid` + `es` + `t`) becomes the most frequent pair. We merge them into `est`.
    Now, `new` `est` and `wid` `est`.

This process continues until the desired vocabulary size is reached. The resulting vocabulary would contain individual characters and these newly created subword units (`es`, `est`).

### Tokenizing an Unseen Word (or common word)

Let's see how the word `lowering` might be tokenized with a learned BPE vocabulary that includes `er` as a common subword unit:

`lowering` → `['l', 'o', 'w', 'er', 'i', 'n', 'g']`

Notice how `er` is treated as a single token because it was likely a frequent pair found during training. The rest are individual characters or other subword units that were also learned. This demonstrates how BPE intelligently segments words into meaningful and frequent parts.