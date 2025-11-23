# The Power of Sub-Word Tokenization

Traditional tokenization might split text purely by words or characters. However, a highly effective approach, especially for LLMs, is **sub-word tokenization**. Subword tokenizers break text into pieces smaller than a word but typically larger than a single character.

This method offers significant advantages:

*   **Handling Inflections:** It can gracefully manage different forms of a word (e.g., `learn`, `learning`, `learned` might share a common `learn` token, reducing the vocabulary burden).
*   **Composite Words:** It effectively breaks down compound words into their constituent parts (e.g., `microprocessor` → `micro`, `processor`), allowing the model to understand the meaning of the components.
*   **Improved OOV Handling:** As mentioned previously, breaking down unknown words into known subword units significantly enhances the model's ability to process rare or completely new vocabulary (e.g., `Kubernetes` → `Kuber`, `net`, `es`). This drastically reduces the number of truly Out-of-Vocabulary (OOV) words the model might encounter.