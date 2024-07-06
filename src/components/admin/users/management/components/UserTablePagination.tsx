
import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserTablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  totalItems: number;
}

const UserTablePagination: React.FC<UserTablePaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalItems
}) => {
  // Generate page numbers, show only 5 pages at a time with ellipsis for others
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    if (totalPages > 0) {
      pages.push(1);
    }
    
    // Calculate range to show
    let startPage = Math.max(currentPage - 1, 2);
    let endPage = Math.min(currentPage + 1, totalPages - 1);
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pages.push('ellipsis-start');
    }
    
    // Add pages in the middle
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pages.push('ellipsis-end');
    }
    
    // Always show last page if more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  const pageSizeOptions = [10, 25, 50, 100];
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalItems);

  return (
    <div className="flex flex-col-reverse md:flex-row items-center justify-between px-4 py-4 border-t">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4 md:mt-0">
        <div>
          Showing {startItem}-{endItem} of {totalItems} users
        </div>
        <div className="flex items-center gap-2">
          <span>Show</span>
          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>per page</span>
        </div>
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {getPageNumbers().map((page, index) => (
            page === 'ellipsis-start' || page === 'ellipsis-end' ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <span className="flex h-9 w-9 items-center justify-center text-sm">
                  ...
                </span>
              </PaginationItem>
            ) : (
              <PaginationItem key={`page-${page}`}>
                <PaginationLink 
                  isActive={page === currentPage}
                  onClick={() => onPageChange(Number(page))}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              className={currentPage === totalPages || totalPages === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default UserTablePagination;
