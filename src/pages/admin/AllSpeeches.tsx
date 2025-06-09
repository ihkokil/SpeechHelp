import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Search, Eye, Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { adminSpeechService } from '@/services/adminSpeechService';
import { Speech } from '@/types/speech';
import SpeechPagination from '@/components/admin/speeches/SpeechPagination';
import SpeechFilters from '@/components/admin/speeches/SpeechFilters';
import SpeechDetailView from '@/components/admin/speeches/SpeechDetailView';

interface SpeechWithUser extends Speech {
  user_email?: string;
  user_name?: string;
}

const ITEMS_PER_PAGE = 10;

const AllSpeeches: React.FC = () => {
  const [speeches, setSpeeches] = useState<SpeechWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeech, setSelectedSpeech] = useState<SpeechWithUser | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');

  useEffect(() => {
    loadAllSpeeches();
  }, []);

  const loadAllSpeeches = async () => {
    setIsLoading(true);
    try {
      console.log('Loading all speeches for admin view');
      const allSpeeches = await adminSpeechService.fetchAllSpeeches();
      console.log('Loaded speeches:', allSpeeches.length);
      setSpeeches(allSpeeches);
    } catch (error) {
      console.error('Error loading speeches:', error);
      setSpeeches([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique users for filter
  const uniqueUsers = useMemo(() => {
    const users = speeches.reduce((acc, speech) => {
      const userId = speech.user_id;
      const userName = speech.user_name;
      const userEmail = speech.user_email;
      
      if (!acc.find(u => u.id === userId)) {
        acc.push({
          id: userId,
          name: userName || userEmail || 'Unknown User',
          email: userEmail || ''
        });
      }
      return acc;
    }, [] as Array<{ id: string; name: string; email: string }>);
    
    return users.sort((a, b) => a.name.localeCompare(b.name));
  }, [speeches]);

  // Filter and search speeches
  const filteredSpeeches = useMemo(() => {
    return speeches.filter(speech => {
      const matchesSearch = (
        speech.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        speech.speech_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (speech.user_email && speech.user_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (speech.user_name && speech.user_name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      const matchesType = selectedType === 'all' || speech.speech_type === selectedType;
      const matchesUser = selectedUser === 'all' || speech.user_id === selectedUser;
      
      return matchesSearch && matchesType && matchesUser;
    });
  }, [speeches, searchTerm, selectedType, selectedUser]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredSpeeches.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSpeeches = filteredSpeeches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP p');
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return 'Invalid date';
    }
  };

  const getSpeechTypeColor = (speechType: string) => {
    const colors = {
      wedding: 'bg-pink-100 text-pink-800',
      business: 'bg-blue-100 text-blue-800',
      birthday: 'bg-yellow-100 text-yellow-800',
      graduation: 'bg-green-100 text-green-800',
      funeral: 'bg-gray-100 text-gray-800',
      motivational: 'bg-purple-100 text-purple-800',
      informative: 'bg-indigo-100 text-indigo-800',
      entertaining: 'bg-orange-100 text-orange-800',
      persuasive: 'bg-red-100 text-red-800',
      introduction: 'bg-teal-100 text-teal-800',
      farewell: 'bg-amber-100 text-amber-800',
      award: 'bg-emerald-100 text-emerald-800',
      retirement: 'bg-slate-100 text-slate-800',
      keynote: 'bg-violet-100 text-violet-800',
      tedtalk: 'bg-cyan-100 text-cyan-800',
      social: 'bg-lime-100 text-lime-800',
      other: 'bg-neutral-100 text-neutral-800'
    };
    return colors[speechType as keyof typeof colors] || colors.other;
  };

  const getSpeechTypeLabel = (speechType: string) => {
    return speechType.charAt(0).toUpperCase() + speechType.slice(1);
  };

  const handleViewSpeech = (speech: SpeechWithUser) => {
    setSelectedSpeech(speech);
  };

  const handleCloseView = () => {
    setSelectedSpeech(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleClearFilters = () => {
    setSelectedType('all');
    setSelectedUser('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, selectedUser, searchTerm]);

  if (selectedSpeech) {
    return (
      <SpeechDetailView
        speech={selectedSpeech}
        onBack={handleCloseView}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">All Speeches</h1>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search speeches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
        </div>
      </div>

      <SpeechFilters
        selectedType={selectedType}
        selectedUser={selectedUser}
        users={uniqueUsers}
        onTypeChange={setSelectedType}
        onUserChange={setSelectedUser}
        onClearFilters={handleClearFilters}
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All Speeches ({filteredSpeeches.length})
            {filteredSpeeches.length !== speeches.length && (
              <span className="text-sm text-muted-foreground">
                of {speeches.length} total
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2 animate-spin" />
                <p className="text-muted-foreground">Loading speeches...</p>
              </div>
            </div>
          ) : filteredSpeeches.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">No speeches found</p>
              <p className="text-sm text-muted-foreground">
                {searchTerm || selectedType !== 'all' || selectedUser !== 'all' 
                  ? 'Try adjusting your search criteria or filters.' 
                  : 'No speeches have been created yet.'
                }
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Modified</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSpeeches.map((speech) => (
                    <TableRow key={speech.id}>
                      <TableCell className="font-medium max-w-xs truncate" title={speech.title}>
                        {speech.title}
                      </TableCell>
                      <TableCell>
                        <Badge className={getSpeechTypeColor(speech.speech_type)}>
                          {getSpeechTypeLabel(speech.speech_type)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={speech.user_name || speech.user_email}>
                        {speech.user_name || speech.user_email || 'Unknown User'}
                      </TableCell>
                      <TableCell>{formatDate(speech.created_at)}</TableCell>
                      <TableCell>{formatDate(speech.updated_at)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewSpeech(speech)}
                          className="h-8 w-8 p-0"
                          title="View speech"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <SpeechPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllSpeeches;
