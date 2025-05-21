"use client";

import * as React from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  RiExpandUpDownLine,
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
} from "@remixicon/react";
import { ReusableDialog } from "./reuseable-dialog";
import BranchForm, { BranchFields } from "../form/BranchForm";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { deleteBranch } from "@/actions/branch.actions";
import {
  BRANCH_COOKIE_KEY,
  getSelectedBranchFromCookies,
} from "@/data/constants";
import { useRouter } from "next/navigation";

// Branch Type Definition
export interface BranchSwitcher {
  id: string;
  name: string;
  logo: string;
  location?: string;
  phoneNumber?: string;
}

interface BranchSwitcherProps {
  branches: BranchSwitcher[];
  getBranches: () => void;
}

export function BranchSwitcher({ branches, getBranches }: BranchSwitcherProps) {
  const [activeBranch, setActiveBranch] = React.useState<BranchSwitcher | null>(
    getSelectedBranchFromCookies()
  );
  const [isBranchDialogOpen, setIsBranchDialogOpen] = React.useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState<
    BranchSwitcher | BranchFields | null
  >(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (branches && branches.length && !activeBranch) {
      const branch = branches[0]
      setActiveBranch(branch);
      Cookies.set(BRANCH_COOKIE_KEY, JSON.stringify(branch), {
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        expires: 30, // 30 days
      });
    }
  }, [branches])

  // Save selected branch to cookies
  const handleBranchSelect = (branch: BranchSwitcher) => {
    setActiveBranch(branch);
    Cookies.set(BRANCH_COOKIE_KEY, JSON.stringify(branch), {
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: 30, // 30 days
    });
    router.refresh();
  };

  // Handle branch form success
  const handleBranchFormSuccess = () => {
    setIsBranchDialogOpen(false);
    setSelectedBranch(null);
    getBranches();
  };

  // Handle branch editing
  const handleEditBranch = (branch: BranchSwitcher) => {
    setSelectedBranch(branch);
    setIsBranchDialogOpen(true);
  };

  // Handle branch deletion
  const handleDeleteBranch = (branch: BranchSwitcher) => {
    setSelectedBranch(branch);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirmationBranch = async (branchId: string) => {
    await deleteBranch(branchId);
    setIsDeleteDialogOpen(false);
    getBranches();
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="gap-3">
              <div className="flex aspect-square size-9 items-center justify-center rounded-md overflow-hidden bg-sidebar-primary relative">
                {activeBranch && (
                  <Image
                    src={activeBranch.logo}
                    width={36}
                    height={36}
                    alt={activeBranch.name}
                  />
                )}
              </div>
              <div className="grid flex-1 text-left text-base leading-tight">
                <span className="truncate font-medium">
                  {activeBranch?.name || "Select a Branch"}
                </span>
              </div>
              <RiExpandUpDownLine size={20} aria-hidden="true" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            sideOffset={4}
            className="min-w-56 rounded-md"
          >
            <DropdownMenuLabel className="uppercase text-xs">
              Branches
            </DropdownMenuLabel>

            {branches.map((branch) => (
              <ContextMenu key={branch.id}>
                <ContextMenuTrigger>
                  <DropdownMenuItem
                    onClick={() => handleBranchSelect(branch)}
                    className="gap-2 p-2"
                  >
                    <Image
                      src={branch.logo}
                      width={36}
                      height={36}
                      alt={branch.name}
                    />
                    {branch.name}
                  </DropdownMenuItem>
                </ContextMenuTrigger>
                <ContextMenuContent className="min-w-[150px]">
                  <ContextMenuItem onClick={() => handleEditBranch(branch)}>
                    <RiEditLine className="mr-2" size={16} />
                    Edit
                  </ContextMenuItem>
                  <ContextMenuItem
                    onClick={() => handleDeleteBranch(branch)}
                    className="text-destructive"
                  >
                    <RiDeleteBinLine
                      className="mr-2 text-destructive"
                      size={16}
                    />
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => { setSelectedBranch(null);setIsBranchDialogOpen(true) }}
              className="gap-2 p-2 cursor-pointer"
            >
              <RiAddLine size={16} aria-hidden="true" />
              <div className="font-medium">Add Branch</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      {/* Branch Dialog (Add/Edit) */}
      <ReusableDialog
        title={selectedBranch ? "Edit Branch" : "Create New Branch"}
        subTitle={
          selectedBranch
            ? "Update the branch details"
            : "Add the details of the new branch below"
        }
        isOpen={isBranchDialogOpen}
        setIsOpen={setIsBranchDialogOpen}
      >
        <BranchForm
          selectedBranch={selectedBranch as BranchFields}
          onSuccess={handleBranchFormSuccess}
        />
      </ReusableDialog>
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={() => handleDeleteConfirmationBranch(selectedBranch!.id!)}
      />
    </SidebarMenu>
  );
}
