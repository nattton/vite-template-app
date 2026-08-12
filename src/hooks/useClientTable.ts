import { useMemo, useState } from "react";

export interface UseClientTableOptions<T> {
  data: T[];
  filterFn: (item: T, searchTerm: string, filterValue: string) => boolean;
  defaultPageSize?: number;
}

export function useClientTable<T>({
  data,
  filterFn,
  defaultPageSize = 50,
}: UseClientTableOptions<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const filteredData = useMemo(() => {
    return data.filter((item) => filterFn(item, searchTerm, filterValue));
  }, [data, searchTerm, filterValue, filterFn]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterChange = (val: string) => {
    setFilterValue(val);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    searchTerm,
    setSearchTerm,
    filterValue,
    setFilterValue,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    filteredData,
    paginatedData,
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
  };
}
