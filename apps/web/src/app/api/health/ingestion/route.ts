import { NextResponse } from "next/server";

const INGESTION_URL =
    process.env.NEXT_PUBLIC_INGESTION_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8000";

export interface HealthCheckResult {
    healthy: boolean;
    service: string;
    version?: string;
    responseTimeMs: number;
    error?: string;
    timestamp: string;
}

export async function GET(): Promise<NextResponse<HealthCheckResult>> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${INGESTION_URL}/health`, {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
        });

        clearTimeout(timeoutId);

        const responseTimeMs = Date.now() - startTime;

        if (!response.ok) {
            return NextResponse.json({
                healthy: false,
                service: "ingestion",
                responseTimeMs,
                error: `HTTP ${response.status}: ${response.statusText}`,
                timestamp,
            });
        }

        const data = await response.json();

        return NextResponse.json({
            healthy: data.ok === true,
            service: data.service ?? "ingestion",
            version: data.version,
            responseTimeMs,
            timestamp,
        });
    } catch (error) {
        const responseTimeMs = Date.now() - startTime;
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
            healthy: false,
            service: "ingestion",
            responseTimeMs,
            error: errorMessage,
            timestamp,
        });
    }
}
