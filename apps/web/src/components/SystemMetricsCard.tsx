"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface SystemMetricsCardProps {
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
    loading?: boolean;
    error?: string;
}

function getProgressColor(percent: number): string {
    if (percent < 50) return "bg-green-500";
    if (percent < 80) return "bg-yellow-500";
    return "bg-red-500";
}

function MetricRow({
    label,
    value,
    percent,
    loading,
}: {
    label: string;
    value: string;
    percent: number;
    loading?: boolean;
}) {
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className={cn("font-mono", loading && "animate-pulse")}>
                    {loading ? "—" : value}
                </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                    className={cn(
                        "h-full transition-all duration-500",
                        loading ? "bg-muted animate-pulse" : getProgressColor(percent)
                    )}
                    style={{ width: loading ? "50%" : `${percent}%` }}
                />
            </div>
        </div>
    );
}

export function SystemMetricsCard({
    cpu,
    memory,
    disk,
    loading,
    error,
}: SystemMetricsCardProps) {
    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold">System Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {error ? (
                    <div className="p-3 bg-red-500/10 rounded-md text-red-700 text-sm">
                        {error}
                    </div>
                ) : (
                    <>
                        <MetricRow
                            label="CPU Usage"
                            value={`${cpu?.toFixed(1) ?? 0}%`}
                            percent={cpu ?? 0}
                            loading={loading}
                        />
                        <MetricRow
                            label="Memory"
                            value={
                                memory
                                    ? `${memory.used_mb.toLocaleString()} / ${memory.total_mb.toLocaleString()} MB`
                                    : "—"
                            }
                            percent={memory?.percent ?? 0}
                            loading={loading}
                        />
                        <MetricRow
                            label="Disk"
                            value={
                                disk
                                    ? `${disk.used_gb} / ${disk.total_gb} GB`
                                    : "—"
                            }
                            percent={disk?.percent ?? 0}
                            loading={loading}
                        />
                    </>
                )}
            </CardContent>
        </Card>
    );
}
