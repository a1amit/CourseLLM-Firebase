$body = @{
    markdown = "# Machine Learning\n\nMachine learning is AI that learns from data.\n\n## Supervised Learning\n\nSupervised learning uses labeled data."
    extract_topics = $true
    rank_content = $true
    document_title = "ML Intro"
} | ConvertTo-Json

Write-Host "Testing Enhanced Chunker API..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/v1/chunk" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "SUCCESS! Received $($response.chunks.Count) chunks" -ForegroundColor Green
    
    foreach ($chunk in $response.chunks) {
        Write-Host "=== Chunk $($chunk.index + 1) ===" -ForegroundColor Yellow
        Write-Host "Topics: $($chunk.topics -join ', ')" -ForegroundColor Magenta
        Write-Host "Rank: $($chunk.rank)" -ForegroundColor Cyan
        
        if ($chunk.metadata) {
            Write-Host "Metadata: $($chunk.metadata | ConvertTo-Json -Compress)" -ForegroundColor Gray
            if ($chunk.metadata.topic_source) {
                 Write-Host "Topic Source: $($chunk.metadata.topic_source)" -ForegroundColor White -BackgroundColor Blue
            } else {
                 Write-Host "⚠️ Missing topic_source in metadata" -ForegroundColor Red
            }
        } else {
            Write-Host "⚠️ No metadata found" -ForegroundColor Red
        }
        Write-Host ""
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Details: $($reader.ReadToEnd())" -ForegroundColor Red
    }
}
