import { useState } from 'react';
import { useAuth, Speech } from '@/contexts/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ButtonCustom } from '@/components/ui/button-custom';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { EditIcon, Trash2Icon, EyeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PreviousSpeeches = () => {
  const { speeches, updateSpeech, deleteSpeech } = useAuth();
  const [selectedSpeech, setSelectedSpeech] = useState<Speech | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const navigate = useNavigate();

  const handleViewSpeech = (speech: Speech) => {
    setSelectedSpeech(speech);
    setIsViewModalOpen(true);
  };

  const handleEditSpeech = (speech: Speech) => {
    setSelectedSpeech(speech);
    setEditTitle(speech.title);
    setEditContent(speech.content);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedSpeech) return;
    
    try {
      await updateSpeech(selectedSpeech.id, editTitle, editContent);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating speech:', error);
    }
  };

  const handleDeleteSpeech = (speech: Speech) => {
    setSelectedSpeech(speech);
    setIsDeleteAlertOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSpeech) return;
    
    try {
      await deleteSpeech(selectedSpeech.id);
      setIsDeleteAlertOpen(false);
    } catch (error) {
      console.error('Error deleting speech:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy h:mm a');
  };

  const getSpeechTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'wedding': 'Wedding Speech',
      'graduation': 'Graduation Speech',
      'birthday': 'Birthday Speech',
      'business': 'Business Speech',
      'tedtalk': 'TED Talk',
      'motivational': 'Motivational Speech',
      'funeral': 'Funeral Speech',
      'keynote': 'Keynote Address',
      'social': 'Social Speech',
      'farewell': 'Farewell Speech',
      'other': 'Other Speech'
    };
    
    return typeMap[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'wedding': 'bg-pink-100 text-pink-800',
      'graduation': 'bg-blue-100 text-blue-800',
      'birthday': 'bg-purple-100 text-purple-800',
      'business': 'bg-slate-100 text-slate-800',
      'tedtalk': 'bg-red-100 text-red-800',
      'motivational': 'bg-amber-100 text-amber-800',
      'funeral': 'bg-gray-100 text-gray-800',
      'keynote': 'bg-emerald-100 text-emerald-800',
      'social': 'bg-indigo-100 text-indigo-800',
      'farewell': 'bg-cyan-100 text-cyan-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    
    return colorMap[type] || 'bg-gray-100 text-gray-800';
  };

  const handleCreateNewSpeech = () => {
    navigate('/speech-lab');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold text-gray-800">Previous Speeches</h2>
        <ButtonCustom 
          variant="pink" 
          size="sm" 
          onClick={handleCreateNewSpeech}
        >
          Create New Speech
        </ButtonCustom>
      </div>
      
      {speeches.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500 mb-4">You haven't created any speeches yet.</p>
          <ButtonCustom 
            variant="outline" 
            onClick={handleCreateNewSpeech}
          >
            Create Your First Speech
          </ButtonCustom>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {speeches.map((speech) => (
              <TableRow key={speech.id}>
                <TableCell className="font-medium">{speech.title}</TableCell>
                <TableCell>
                  <Badge className={getTypeColor(speech.speech_type)}>
                    {getSpeechTypeLabel(speech.speech_type)}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(speech.created_at)}</TableCell>
                <TableCell>{formatDate(speech.updated_at)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleViewSpeech(speech)}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditSpeech(speech)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteSpeech(speech)}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      {/* View Speech Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{selectedSpeech?.title}</DialogTitle>
            <DialogDescription>
              {selectedSpeech && (
                <Badge className={getTypeColor(selectedSpeech.speech_type)}>
                  {getSpeechTypeLabel(selectedSpeech.speech_type)}
                </Badge>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="whitespace-pre-line border rounded-md p-4 bg-gray-50 overflow-auto max-h-[50vh]">
            {selectedSpeech?.content}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Created: {selectedSpeech && formatDate(selectedSpeech.created_at)} | 
            Last updated: {selectedSpeech && formatDate(selectedSpeech.updated_at)}
          </div>
          <DialogFooter>
            <ButtonCustom 
              variant="outline" 
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </ButtonCustom>
            <ButtonCustom 
              variant="default" 
              onClick={() => {
                setIsViewModalOpen(false);
                if (selectedSpeech) handleEditSpeech(selectedSpeech);
              }}
            >
              Edit
            </ButtonCustom>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Speech Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit Speech</DialogTitle>
            <DialogDescription>
              Make changes to your speech and save when you're ready.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="editTitle" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="editTitle"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="editContent" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="editContent"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[300px]"
              />
            </div>
          </div>
          <DialogFooter>
            <ButtonCustom 
              variant="outline" 
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </ButtonCustom>
            <ButtonCustom 
              variant="default" 
              onClick={handleSaveEdit}
            >
              Save Changes
            </ButtonCustom>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              speech "{selectedSpeech?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PreviousSpeeches;
