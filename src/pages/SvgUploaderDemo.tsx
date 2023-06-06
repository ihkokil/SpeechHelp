
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SvgUploader from '@/components/common/SvgUploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Footer from '@/components/Footer';

const SvgUploaderDemo = () => {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-12">SVG File Uploader</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Upload SVG Files</CardTitle>
              <CardDescription>
                Upload your SVG files to Supabase storage. The files will be stored securely and can be used throughout the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <SvgUploader 
                onSuccess={(url) => setUploadedUrl(url)}
                buttonText="Upload SVG File"
              />
              
              {uploadedUrl && (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <Label htmlFor="svgUrl">SVG URL (Copy to use anywhere)</Label>
                    <Input 
                      id="svgUrl" 
                      value={uploadedUrl} 
                      readOnly 
                      onClick={(e) => (e.target as HTMLInputElement).select()} 
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">How to use uploaded SVGs:</h2>
            <ol className="list-decimal ml-5 space-y-2">
              <li>Upload your SVG file using the uploader above</li>
              <li>Copy the generated URL</li>
              <li>Use the URL in your application's img src attribute or as a background image</li>
              <li>The SVG is now accessible across your entire application</li>
            </ol>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SvgUploaderDemo;
