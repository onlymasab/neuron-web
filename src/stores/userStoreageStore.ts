import { create } from 'zustand';
import { supabase } from '@/lib/supabase/client';

interface StorageState {
  uploadFile: (bucket: string, filePath: string, file: File) => Promise<string | null>;
  deleteFile: (bucket: string, filePath: string) => Promise<boolean>;
  getPublicUrl: (bucket: string, filePath: string) => string | null;
}

export const useStorageStore = create<StorageState>((set, get) => ({
  uploadFile: async (bucket, filePath, file) => {
    try {
      const { data, error } = await supabase
        .storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) {
        console.error('Upload error:', error);
        return null;
      }

      const publicUrl = get().getPublicUrl(bucket, filePath);
      console.log('Uploaded file public URL:', publicUrl);
      return publicUrl;
    } catch (err) {
      console.error('Upload exception:', err);
      return null;
    }
  },

  deleteFile: async (bucket, filePath) => {
    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) {
        console.error('Delete error:', error);
        return false;
      }
      console.log('File deleted:', filePath);
      return true;
    } catch (err) {
      console.error('Delete exception:', err);
      return false;
    }
  },

  getPublicUrl: (bucket, filePath) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return data?.publicUrl || null;
  },
}));