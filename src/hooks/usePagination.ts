import { useState } from 'react';

const DEFAULT_PAGE_SIZE = 10;

export function usePagination(pageSize = DEFAULT_PAGE_SIZE) {
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  const totalPages = Math.ceil(total / pageSize);
  const offset = (currentPage - 1) * pageSize;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    offset,
    pageSize,
    handlePageChange,
    resetPage,
    setTotal,
  };
}
