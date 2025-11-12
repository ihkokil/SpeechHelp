-- Create RLS policies for images bucket to allow users to manage their own profile images
CREATE POLICY "Users can view all images" ON storage.objects 
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Users can upload their own profile images" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile images" ON storage.objects 
FOR UPDATE USING (
  bucket_id = 'images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile images" ON storage.objects 
FOR DELETE USING (
  bucket_id = 'images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);