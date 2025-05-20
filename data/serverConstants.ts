import { cookies } from "next/headers";
import { BRANCH_COOKIE_KEY } from "./constants";
import { BranchSwitcher } from "@/components/common/branch-switcher";

export async function getSelectedBranchFromCookiesFromServer(): Promise<BranchSwitcher | null> {
  try {
    const cookieStore = await cookies();
    const branchData = cookieStore.get(BRANCH_COOKIE_KEY)?.value;
    return branchData ? JSON.parse(branchData) : null;
  } catch (error) {
    console.error("Failed to parse selected branch from cookies:", error);
    return null;
  }
}
