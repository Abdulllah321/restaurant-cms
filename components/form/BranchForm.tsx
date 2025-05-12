"use client";
import React, { useActionState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createBranch, updateBranch } from "@/actions/branch.action";

export type BranchFields = {
  id?: string;
  name: FormDataEntryValue | null;
  location: FormDataEntryValue | null;
  phoneNumber: FormDataEntryValue | null;
};

interface BranchFormProps {
  selectedBranch?: BranchFields | null;
  onSuccess?: () => void;
}

const BranchForm: React.FC<BranchFormProps> = ({
  selectedBranch,
  onSuccess,
}) => {
  const action = selectedBranch ? updateBranch : createBranch;
  const [state, formAction, pending] = useActionState(
    async (_:unknown, formData: FormData) => await action(_, formData),
    null
  );

  const getDefaultValue = (field: keyof BranchFields) => {
    if (selectedBranch && selectedBranch[field]) {
      return selectedBranch[field] as string;
    }
    return state &&
      "values" in state &&
      typeof (state.values as BranchFields)?.[field] === "string"
      ? ((state.values as BranchFields)?.[field] as string)
      : "";
  };

  const getErrorMessage = (field: keyof BranchFields) => {
    return state && "errors" in state
      ? (state.errors as Record<keyof BranchFields, string | undefined>)?.[
          field
        ]
      : "";
  };

  // Handle success
  useEffect(() => {
    if (state && ("id" in state || "success" in state)) {
      onSuccess?.();
    }
  }, [state, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label>Name</Label>
          <Input
            name="name"
            placeholder="Branch Name"
            defaultValue={getDefaultValue("name")}
            minLength={3}
          />
          {getErrorMessage("name") && (
            <p className="text-destructive mt-2">{getErrorMessage("name")}</p>
          )}
        </div>
        <div>
          <Label>Phone Number</Label>
          <Input
            name="phoneNumber"
            placeholder="Phone Number"
            defaultValue={getDefaultValue("phoneNumber")}
          />
          {getErrorMessage("phoneNumber") && (
            <p className="text-destructive mt-2">
              {getErrorMessage("phoneNumber")}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label>Location</Label>
        <Textarea
          name="location"
          placeholder="Branch Location"
          minLength={5}
          defaultValue={getDefaultValue("location")}
        />
        {getErrorMessage("location") && (
          <p className="text-destructive mt-2">{getErrorMessage("location")}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending
          ? selectedBranch
            ? "Updating..."
            : "Creating..."
          : selectedBranch
          ? "Update Branch"
          : "Create Branch"}
      </Button>
    </form>
  );
};

export default BranchForm;
