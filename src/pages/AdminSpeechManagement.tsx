
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Search, 
  MoreHorizontal, 
  Download, 
  Trash2, 
  Eye, 
  Edit, 
  FilterIcon 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// Define the speech type
interface Speech {
  id: string;
  user_id: string;
  title: string;
  content: string;
  speech_type: string;
  created_at: string;
  updated_at: string;
  user_email?: string;
}

const AdminSpeechManagement = () => {
  const [speeches, setSpeeches] = useState<Speech[]>([]);
  const [filteredSpeeches, setFilteredSpeeches] = useState<Speech[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [speechTypes, setSpeechTypes] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchSpeeches();
  }, []);

  useEffect(() => {
    filterSpeeches();
  }, [searchQuery, selectedType, speeches]);

  const fetchSpeeches = async () => {
    setIsLoading(true);
    try {
      // Get all speeches
      const { data, error } = await supabase
        .from('speeches')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Get user emails for each speech
      const speechesWithUserInfo = await Promise.all(
        (data || []).map(async (speech) => {
          const { data: userData } = await supabase.auth.admin.getUserById(speech.user_id);
          return {
            ...speech,
            user_email: userData?.user?.email || 'Unknown'
          };
        })
      );
      
      setSpeeches(speechesWithUserInfo);
      
      // Extract unique speech types
      const types = [...new Set(speechesWithUserInfo.map(s => s.speech_type))];
      setSpeechTypes(types);
      
    } catch (error) {
      console.error('Error fetching speeches:', error);
      toast({
        title: "Error",
        description: "Failed to fetch speeches. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterSpeeches = () => {
    let filtered = [...speeches];
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const lowercaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(speech => 
        speech.title.toLowerCase().includes(lowercaseQuery) ||
        speech.content.toLowerCase().includes(lowercaseQuery) ||
        (speech.user_email && speech.user_email.toLowerCase().includes(lowercaseQuery))
      );
    }
    
    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(speech => speech.speech_type === selectedType);
    }
    
    setFilteredSpeeches(filtered);
  };

  const handleDeleteSpeech = async (speechId: string) => {
    try {
      const { error } = await supabase
        .from('speeches')
        .delete()
        .eq('id', speechId);
      
      if (error) throw error;
      
      // Update local state
      setSpeeches(prevSpeeches => prevSpeeches.filter(speech => speech.id !== speechId));
      
      toast({
        title: "Success",
        description: "Speech has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting speech:', error);
      toast({
        title: "Error",
        description: "Failed to delete speech. Please try again.",
        variant: "destructive"
      });
    }
  };

  const exportSpeeches = () => {
    try {
      const dataStr = JSON.stringify(filteredSpeeches, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'speeches.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Success",
        description: "Speeches exported successfully.",
      });
    } catch (error) {
      console.error('Error exporting speeches:', error);
      toast({
        title: "Error",
        description: "Failed to export speeches. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FileText className="h-6 w-6 mr-2 text-purple-600" />
            <h1 className="text-2xl font-bold">Speech Management</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={exportSpeeches}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Speeches</CardTitle>
            <CardDescription>
              View and manage all user-created speeches.
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search speeches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <FilterIcon className="h-4 w-4 text-gray-500" />
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  {speechTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={6}>
                          <div className="animate-pulse flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-200 mr-4"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredSpeeches.length > 0 ? (
                    filteredSpeeches.map((speech) => (
                      <TableRow key={speech.id}>
                        <TableCell className="font-medium">
                          {speech.title.length > 30 
                            ? `${speech.title.substring(0, 30)}...` 
                            : speech.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {speech.speech_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{speech.user_email}</TableCell>
                        <TableCell>
                          {new Date(speech.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {new Date(speech.updated_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => console.log("View", speech.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Speech
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => console.log("Edit", speech.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Speech
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem onClick={(e) => e.preventDefault()} className="text-red-600">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Speech
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete this
                                      speech and remove it from our servers.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={() => handleDeleteSpeech(speech.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No speeches found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSpeechManagement;
