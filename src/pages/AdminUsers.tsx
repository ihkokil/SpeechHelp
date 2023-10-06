
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  SearchIcon, 
  RefreshCwIcon, 
  EditIcon, 
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';

const USERS_PER_PAGE = 10;

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const { toast } = useToast();
  const { adminUser } = useAdmin();

  const fetchUsers = async () => {
    if (!adminUser) return;
    
    setIsLoading(true);
    
    try {
      // First, count total users for pagination
      let countQuery = supabase
        .from('profiles')
        .select('id', { count: 'exact' });
      
      // Apply filters to count query
      if (activeFilter !== 'all') {
        const isActive = activeFilter === 'active';
        countQuery = countQuery.eq('is_active', isActive);
      }
      
      if (planFilter !== 'all') {
        countQuery = countQuery.eq('subscription_plan', planFilter);
      }
      
      if (search) {
        // Search by username as emails are in auth.users which isn't directly accessible
        countQuery = countQuery.ilike('username', `%${search}%`);
      }
      
      const { count, error: countError } = await countQuery;
      
      if (countError) {
        console.error('Error counting users:', countError);
        return;
      }
      
      setTotalPages(Math.ceil((count || 0) / USERS_PER_PAGE));
      
      // Now fetch the actual user data with pagination
      let query = supabase
        .from('profiles')
        .select(`
          id,
          username,
          avatar_url,
          subscription_plan,
          subscription_start_date,
          subscription_end_date,
          is_active,
          created_at
        `)
        .range((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE - 1);
      
      // Apply the same filters to the data query
      if (activeFilter !== 'all') {
        const isActive = activeFilter === 'active';
        query = query.eq('is_active', isActive);
      }
      
      if (planFilter !== 'all') {
        query = query.eq('subscription_plan', planFilter);
      }
      
      if (search) {
        query = query.ilike('username', `%${search}%`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching users:', error);
        return;
      }
      
      if (data) {
        // Set email placeholder since we can't directly access auth.users
        const usersWithEmail = data.map(user => ({
          ...user,
          email: `user-${user.id.substring(0, 8)}@example.com` // Placeholder email
        }));
        
        setUsers(usersWithEmail);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [adminUser, page, search, activeFilter, planFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setEditSheetOpen(true);
  };

  const updateUserSubscription = async (userId: string, subscriptionData: any) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_plan: subscriptionData.plan,
          subscription_start_date: subscriptionData.startDate,
          subscription_end_date: subscriptionData.endDate,
          is_active: subscriptionData.isActive
        })
        .eq('id', userId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "User updated",
        description: "User subscription details have been updated successfully",
      });
      
      fetchUsers();
      setEditSheetOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Update failed",
        description: "There was a problem updating the user",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const UserEditSheet = () => {
    const [plan, setPlan] = useState(selectedUser?.subscription_plan || 'free');
    const [isActive, setIsActive] = useState(selectedUser?.is_active !== false);
    const [startDate, setStartDate] = useState(selectedUser?.subscription_start_date || '');
    const [endDate, setEndDate] = useState(selectedUser?.subscription_end_date || '');
    
    useEffect(() => {
      if (selectedUser) {
        setPlan(selectedUser.subscription_plan || 'free');
        setIsActive(selectedUser.is_active !== false);
        setStartDate(selectedUser.subscription_start_date || '');
        setEndDate(selectedUser.subscription_end_date || '');
      }
    }, [selectedUser]);
    
    const handleSave = () => {
      if (!selectedUser) return;
      
      updateUserSubscription(selectedUser.id, {
        plan,
        startDate,
        endDate,
        isActive
      });
    };
    
    if (!selectedUser) return null;
    
    return (
      <Sheet open={editSheetOpen} onOpenChange={setEditSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit User</SheetTitle>
            <SheetDescription>
              Update subscription and account status for {selectedUser.email || selectedUser.username}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">User Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-gray-500">Username</span>
                  <p className="font-medium">{selectedUser.username}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Email</span>
                  <p className="font-medium">{selectedUser.email || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">User ID</span>
                  <p className="text-xs font-mono truncate">{selectedUser.id}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Created</span>
                  <p className="font-medium">{formatDate(selectedUser.created_at)}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Subscription Details</h3>
              
              <div className="space-y-2">
                <label className="text-sm">Subscription Plan</label>
                <Select value={plan} onValueChange={setPlan}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Start Date</label>
                  <Input
                    type="date"
                    value={startDate ? new Date(startDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm">End Date</label>
                  <Input
                    type="date"
                    value={endDate ? new Date(endDate).toISOString().split('T')[0] : ''}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm">Account Status</label>
                <Select value={isActive ? 'active' : 'inactive'} onValueChange={(value) => setIsActive(value === 'active')}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button onClick={handleSave}>Save Changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search by username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-60 pl-9"
            />
          </form>
          <div className="flex gap-2">
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => fetchUsers()}
              disabled={isLoading}
            >
              <RefreshCwIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username || '-'}</TableCell>
                      <TableCell>{user.email || '-'}</TableCell>
                      <TableCell>
                        {user.is_active !== false ? (
                          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={
                            user.subscription_plan === 'premium' 
                              ? 'bg-purple-100 text-purple-800 hover:bg-purple-100' 
                              : user.subscription_plan === 'enterprise' 
                                ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' 
                                : ''
                          }
                        >
                          {user.subscription_plan || 'Free'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <EditIcon className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* User Edit Sheet */}
      <UserEditSheet />
    </div>
  );
};

export default AdminUsers;
