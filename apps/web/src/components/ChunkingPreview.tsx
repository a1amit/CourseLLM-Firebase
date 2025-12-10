"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SAMPLE_ML, SAMPLE_ARCHITECTURE } from "./samples";

interface Chunk {
    index: number;
    content: string;
    token_count: number;
    start_index?: number;
    end_index?: number;
    embedding?: number[];
    embedding_dim?: number;
}

interface ChunkResponse {
    chunks: Chunk[];
}

export default function ChunkingPreview() {
    const [markdown, setMarkdown] = useState<string>("");
    const [chunks, setChunks] = useState<Chunk[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Chunking parameters
    const [strategy, setStrategy] = useState<string>("recursive");
    const [chunkSize, setChunkSize] = useState<number>(512);
    const [tokenizer, setTokenizer] = useState<string>("gpt2");
    const [generateEmbeddings, setGenerateEmbeddings] = useState<boolean>(false);
    const [embeddingProvider, setEmbeddingProvider] = useState<string>("sentence-transformers");
    const [embeddingModel, setEmbeddingModel] = useState<string>("all-MiniLM-L6-v2");

    const handleChunk = async () => {
        if (!markdown.trim()) {
            setError("Please enter some markdown text");
            return;
        }

        setLoading(true);
        setError(null);
        setChunks([]);

        try {
            // Get API URL from environment or default to localhost
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

            const response = await fetch(`${apiUrl}/v1/chunk`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // TODO: Add authentication when ready
                },
                body: JSON.stringify({
                    markdown,
                    strategy,
                    max_chunk_size: chunkSize,
                    tokenizer,
                    generate_embeddings: generateEmbeddings,
                    embedding_provider: embeddingProvider,
                    embedding_model: embeddingModel,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.detail || `API Error: ${response.statusText}`;
                throw new Error(errorMessage);
            }

            const data: ChunkResponse = await response.json();
            setChunks(data.chunks);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    const loadSample = (sampleNum: number) => {
        if (sampleNum === 1) {
            setMarkdown(SAMPLE_ML);
        } else if (sampleNum === 2) {
            setMarkdown(SAMPLE_ARCHITECTURE);
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Chunking Preview Tool</CardTitle>
                    <CardDescription>
                        Test the Chonkie-based chunking implementation. Paste markdown text and see how it gets chunked.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Configuration */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="strategy">Strategy</Label>
                            <Select value={strategy} onValueChange={setStrategy}>
                                <SelectTrigger id="strategy">
                                    <SelectValue placeholder="Select strategy" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recursive">Recursive</SelectItem>
                                    <SelectItem value="semantic">Semantic</SelectItem>
                                    <SelectItem value="token">Token</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="chunkSize">Chunk Size (tokens)</Label>
                            <input
                                id="chunkSize"
                                type="number"
                                value={chunkSize}
                                onChange={(e) => setChunkSize(Number(e.target.value))}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                min={128}
                                max={2048}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tokenizer">Tokenizer</Label>
                            <Select value={tokenizer} onValueChange={setTokenizer}>
                                <SelectTrigger id="tokenizer">
                                    <SelectValue placeholder="Select tokenizer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="gpt2">GPT-2</SelectItem>
                                    <SelectItem value="o200k_base">GPT-4o</SelectItem>
                                    <SelectItem value="cl100k_base">GPT-4</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Embedding Option */}
                    <div className="flex items-center space-x-2 pt-2">
                        <input
                            id="embeddings"
                            type="checkbox"
                            checked={generateEmbeddings}
                            onChange={(e) => setGenerateEmbeddings(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="embeddings" className="cursor-pointer">
                            Generate embeddings
                        </Label>
                    </div>

                    {/* Provider Selection (shown when embeddings enabled) */}
                    {generateEmbeddings && (
                        <div className="space-y-2 pl-6">
                            <Label htmlFor="provider">Embedding Provider</Label>
                            <Select value={embeddingProvider} onValueChange={setEmbeddingProvider}>
                                <SelectTrigger id="provider">
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sentence-transformers">
                                        Sentence Transformers (Local, 384-768D)
                                    </SelectItem>
                                    <SelectItem value="vertex-ai">
                                        Vertex AI (Cloud, 768D)
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Model Selection for Sentence Transformers */}
                            {embeddingProvider === "sentence-transformers" && (
                                <div className="space-y-2 pt-2">
                                    <Label htmlFor="embeddingModel">Model</Label>
                                    <Select value={embeddingModel} onValueChange={setEmbeddingModel}>
                                        <SelectTrigger id="embeddingModel">
                                            <SelectValue placeholder="Select model" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all-MiniLM-L6-v2">
                                                all-MiniLM-L6-v2 (384D, ⚡ Fastest)
                                            </SelectItem>
                                            <SelectItem value="all-mpnet-base-v2">
                                                all-mpnet-base-v2 (768D, 🎯 Balanced)
                                            </SelectItem>
                                            <SelectItem value="BAAI/bge-large-en-v1.5">
                                                bge-large-en-v1.5 (1024D, 🏆 Top Quality)
                                            </SelectItem>
                                            <SelectItem value="dunzhang/stella_en_1.5B_v5">
                                                stella_en_1.5B_v5 (1024D, 🚀 Best Overall)
                                            </SelectItem>
                                            <SelectItem value="multi-qa-mpnet-base-dot-v1">
                                                multi-qa-mpnet (768D, 💬 Q&A Optimized)
                                            </SelectItem>
                                            <SelectItem value="paraphrase-multilingual-MiniLM-L12-v2">
                                                multilingual-MiniLM (384D, 🌍 Multilingual)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-muted-foreground">
                                        {embeddingModel === "all-MiniLM-L6-v2" && "⚡ Fastest, great for development"}
                                        {embeddingModel === "all-mpnet-base-v2" && "🎯 Best balance of speed and quality"}
                                        {embeddingModel === "BAAI/bge-large-en-v1.5" && "🏆 Top MTEB performer, high quality"}
                                        {embeddingModel === "dunzhang/stella_en_1.5B_v5" && "🚀 Best overall MTEB score 2024"}
                                        {embeddingModel === "multi-qa-mpnet-base-dot-v1" && "💬 Optimized for Q&A and RAG"}
                                        {embeddingModel === "paraphrase-multilingual-MiniLM-L12-v2" && "🌍 Supports 50+ languages"}
                                    </p>
                                </div>
                            )}

                            <p className="text-xs text-muted-foreground">
                                {embeddingProvider === "vertex-ai"
                                    ? "⚠️ Requires Google Cloud credentials configured"
                                    : "✅ Runs locally, downloads model automatically (~80-1500MB)"
                                }
                            </p>
                        </div>
                    )}

                    <Separator />

                    {/* Input */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="markdown">Markdown Input</Label>
                            <div className="flex gap-2 items-center">
                                <Label htmlFor="sampleSelect" className="text-sm text-muted-foreground">Load Sample:</Label>
                                <Select onValueChange={(value) => loadSample(parseInt(value))}>
                                    <SelectTrigger id="sampleSelect" className="w-[200px]">
                                        <SelectValue placeholder="Choose sample..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">ML Introduction</SelectItem>
                                        <SelectItem value="2">App Architecture</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Textarea
                            id="markdown"
                            placeholder="Paste your markdown here..."
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            rows={12}
                            className="font-mono text-sm"
                        />
                    </div>

                    {/* Action Button */}
                    <Button
                        onClick={handleChunk}
                        disabled={loading || !markdown.trim()}
                        className="w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Chunking...
                            </>
                        ) : (
                            "Chunk It!"
                        )}
                    </Button>

                    {/* Error Display */}
                    {error && (
                        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
                            <p className="font-semibold">Error:</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Results */}
            {chunks.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Chunks ({chunks.length})</CardTitle>
                        <CardDescription>
                            Total of {chunks.reduce((sum, c) => sum + c.token_count, 0)} tokens across {chunks.length} chunks
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {chunks.map((chunk) => (
                            <div
                                key={chunk.index}
                                className="p-4 border rounded-lg bg-muted/30 space-y-2"
                            >
                                <div className="flex items-center justify-between">
                                    <Badge variant="secondary">Chunk #{chunk.index + 1}</Badge>
                                    <div className="flex gap-2">
                                        <Badge variant="outline">{chunk.token_count} tokens</Badge>
                                        {chunk.embedding_dim && (
                                            <Badge variant="default" className="bg-green-600">
                                                {chunk.embedding_dim}D embedding
                                            </Badge>
                                        )}
                                        {chunk.start_index !== undefined && chunk.end_index !== undefined && (
                                            <Badge variant="outline">
                                                chars {chunk.start_index}-{chunk.end_index}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <pre className="whitespace-pre-wrap text-sm font-mono bg-background p-3 rounded border">
                                    {chunk.content}
                                </pre>

                                {/* Embedding Vector Display */}
                                {chunk.embedding && chunk.embedding.length > 0 && (
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                                            📊 View Embedding Vector ({chunk.embedding.length} dimensions)
                                        </summary>
                                        <div className="mt-2 p-3 bg-muted/50 rounded border text-xs font-mono max-h-40 overflow-y-auto">
                                            <div className="text-xs text-muted-foreground mb-1">First 10 values:</div>
                                            <div className="grid grid-cols-5 gap-2">
                                                {chunk.embedding.slice(0, 10).map((val, idx) => (
                                                    <div key={idx} className="text-right">
                                                        {val.toFixed(4)}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                                                ... and {chunk.embedding.length - 10} more values
                                            </div>
                                        </div>
                                    </details>
                                )}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
