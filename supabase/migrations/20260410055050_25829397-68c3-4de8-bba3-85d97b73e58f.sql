
INSERT INTO storage.buckets (id, name, public) VALUES ('safari-assets', 'safari-assets', true);

CREATE POLICY "Anyone can view safari assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'safari-assets');

CREATE POLICY "Authenticated users can upload safari assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'safari-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own safari assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'safari-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own safari assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'safari-assets' AND auth.uid()::text = (storage.foldername(name))[1]);
