"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { ServiceStatusCard, ServiceStatus } from "@/components/ServiceStatusCard";
import { SystemMetricsCard } from "@/components/SystemMetricsCard";
import { Button } from "@/components/ui/button";
import type { HealthCheckResult } from "@/app/api/health/ingestion/route";
import type { MetricsResult } from "@/app/api/health/metrics/route";

interface ServiceState {
    status: ServiceStatus;
    version?: string;
    responseTimeMs?: number;
    lastChecked?: Date;
    error?: string;
}

interface MetricsState {
    cpu?: number;
    memory?: {
        used_mb: number;
        total_mb: number;
        percent: number;
    };
    disk?: {
        used_gb: number;
        total_gb: number;
        percent: number;
    };
    loading: boolean;
    error?: string;
}

const REFRESH_INTERVAL = 10000; // 10 seconds

export default function MonitoringPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [autoRefresh, setAutoRefresh] = useState(true);

    // Service states
    const [webAppStatus, setWebAppStatus] = useState<ServiceState>({
        status: "checking",
    });
    const [ingestionStatus, setIngestionStatus] = useState<ServiceState>({
        status: "checking",
    });
    const [metrics, setMetrics] = useState<MetricsState>({
        loading: true,
    });

    // Check ingestion service health
    const checkIngestionHealth = useCallback(async () => {
        setIngestionStatus((prev) => ({ ...prev, status: "checking" }));

        try {
            const response = await fetch("/api/health/ingestion", {
                cache: "no-store",
            });
            const data: HealthCheckResult = await response.json();

            setIngestionStatus({
                status: data.healthy ? "healthy" : "unhealthy",
                version: data.version,
                responseTimeMs: data.responseTimeMs,
                lastChecked: new Date(data.timestamp),
                error: data.error,
            });
        } catch {
            setIngestionStatus({
                status: "unhealthy",
                lastChecked: new Date(),
                error: "Failed to check service",
            });
        }
    }, []);

    // Check system metrics
    const checkMetrics = useCallback(async () => {
        setMetrics((prev) => ({ ...prev, loading: true }));

        try {
            const response = await fetch("/api/health/metrics", {
                cache: "no-store",
            });
            const data: MetricsResult | { error: string } = await response.json();

            if ("error" in data && !("cpu" in data)) {
                setMetrics({
                    loading: false,
                    error: data.error,
                });
            } else {
                const metricsData = data as MetricsResult;
                setMetrics({
                    cpu: metricsData.cpu.percent,
                    memory: metricsData.memory,
                    disk: metricsData.disk,
                    loading: false,
                });
            }
        } catch {
            setMetrics({
                loading: false,
                error: "Failed to fetch metrics",
            });
        }
    }, []);

    // Check all services
    const checkAllServices = useCallback(async () => {
        setIsRefreshing(true);

        // Web app is always healthy if this page loads
        setWebAppStatus({
            status: "healthy",
            version: "Next.js",
            lastChecked: new Date(),
        });

        await Promise.all([checkIngestionHealth(), checkMetrics()]);
        setIsRefreshing(false);
    }, [checkIngestionHealth, checkMetrics]);

    // Auth check
    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login");
            } else {
                setIsAuthorized(true);
            }
        }
    }, [user, loading, router]);

    // Initial check and auto-refresh
    useEffect(() => {
        if (isAuthorized) {
            checkAllServices();
        }
    }, [isAuthorized, checkAllServices]);

    useEffect(() => {
        if (!autoRefresh || !isAuthorized) return;

        const interval = setInterval(checkAllServices, REFRESH_INTERVAL);
        return () => clearInterval(interval);
    }, [autoRefresh, isAuthorized, checkAllServices]);

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto py-8 px-4">
                <div className="mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight">Service Monitor</h1>
                            <p className="text-muted-foreground mt-2">
                                Real-time health status of all running services
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setAutoRefresh(!autoRefresh)}
                            >
                                {autoRefresh ? "⏸ Pause" : "▶ Resume"}
                            </Button>
                            <Button
                                onClick={checkAllServices}
                                disabled={isRefreshing}
                                size="sm"
                            >
                                {isRefreshing ? "Checking..." : "🔄 Refresh Now"}
                            </Button>
                        </div>
                    </div>
                    {autoRefresh && (
                        <p className="text-xs text-muted-foreground mt-2">
                            Auto-refreshing every {REFRESH_INTERVAL / 1000} seconds
                        </p>
                    )}
                </div>

                {/* Service Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <ServiceStatusCard
                        name="Web Application"
                        description="Next.js frontend running on port 9002"
                        status={webAppStatus.status}
                        version={webAppStatus.version}
                        lastChecked={webAppStatus.lastChecked}
                    />

                    <ServiceStatusCard
                        name="Ingestion Service"
                        description="FastAPI chunking service on Docker (port 8000)"
                        status={ingestionStatus.status}
                        version={ingestionStatus.version}
                        responseTimeMs={ingestionStatus.responseTimeMs}
                        lastChecked={ingestionStatus.lastChecked}
                        error={ingestionStatus.error}
                    />

                    {/* System Metrics Card */}
                    <SystemMetricsCard
                        cpu={metrics.cpu}
                        memory={metrics.memory}
                        disk={metrics.disk}
                        loading={metrics.loading}
                        error={metrics.error}
                    />
                </div>

                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                    <h2 className="text-sm font-medium mb-2">Quick Actions</h2>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <a
                            href="/debug/chunking"
                            className="hover:text-primary underline"
                        >
                            Chunking Lab →
                        </a>
                        <span>|</span>
                        <a
                            href="http://localhost:8000/docs"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary underline"
                        >
                            Ingestion API Docs →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
