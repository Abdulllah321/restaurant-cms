"use client"
import React, { useState, useEffect } from "react";

type SortConfig = { key: string; direction: "asc" | "desc" } | null;

interface UseDataTableProps {
  dynamic: boolean;
  fetchData?: (page: number, sortKey: string, sortDirection: "asc" | "desc", searchTerm: string) => Promise<any>;
  data: any[];
  rowsPerPage: number;
}

const useDataTable = ({ dynamic, fetchData, data, rowsPerPage }: UseDataTableProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableData, setTableData] = useState(data);
  const [totalRecords, setTotalRecords] = useState<number>(data.length);
  const [loading, setLoading] = useState(false);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const fetchTableData = async () => {
    if (!fetchData) return;
    setLoading(true);
    try {
      const response = await fetchData(currentPage, sortConfig?.key || "", sortConfig?.direction || "asc", searchTerm);
      setTableData(response.data);
      setTotalRecords(response.totalRecords);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dynamic) {
      fetchTableData();
    }
  }, [currentPage, sortConfig, searchTerm, dynamic]);

  const filteredData = tableData.filter((row) =>
    Object.values(row).some((value) => value!.toString().toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...filteredData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredData;
  }, [filteredData, sortConfig]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = sortedData.slice(indexOfFirstRow, indexOfLastRow);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return {
    currentData,
    loading,
    searchTerm,
    handleSearchChange,
    paginate,
    currentPage,
    rowsPerPage,
    totalRecords,
    requestSort,
    sortConfig,
  };
};

export default useDataTable;
