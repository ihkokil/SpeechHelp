
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, Check, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

interface SvgUploaderProps {
  onSuccess?: (url: string) => void;
  showPreview?: boolean;
  buttonText?: string;
}

const SvgUploader: React.FC<SvgUploaderProps> = ({ 
  onSuccess, 
  showPreview = true,
  buttonText = "Upload SVG"
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an SVG
    if (!file.type.includes('svg')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an SVG file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      // Generate a unique file name
      const fileName = `${Date.now()}-${file.name}`;
      
      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from('svg_files')
        .upload(fileName, file);
        
      if (error) throw error;
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('svg_files')
        .getPublicUrl(data.path);
        
      // Set the preview and call onSuccess callback
      setPreviewUrl(publicUrl);
      if (onSuccess) onSuccess(publicUrl);
      
      toast({
        title: "Upload successful",
        description: "SVG file has been uploaded",
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload SVG file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Require authentication
  if (!user) {
    return (
      <div className="p-4 border rounded-md bg-amber-50 text-amber-700">
        <p className="flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          Please sign in to upload SVG files
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <input 
        type="file"
        accept=".svg"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      
      <Button
        onClick={triggerFileInput}
        disabled={isUploading}
        variant="outline"
        className="w-full"
      >
        {isUploading ? (
          <span className="flex items-center">
            <div className="h-4 w-4 border-2 border-t-transparent border-pink-600 rounded-full animate-spin mr-2" />
            Uploading...
          </span>
        ) : (
          <span className="flex items-center">
            <Upload className="h-4 w-4 mr-2" />
            {buttonText}
          </span>
        )}
      </Button>
      
      {showPreview && previewUrl && (
        <div className="mt-4 p-4 border rounded-md">
          <p className="text-sm font-medium mb-2 flex items-center text-green-600">
            <Check className="h-4 w-4 mr-1" /> Upload successful
          </p>
          <div className="bg-slate-50 p-3 rounded-md flex justify-center">
            <img 
              src={previewUrl} 
              alt="Uploaded SVG" 
              className="max-h-48 object-contain" 
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 break-all">
            {previewUrl}
          </p>
        </div>
      )}
    </div>
  );
};

export default SvgUploader;
