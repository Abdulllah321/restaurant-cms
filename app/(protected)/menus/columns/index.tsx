"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { SortableHeader } from "@/components/common/DataTable/Others/SortableHeader";
import { Project } from "../data";
import ProjectName from "@/components/common/DataTable/Others/ProjectName";
import ProjectManager from "@/components/common/DataTable/Others/ProjectManager";
import ProjectStatus from "@/components/common/DataTable/Others/ProjectStatus";
import ProjectLastUpdate from "@/components/common/DataTable/Others/ProjectLastUpdate";
import ProjectResources from "@/components/common/DataTable/Others/ProjectResources";
import ProjectTimeLine from "@/components/common/DataTable/Others/ProjectTimeLine";
import { ProjectActions } from "@/components/common/DataTable/Others/ProjectActions";

function formatCurrency(amount: number) {
    if (amount >= 1000) {
        return `US$ ${(amount / 1000).toFixed(1)}k`;
    }
    return `US$ ${amount}`;
}

export const columns: ColumnDef<Project>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
                className="border-border bg-white shadow-lg border data-[state=checked]:border-0"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
                className="border-border bg-white shadow-lg border data-[state=checked]:border-0"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: ({ column }) => (
            <SortableHeader column={column} title="#" className="w-[50px]" />
        ),
        cell: ({ row }) => <div className="w-[50px]">{row.getValue("id")}</div>,
        enableSorting: true,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <SortableHeader column={column} title="Project name" />
        ),
        cell: ({ row }) => <ProjectName name={row.getValue("name")} />,
        enableSorting: true,
    },
    {
        accessorKey: "project_manager",
        header: "PM",
        cell: ({ row }) => (
            <ProjectManager name={row.getValue("project_manager")} />
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <ProjectStatus status={row.getValue("status")} />,
    },
    {
        accessorKey: "last_updated",
        header: ({ column }) => (
            <SortableHeader column={column} title="Last updated" />
        ),
        cell: ({ row }) => (
            <ProjectLastUpdate date={row.getValue("last_updated")} />
        ),
        enableSorting: true,
    },
    {
        accessorKey: "resources",
        header: "Resources",
        cell: ({ row }) => (
            <ProjectResources resources={row.getValue("resources")} />
        ),
    },
    {
        accessorKey: "start_date",
        header: "Project timeline",
        cell: ({ row }) => (
            <ProjectTimeLine
                startDate={row.original.start_date}
                endDate={row.original.end_date}
            />
        ),
    },
    {
        accessorKey: "estimated_cost",
        header: ({ column }) => (
            <SortableHeader column={column} title="Estimated cost" />
        ),
        cell: ({ row }) => (
            <p className="text-base">
                {formatCurrency(row.getValue("estimated_cost"))}
            </p>
        ),
        enableSorting: true,
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => <ProjectActions row={row} />,
    },
];