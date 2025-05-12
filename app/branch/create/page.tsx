"use client";

import BranchForm from "@/components/form/BranchForm";
import { useRouter } from "next/navigation";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreateBranch = () => {
  const router = useRouter();

  const handleSuccess = () => {
    router.replace("/");
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Card className="max-w-2xl w-full mx-auto mt-10 shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Create New Branch</CardTitle>
        </CardHeader>
        <CardContent>
          <BranchForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBranch;
