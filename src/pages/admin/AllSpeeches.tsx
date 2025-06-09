import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Search, Eye, Calendar, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { adminSpeechService } from '@/services/adminSpeechService';
import { Speech } from '@/types/speech';

interface SpeechWithUser extends Speech {
  user_email?: string;
  user_name?: string;
}

const AllSpeeches: React.FC = () => {
  const [speeches, setSpeeches] = useState<SpeechWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeech, setSelectedSpeech] = useState<SpeechWithUser | null>(null);

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

  const filteredSpeeches = speeches.filter(speech =>
    speech.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speech.speech_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (speech.user_email && speech.user_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (speech.user_name && speech.user_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (selectedSpeech) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" onClick={handleCloseView}>
              ← Back to All Speeches
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Speech Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedSpeech.title}</h3>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge className={getSpeechTypeColor(selectedSpeech.speech_type)}>
                    {getSpeechTypeLabel(selectedSpeech.speech_type)}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {selectedSpeech.user_name || selectedSpeech.user_email || 'Unknown User'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4 border-t">
                <div>
                  <p className="text-sm font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Created
                  </p>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedSpeech.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Modified
                  </p>
                  <p className="text-sm text-muted-foreground">{formatDate(selectedSpeech.updated_at)}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Content</h4>
                <div className="bg-gray-50 rounded-md p-4 max-h-64 overflow-y-auto">
                  <div className="whitespace-pre-wrap text-sm">
                    {selectedSpeech.content}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All Speeches ({filteredSpeeches.length})
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
                {searchTerm ? 'Try adjusting your search criteria.' : 'No speeches have been created yet.'}
              </p>
            </div>
          ) : (
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
                {filteredSpeeches.map((speech) => (
                  <TableRow key={speech.id}>
                    <TableCell className="font-medium">{speech.title}</TableCell>
                    <TableCell>
                      <Badge className={getSpeechTypeColor(speech.speech_type)}>
                        {getSpeechTypeLabel(speech.speech_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AllSpeeches;
