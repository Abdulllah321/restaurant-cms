import { BranchSwitcher } from "@/components/common/branch-switcher";
import Cookies from "js-cookie";

export const BRANCH_COOKIE_KEY = "selectedBranch";

export const getSelectedBranchFromCookies = (): BranchSwitcher | null => {
  try {
    const branchData = Cookies.get(BRANCH_COOKIE_KEY);
    return branchData ? JSON.parse(branchData) : null;
  } catch (error) {
    console.error("Failed to parse selected branch from cookies:", error);
    return null;
  }
};

export const debounce = (func: (...args: unknown[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: unknown[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
