# Introduction to Retrieval-Augmented Generation (RAG)

Retrieval-Augmented Generation (RAG) significantly enhances the factual accuracy and real-time relevance of Large Language Models (LLMs) by allowing them to access external knowledge sources during inference.

## Motivation: Bridging Memorization and Generalization

LLMs inherently rely on two primary types of knowledge:

### Memorization (Internal / Parametric Memory)

*   **Source:** Learned from pretraining data.
*   **Strength:** Excellent for general knowledge and reasoning tasks.
*   **Limitation:** It is **static** and cannot be updated post‑training. This makes it prone to becoming outdated quickly.

### Generalization (Need for External Knowledge)

LLMs often struggle with or *hallucinate* (generate factually incorrect information) when confronted with questions related to:

*   Private enterprise data (e.g., internal policies, specific product details).
*   Highly domain‑specific knowledge (e.g., niche scientific fields, proprietary technical specifications).
*   New real‑world information that emerged after their last training cut-off.

**RAG directly addresses these limitations by retrieving up-to-date external documents and dynamically injecting them into the LLM's prompt, providing it with relevant context to generate grounded and accurate responses.**