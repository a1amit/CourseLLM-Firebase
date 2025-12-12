"use client";

import { useCallback, useMemo, useState } from "react";
import { SAMPLE_ARCHITECTURE, SAMPLE_ML, SAMPLE_PRD } from "@/components/samples";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

type ChunkOut = {
  index: number;
  text: string;
  token_count?: number | null;
  section_index?: number | null;
  section_path?: string | null;
  embedding?: number[] | null;
  topics?: string[] | null;
  topic_source?: string | null;
  rank?: number | null;
};

type ChunkResponse = {
  chunk_count: number;
  chunks: ChunkOut[];
  warnings?: string[] | null;
};

type TopicSearchResponse = {
  total_results: number;
  chunks: ChunkOut[];
};

const DEFAULT_URL =
  process.env.NEXT_PUBLIC_INGESTION_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8000";

type Preset = "ml" | "architecture" | "prd" | "custom";

type EmbeddingProvider = "sentence-transformers" | "openai" | "openrouter" | "mock";

type TopicModel = "gemini-2.5-flash-lite" | "heuristic";

const ST_MODELS: Array<{ label: string; value: string }> = [
  {
    label: "sentence-transformers/all-MiniLM-L6-v2 (384d)",
    value: "sentence-transformers/all-MiniLM-L6-v2",
  },
  {
    label: "sentence-transformers/all-mpnet-base-v2 (768d)",
    value: "sentence-transformers/all-mpnet-base-v2",
  },
];

const OPENAI_MODELS: Array<{ label: string; value: string }> = [
  { label: "text-embedding-3-small", value: "text-embedding-3-small" },
  { label: "text-embedding-3-large", value: "text-embedding-3-large" },
];

const OPENROUTER_MODELS: Array<{ label: string; value: string }> = [
  { label: "openai/text-embedding-3-small", value: "openai/text-embedding-3-small" },
  { label: "openai/text-embedding-3-large", value: "openai/text-embedding-3-large" },
];

function defaultModelFor(provider: EmbeddingProvider): string {
  switch (provider) {
    case "sentence-transformers":
      return "sentence-transformers/all-MiniLM-L6-v2";
    case "openai":
      return "text-embedding-3-small";
    case "openrouter":
      return "openai/text-embedding-3-small";
    case "mock":
    default:
      return "__none__";
  }
}

function formatEmbeddingPreview(values: number[], count = 6): string {
  const shown = values
    .slice(0, Math.max(0, count))
    .map((v) => (Number.isFinite(v) ? v.toFixed(4) : String(v)));
  const hasMore = values.length > count;
  return `[${shown.join(", ")}${hasMore ? ", …" : ""}]`;
}

function formatEmbeddingAll(values: number[], perLine = 8): string {
  const safePerLine = Math.max(1, perLine);
  const lines: string[] = ["["];
  for (let i = 0; i < values.length; i += safePerLine) {
    const slice = values
      .slice(i, i + safePerLine)
      .map((v) => (Number.isFinite(v) ? v.toFixed(6) : String(v)))
      .join(", ");
    const trailing = i + safePerLine < values.length ? "," : "";
    lines.push(`  ${slice}${trailing}`);
  }
  lines.push("]");
  return lines.join("\n");
}

function normalizeTopic(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function topicMatchesQuery(topic: string, queryTopics: string[]): boolean {
  const t = normalizeTopic(topic);
  if (!t) return false;
  for (const qRaw of queryTopics) {
    const q = normalizeTopic(qRaw);
    if (!q) continue;
    if (t === q) return true;
    if (t.includes(q) || q.includes(t)) return true;
  }
  return false;
}

export default function ChunkingPreview() {
  const { toast } = useToast();

  const [preset, setPreset] = useState<Preset>("architecture");
  const [text, setText] = useState<string>(SAMPLE_ARCHITECTURE);
  const [chunkSize, setChunkSize] = useState<number>(450);
  const [overlapSize, setOverlapSize] = useState<number>(80);

  const [includeTopics, setIncludeTopics] = useState<boolean>(true);
  const [topicModel, setTopicModel] = useState<TopicModel>("gemini-2.5-flash-lite");
  const [maxTopics, setMaxTopics] = useState<number>(8);

  const [includeEmbeddings, setIncludeEmbeddings] = useState<boolean>(true);
  const [embeddingProvider, setEmbeddingProvider] = useState<EmbeddingProvider>("sentence-transformers");
  const [embeddingModel, setEmbeddingModel] = useState<string>(defaultModelFor("sentence-transformers"));
  const [embeddingModelIsCustom, setEmbeddingModelIsCustom] = useState<boolean>(false);

  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ChunkResponse | null>(null);
  const [openEmbeddings, setOpenEmbeddings] = useState<Record<number, boolean>>({});

  const [topicQuery, setTopicQuery] = useState<string>("");
  const [topicMatch, setTopicMatch] = useState<"any" | "all">("any");
  const [topicMinRank, setTopicMinRank] = useState<string>("");
  const [topicLimit, setTopicLimit] = useState<number>(25);
  const [isSearchingTopics, setIsSearchingTopics] = useState<boolean>(false);
  const [topicSearchResult, setTopicSearchResult] = useState<TopicSearchResponse | null>(null);

  const topicQueryTerms = useMemo(
    () =>
      topicQuery
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
    [topicQuery]
  );

  const onPresetChange = useCallback((value: string) => {
    const next = value as Preset;
    setPreset(next);
    if (next === "ml") setText(SAMPLE_ML);
    if (next === "architecture") setText(SAMPLE_ARCHITECTURE);
    if (next === "prd") setText(SAMPLE_PRD);
    if (next === "custom") setText("");
    setResult(null);
    setTopicSearchResult(null);
  }, []);

  const runChunking = useCallback(async () => {
    setIsRunning(true);
    setResult(null);
    setOpenEmbeddings({});
    setTopicSearchResult(null);

    try {
      const url = `${DEFAULT_URL.replace(/\/$/, "")}/chunk`;

      const payload: Record<string, unknown> = {
        text,
        chunk_size: chunkSize,
        overlap_size: overlapSize,
        include_section_path: true,
        include_embeddings: includeEmbeddings,
        include_topics: includeTopics,
      };

      if (includeTopics) {
        payload.topic_model = topicModel;
        payload.max_topics = maxTopics;
      }

      if (includeEmbeddings) {
        payload.embedding_provider = embeddingProvider;
        if (embeddingModel && embeddingModel !== "__none__" && embeddingModel.trim().length > 0) {
          payload.embedding_model = embeddingModel.trim();
        }
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${body}`);
      }

      const data = (await res.json()) as ChunkResponse;
      setResult(data);

      toast({
        title: "Chunking complete",
        description: `Created ${data.chunk_count} chunks`,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      toast({
        title: "Chunking failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  }, [chunkSize, overlapSize, includeEmbeddings, includeTopics, embeddingProvider, embeddingModel, text, toast, topicModel, maxTopics]);

  const runTopicSearch = useCallback(async () => {
    if (!result) {
      toast({
        title: "No chunks yet",
        description: "Run chunking first so the ingestion service has chunks to search.",
        variant: "destructive",
      });
      return;
    }

    const topics = topicQuery
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (topics.length === 0) {
      toast({
        title: "Enter at least one topic",
        description: "Use a comma-separated list, e.g. 'prd, metrics'.",
        variant: "destructive",
      });
      return;
    }

    setIsSearchingTopics(true);
    setTopicSearchResult(null);

    try {
      const url = `${DEFAULT_URL.replace(/\/$/, "")}/search/topics`;

      const payload: Record<string, unknown> = {
        topics,
        match: topicMatch,
        limit: topicLimit,
      };

      const parsedMinRank = topicMinRank.trim().length ? Number(topicMinRank) : null;
      if (parsedMinRank !== null && Number.isFinite(parsedMinRank)) {
        payload.min_rank = parsedMinRank;
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${body}`);
      }

      const data = (await res.json()) as TopicSearchResponse;
      setTopicSearchResult(data);

      toast({
        title: "Topic search complete",
        description: `Found ${data.total_results} matches`,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      toast({
        title: "Topic search failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSearchingTopics(false);
    }
  }, [result, toast, topicQuery, topicMatch, topicLimit, topicMinRank]);

  const stats = useMemo(() => {
    if (!result) return null;
    const tokenCounts = result.chunks
      .map((c) => (typeof c.token_count === "number" ? c.token_count : null))
      .filter((v): v is number => v !== null);

    const avgTokens = tokenCounts.length
      ? Math.round(tokenCounts.reduce((a, b) => a + b, 0) / tokenCounts.length)
      : null;

    return { avgTokens, tokenCountsKnown: tokenCounts.length };
  }, [result]);
  
  const embeddingDims = useMemo(() => {
    if (!result) return null;
    const dims = new Set<number>();
    for (const chunk of result.chunks) {
      if (Array.isArray(chunk.embedding)) dims.add(chunk.embedding.length);
    }
    if (dims.size === 0) return null;
    return Array.from(dims).sort((a, b) => a - b);
  }, [result]);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
          <CardDescription>Paste markdown and preview how it is chunked for RAG.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="chunkSize">Chunk size (tokens)</Label>
                <Input
                  id="chunkSize"
                  type="number"
                  min={50}
                  max={4000}
                  value={chunkSize}
                  onChange={(e) => setChunkSize(Number(e.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="overlapSize">Overlap size (tokens)</Label>
                <Input
                  id="overlapSize"
                  type="number"
                  min={0}
                  max={1000}
                  value={overlapSize}
                  onChange={(e) => setOverlapSize(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="grid gap-1">
                <div className="text-sm font-medium">Include topics</div>
                <div className="text-xs text-muted-foreground">
                  Extract topics per chunk (LLM when configured; falls back to heuristic with a warning).
                </div>
              </div>
              <Switch checked={includeTopics} onCheckedChange={setIncludeTopics} />
            </div>

            {includeTopics && (
              <div className="grid gap-4 rounded-lg border p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="topicModel">Topic model</Label>
                    <Select
                      value={topicModel}
                      onValueChange={(v) => {
                        setTopicModel(v as TopicModel);
                        setResult(null);
                        setTopicSearchResult(null);
                      }}
                    >
                      <SelectTrigger id="topicModel">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-2.5-flash-lite">Gemini (gemini-2.5-flash-lite)</SelectItem>
                        <SelectItem value="heuristic">Heuristic (deterministic)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maxTopics">Max topics per chunk</Label>
                    <Input
                      id="maxTopics"
                      type="number"
                      min={1}
                      max={32}
                      value={maxTopics}
                      onChange={(e) => {
                        setMaxTopics(Number(e.target.value));
                        setResult(null);
                        setTopicSearchResult(null);
                      }}
                    />
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {topicModel === "heuristic" ? (
                    <>Heuristic mode runs locally and does not require an API key.</>
                  ) : (
                    <>
                      To use Gemini extraction, configure the ingestion service with <span className="font-mono">GOOGLE_API_KEY</span>.
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="grid gap-1">
                <div className="text-sm font-medium">Include embeddings</div>
                <div className="text-xs text-muted-foreground">
                  Choose an embedding provider/model for this request.
                </div>
              </div>
              <Switch checked={includeEmbeddings} onCheckedChange={setIncludeEmbeddings} />
            </div>

            {includeEmbeddings && (
              <div className="grid gap-4 rounded-lg border p-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Embedding provider</Label>
                    <Select
                      value={embeddingProvider}
                      onValueChange={(v) => {
                        const next = v as EmbeddingProvider;
                        setEmbeddingProvider(next);
                        setEmbeddingModelIsCustom(false);
                        setEmbeddingModel(defaultModelFor(next));
                        setResult(null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sentence-transformers">sentence-transformers (local)</SelectItem>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="openrouter">OpenRouter</SelectItem>
                        <SelectItem value="mock">Mock (dev)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label>Embedding model</Label>
                    <Select
                      value={embeddingModelIsCustom ? "__custom__" : embeddingModel || "__custom__"}
                      onValueChange={(v) => {
                        if (v === "__custom__") {
                          setEmbeddingModelIsCustom(true);
                          setEmbeddingModel(embeddingModel || "");
                        } else if (v === "__none__") {
                          setEmbeddingModelIsCustom(false);
                          setEmbeddingModel("__none__");
                        } else {
                          setEmbeddingModelIsCustom(false);
                          setEmbeddingModel(v);
                        }
                        setResult(null);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a model" />
                      </SelectTrigger>
                      <SelectContent>
                        {embeddingProvider === "sentence-transformers" &&
                          ST_MODELS.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                              {m.label}
                            </SelectItem>
                          ))}
                        {embeddingProvider === "openai" &&
                          OPENAI_MODELS.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                              {m.label}
                            </SelectItem>
                          ))}
                        {embeddingProvider === "openrouter" &&
                          OPENROUTER_MODELS.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                              {m.label}
                            </SelectItem>
                          ))}
                        {embeddingProvider === "mock" && (
                          <SelectItem value="__none__">(no model)</SelectItem>
                        )}
                        <SelectItem value="__custom__">Custom…</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {embeddingModelIsCustom && embeddingProvider !== "mock" && (
                  <div className="grid gap-2">
                    <Label htmlFor="embeddingModel">Custom model name</Label>
                    <Input
                      id="embeddingModel"
                      value={embeddingModel}
                      onChange={(e) => {
                        setEmbeddingModel(e.target.value);
                        setResult(null);
                      }}
                      placeholder={defaultModelFor(embeddingProvider)}
                    />
                  </div>
                )}

                {(embeddingProvider === "openai" || embeddingProvider === "openrouter") && (
                  <div className="text-xs text-muted-foreground">
                    Requires an API key configured in the ingestion service container ({
                      embeddingProvider === "openai" ? "OPENAI_API_KEY" : "OPENROUTER_API_KEY"
                    }). If missing, the API returns 401.
                  </div>
                )}
              </div>
            )}

            <div className="grid gap-2">
              <Label>Sample</Label>
              <Select value={preset} onValueChange={onPresetChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a sample" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ml">Sample: ML</SelectItem>
                  <SelectItem value="architecture">Sample: Architecture</SelectItem>
                  <SelectItem value="prd">Sample: PRD</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">Using ingestion endpoint: {DEFAULT_URL}</div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="markdown">Markdown</Label>
              <Textarea
                id="markdown"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[280px] font-mono text-xs"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={runChunking} disabled={isRunning || !text.trim()}>
                {isRunning ? "Chunking…" : "Chunk"}
              </Button>
              {result && (
                <div className="text-sm text-muted-foreground">
                  {result.chunk_count} chunks
                  {stats && stats.avgTokens !== null && (
                    <span>
                      {" "}· avg {stats.avgTokens} tokens ({stats.tokenCountsKnown} measured)
                    </span>
                  )}
                  {includeEmbeddings && (
                    <span>
                      {" "}· embeddings{" "}
                      {embeddingDims ? (
                        embeddingDims.length === 1 ? (
                          <>{embeddingDims[0]}d</>
                        ) : (
                          <>mixed</>
                        )
                      ) : (
                        <>pending</>
                      )}
                    </span>
                  )}
                </div>
              )}
            </div>

            {result?.warnings && result.warnings.length > 0 && (
              <div className="rounded-lg border bg-muted p-3 text-sm">
                <div className="font-medium mb-1">Warnings</div>
                <ul className="list-disc pl-5 space-y-1">
                  {result.warnings.map((w, idx) => (
                    <li key={idx} className="text-muted-foreground">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Topic Search</CardTitle>
            <CardDescription>
              Searches the most recent chunking run in the ingestion service (dev-only, in-memory).
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="topicQuery">Topics (comma-separated)</Label>
              <Input
                id="topicQuery"
                value={topicQuery}
                onChange={(e) => setTopicQuery(e.target.value)}
                placeholder="prd, metrics"
              />
            </div>
            <div className="grid gap-2">
              <Label>Match mode</Label>
              <Select value={topicMatch} onValueChange={(v) => setTopicMatch(v as "any" | "all")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">any</SelectItem>
                  <SelectItem value="all">all</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="topicMinRank">Min rank (0–100, optional)</Label>
              <Input
                id="topicMinRank"
                type="number"
                min={0}
                max={100}
                value={topicMinRank}
                onChange={(e) => setTopicMinRank(e.target.value)}
                placeholder=""
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="topicLimit">Limit</Label>
              <Input
                id="topicLimit"
                type="number"
                min={1}
                max={200}
                value={topicLimit}
                onChange={(e) => setTopicLimit(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={runTopicSearch} disabled={isSearchingTopics}>
              {isSearchingTopics ? "Searching…" : "Search"}
            </Button>
            {topicSearchResult && (
              <div className="text-sm text-muted-foreground">
                {topicSearchResult.total_results} results
              </div>
            )}
          </div>

          {topicSearchResult && topicSearchResult.chunks.length > 0 && (
            <ScrollArea className="h-[240px] pr-4">
              <div className="grid gap-3">
                {topicSearchResult.chunks.map((c) => (
                  <div key={`search-${c.index}`} className="rounded-lg border bg-card p-3">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="secondary">#{c.index}</Badge>
                      {typeof c.rank === "number" && (
                        <Badge variant="outline">rank {c.rank.toFixed(1)}</Badge>
                      )}
                      {Array.isArray(c.topics) && c.topics.length > 0 &&
                        c.topics.map((t) => {
                          const matched = topicMatchesQuery(t, topicQueryTerms);
                          return (
                            <Badge key={`${c.index}-${t}`} variant={matched ? "destructive" : "outline"}>
                              {t}
                            </Badge>
                          );
                        })}
                    </div>
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {c.text.length > 500 ? `${c.text.slice(0, 500)}…` : c.text}
                    </pre>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {topicSearchResult && topicSearchResult.chunks.length === 0 && (
            <div className="text-sm text-muted-foreground">No matches found.</div>
          )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Chunks</CardTitle>
          <CardDescription>Each chunk includes optional section path context.</CardDescription>
        </CardHeader>
        <CardContent>
          {!result ? (
            <div className="text-sm text-muted-foreground">Run chunking to see results.</div>
          ) : result.chunks.length === 0 ? (
            <div className="text-sm text-muted-foreground">No chunks returned.</div>
          ) : (
            <ScrollArea className="h-[520px] pr-4">
              <div className="grid gap-3">
                {result.chunks.map((c) => (
                  <div key={c.index} className="rounded-lg border bg-card p-4">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant="secondary">#{c.index}</Badge>
                      {typeof c.token_count === "number" && (
                        <Badge variant="outline">{c.token_count} tokens</Badge>
                      )}
                      {Array.isArray(c.embedding) && (
                        <Badge variant="outline">emb {c.embedding.length}d</Badge>
                      )}
                      {Array.isArray(c.topics) && c.topics.length > 0 && (
                        <Badge variant="outline">topics: {c.topics.join(", ")}</Badge>
                      )}
                      {c.topic_source && (
                        <Badge variant="outline">{c.topic_source}</Badge>
                      )}
                      {c.section_path && <Badge variant="outline">{c.section_path}</Badge>}
                    </div>
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {c.text}
                    </pre>

                    {Array.isArray(c.embedding) && c.embedding.length > 0 && (
                      <Collapsible
                        open={!!openEmbeddings[c.index]}
                        onOpenChange={(open) =>
                          setOpenEmbeddings((prev) => ({ ...prev, [c.index]: open }))
                        }
                      >
                        <div className="mt-3 grid gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="text-xs text-muted-foreground">
                              <span className="font-medium">Embedding (vector values):</span>{" "}
                              <span className="font-mono break-all">{formatEmbeddingPreview(c.embedding)}</span>
                            </div>
                            <CollapsibleTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 px-2">
                                {openEmbeddings[c.index]
                                  ? "Hide"
                                  : `Show all (${c.embedding.length})`}
                              </Button>
                            </CollapsibleTrigger>
                          </div>
                          <CollapsibleContent>
                            <div className="rounded-md border bg-muted p-2">
                              <div className="text-xs text-muted-foreground mb-2">
                                Full embedding vector:
                              </div>
                              <ScrollArea className="max-h-[220px]">
                                <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                                  {formatEmbeddingAll(c.embedding)}
                                </pre>
                              </ScrollArea>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
