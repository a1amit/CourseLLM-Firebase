$body = @{
    markdown = "# Machine Learning\n\nMachine learning is AI that learns from data.\n\n## Supervised Learning\n\nSupervised learning uses labeled data. Algorithms include neural networks and decision trees."
    extract_topics = $true
    rank_content = $true
    document_title = "Machine Learning"
} | ConvertTo-Json

Write-Host "Testing Enhanced Chunker API..." -ForegroundColor Cyan
Write-Host ""

$response = Invoke-RestMethod -Uri "http://localhost:8000/v1/chunk" -Method Post -Body $body -ContentType "application/json"

Write-Host "SUCCESS! Received $($response.chunks.Count) chunks" -ForegroundColor Green
Write-Host ""

foreach ($chunk in $response.chunks) {
    Write-Host "=== Chunk $($chunk.index + 1) ===" -ForegroundColor Yellow
    Write-Host "Content: $($chunk.content.Substring(0, [Math]::Min(80, $chunk.content.Length)))..."
    Write-Host "Tokens: $($chunk.token_count)"
    Write-Host "Topics: $($chunk.topics -join ', ')" -ForegroundColor Magenta
    Write-Host "Rank: $([math]::Round($chunk.rank, 2))/100" -ForegroundColor Cyan
    Write-Host ""
}
