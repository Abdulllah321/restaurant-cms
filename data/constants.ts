import { toast } from "sonner";

export const BRANCH_LOCAL_STORAGE_KEY = "selectedBranch";

export const fetchSelectedBranch = () => {
  try {
    // Proper window check for Next.js SSR
    if (typeof window === "undefined") return null;
    
    const branchData = localStorage.getItem(BRANCH_LOCAL_STORAGE_KEY);

    if (!branchData) {
      toast.warning("No branch selected", {
        description: "Please select a branch to continue",
      });
      return null;
    }

    const branch = JSON.parse(branchData) as Branch;
    return branch;
  } catch (error) {
    console.error("Error parsing branch data:", error);
    toast.error("Invalid branch data", {
      description: "Please select a branch again",
    });
    return null;
  }
};
