"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ServiceStatus = "healthy" | "unhealthy" | "checking";

export interface ServiceStatusCardProps {
    name: string;
    description: string;
    status: ServiceStatus;
    version?: string;
    responseTimeMs?: number;
    lastChecked?: Date;
    error?: string;
}

const statusConfig: Record<ServiceStatus, { label: string; className: string }> = {
    healthy: {
        label: "Healthy",
        className: "bg-green-500/15 text-green-700 border-green-500/30 hover:bg-green-500/20",
    },
    unhealthy: {
        label: "Unhealthy",
        className: "bg-red-500/15 text-red-700 border-red-500/30 hover:bg-red-500/20",
    },
    checking: {
        label: "Checking...",
        className: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/20 animate-pulse",
    },
};

export function ServiceStatusCard({
    name,
    description,
    status,
    version,
    responseTimeMs,
    lastChecked,
    error,
}: ServiceStatusCardProps) {
    const config = statusConfig[status];

    return (
        <Card className={cn(
            "transition-all duration-300",
            status === "healthy" && "border-green-500/30",
            status === "unhealthy" && "border-red-500/30",
            status === "checking" && "border-yellow-500/30"
        )}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">{name}</CardTitle>
                    <Badge variant="outline" className={config.className}>
                        {config.label}
                    </Badge>
                </div>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
                {version && (
                    <div className="flex justify-between text-muted-foreground">
                        <span>Version</span>
                        <span className="font-mono">{version}</span>
                    </div>
                )}
                {responseTimeMs !== undefined && status !== "checking" && (
                    <div className="flex justify-between text-muted-foreground">
                        <span>Response Time</span>
                        <span className="font-mono">{responseTimeMs}ms</span>
                    </div>
                )}
                {lastChecked && (
                    <div className="flex justify-between text-muted-foreground">
                        <span>Last Checked</span>
                        <span>{lastChecked.toLocaleTimeString()}</span>
                    </div>
                )}
                {error && status === "unhealthy" && (
                    <div className="mt-2 p-2 bg-red-500/10 rounded-md text-red-700 text-xs">
                        {error}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
