"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import ChunkingPreview from "@/components/ChunkingPreview";

export default function ChunkingDebugPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user) {
                // Redirect to login if not authenticated
                router.push("/login");
            } else {
                setIsAuthorized(true);
            }
        }
    }, [user, loading, router]);

    // Show loading state while checking auth
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

    // Don't render content until authorized
    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
            <div className="container mx-auto py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-tight">Chunking Lab</h1>
                    <p className="text-muted-foreground mt-2">
                        Test and visualize how the Chonkie library chunks markdown documents
                    </p>
                </div>
                <ChunkingPreview />
            </div>
        </div>
    );
}
