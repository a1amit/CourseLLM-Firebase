import { NextResponse } from "next/server";

const INGESTION_URL =
    process.env.NEXT_PUBLIC_INGESTION_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8000";

export interface MetricsResult {
    cpu: {
        percent: number;
    };
    memory: {
        used_mb: number;
        total_mb: number;
        percent: number;
    };
    disk: {
        used_gb: number;
        total_gb: number;
        percent: number;
    };
    error?: string;
    timestamp: string;
}

export async function GET(): Promise<NextResponse<MetricsResult | { error: string; timestamp: string }>> {
    const timestamp = new Date().toISOString();

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${INGESTION_URL}/metrics`, {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            return NextResponse.json({
                error: `HTTP ${response.status}: ${response.statusText}`,
                timestamp,
            });
        }

        const data = await response.json();
        return NextResponse.json({ ...data, timestamp });
    } catch (error) {
        let errorMessage = "Unknown error";

        if (error instanceof Error) {
            if (error.name === "AbortError") {
                errorMessage = "Request timeout (5s)";
            } else if (error.message.includes("fetch failed") || error.message.includes("ECONNREFUSED")) {
                errorMessage = "Service unavailable";
            } else {
                errorMessage = error.message;
            }
        }

        return NextResponse.json({
            error: errorMessage,
            timestamp,
        });
    }
}
