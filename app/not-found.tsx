"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { FrownIcon } from "lucide-react";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="max-w-lg w-full text-center p-8 rounded-2xl shadow-xl bg-white">
        <CardHeader>
          <div className="flex flex-col items-center">
            <FrownIcon size={64} className="text-red-500 mb-4" />
            <CardTitle className="text-3xl font-semibold text-gray-800">404 - Page Not Found</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Oops! It seems like you&apos;ve wandered off the menu. Let&apos;s get you back on track.
          </p>
          <Button onClick={() => router.replace("/")}>Return to Dashboard</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;