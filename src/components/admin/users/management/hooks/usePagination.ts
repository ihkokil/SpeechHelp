
import { useState, useCallback, useMemo } from 'react';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export const usePagination = <T>(items: T[], initialPageSize: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(items.length / pageSize));
  }, [items.length, pageSize]);
  
  // Adjust current page if it exceeds total pages
  useMemo(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  
  // Get current page items
  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }, [items, currentPage, pageSize]);
  
  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  // Handle page size change
  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    // Reset to first page when changing page size
    setCurrentPage(1);
  }, []);
  
  return {
    currentPage,
    pageSize,
    totalPages,
    currentItems,
    handlePageChange,
    handlePageSizeChange,
    paginationState: {
      currentPage,
      pageSize,
      totalPages
    }
  };
};
