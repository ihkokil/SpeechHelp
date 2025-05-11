
import { useMemo, useState } from 'react';
import { User } from '../../types';
import { usePagination } from './usePagination';

interface UseUserTablePaginationProps {
  users: User[];
  searchTerm: string;
  filterUsers: (users: User[], searchTerm: string) => User[];
}

export const useUserTablePagination = ({ 
  users, 
  searchTerm, 
  filterUsers 
}: UseUserTablePaginationProps) => {
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter users based on search term
  const filteredUsers = useMemo(() => 
    filterUsers(users, searchTerm), 
    [users, searchTerm, filterUsers]
  );

  // Initialize pagination with filtered users count
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    resetPagination,
    hasNextPage,
    hasPreviousPage
  } = usePagination({
    totalItems: filteredUsers.length,
    itemsPerPage,
    initialPage: 1
  });

  // Get paginated users
  const paginatedUsers = useMemo(() => {
    const { startIndex, endIndex } = paginatedData;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, paginatedData]);

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    resetPagination(); // Reset to first page when changing items per page
  };

  // Reset pagination when search term changes
  const handleSearchChange = () => {
    resetPagination();
  };

  return {
    // Paginated data
    paginatedUsers,
    filteredUsers,
    
    // Pagination state
    currentPage,
    totalPages,
    itemsPerPage,
    hasNextPage,
    hasPreviousPage,
    
    // Pagination controls
    goToPage,
    handleItemsPerPageChange,
    handleSearchChange,
    
    // Stats
    totalFilteredItems: filteredUsers.length,
    totalItems: users.length
  };
};
