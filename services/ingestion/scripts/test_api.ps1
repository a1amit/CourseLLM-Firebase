$body = @{
    markdown = @"
# Machine Learning Fundamentals

## Introduction

Machine learning is a subset of artificial intelligence that enables computers to learn from data.

## Supervised Learning

Supervised learning uses labeled data to train models. Common algorithms include:
- Linear Regression
- Neural Networks
- Decision Trees

## Deep Learning

Deep learning uses multi-layer neural networks for complex tasks like image recognition and natural language processing.
"@
    extract_topics = $true
    rank_content = $true
    document_title = "Machine Learning Fundamentals"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/v1/chunk" -Method Post -Body $body -ContentType "application/json"
