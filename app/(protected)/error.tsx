"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-4xl font-bold text-destructive mb-4">
        Something went wrong
      </h1>
      <p className="text-lg text-muted-foreground mb-6">
        {error.message || "An unexpected error occurred."}
      </p>

      <div className="flex gap-4">
        <Button onClick={reset}>Try Again</Button>
        <Button variant="outline" onClick={() => router.push("/")}>
          Go to Home
        </Button>
      </div>
    </div>
  );
}
