// Import required packages and modules
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/lib/supabase/client';
import { CloudModel } from '@/types/CloudModel';

interface CloudStore {
  files: CloudModel[];
  uploading: boolean;
  loading: boolean;
  fetchFiles: (userId: string) => Promise<void>;
  createFolder: (folderName: string, parentId?: string) => Promise<void>;
  uploadFile: (file: File, parentId?: string, onProgress?: (progress: number) => void) => Promise<void>;
  updateFile: (fileId: string, updates: Partial<CloudModel>) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  reset: () => void;
}

const supabase = createClient();

export const useCloudStore = create<CloudStore>((set, get) => {
  let channel: any = null; // To store the realtime channel

  return {
    files: [],
    uploading: false,
    loading: false,

    fetchFiles: async (userId) => {
      set({ loading: true });

      const { data, error } = await supabase
        .from('cloud')
        .select('*')
        .eq('user_id', userId)
        .eq('is_trashed', false);

      if (error) {
        console.error('Fetch files error:', error);
        set({ loading: false });
        throw new Error(error.message);
      }

      set({ files: data, loading: false });

      // Setup realtime listener only once
      if (!channel) {
        channel = supabase
          .channel(`realtime-cloud-${userId}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'cloud', filter: `user_id=eq.${userId}` }, (payload) => {
            console.log('Realtime change:', payload);

            const currentFiles = get().files;

            if (payload.eventType === 'INSERT') {
              set({ files: [...currentFiles, payload.new as CloudModel] });
            }

            if (payload.eventType === 'UPDATE') {
              set({
                files: currentFiles.map((f) => (f.id === payload.new.id ? payload.new as CloudModel : f)),
              });
            }

            if (payload.eventType === 'DELETE') {
              set({
                files: currentFiles.filter((f) => f.id !== payload.old.id),
              });
            }
          })
          .subscribe((status) => {
            console.log('Realtime subscription status:', status);
          });
      }
    },

    createFolder: async (folderName, parentId) => {
      set({ uploading: true });

      const folderId = uuidv4();
      const folderPath = parentId ? `${parentId}/${folderName}` : folderName;

      const meta: CloudModel = {
        id: folderId,
        name: folderPath,
        is_folder: true,
        file_url: '',
        type: 'folder',
        mime_type: 'folder',
        file_extension: null,
        size: 0,
        user_id: '',
        is_shared: false,
        shared_with: [],
        is_liked: false,
        is_trashed: false,
        description: '',
        tags: [],
        device_name: '',
        file_origin: 'manual upload',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        set({ uploading: false });
        throw new Error('User not authenticated');
      }

      meta.user_id = user.data.user.id;

      const emptyFile = new File([''], '.keep', { type: 'text/plain' });
      const storagePath = `${folderId}/${folderPath}/.keep`;

      const { data, error } = await supabase.storage.from('cloud').upload(storagePath, emptyFile, { upsert: true });

      if (error) {
        set({ uploading: false });
        throw new Error(error.message);
      }

      const url = supabase.storage.from('cloud').getPublicUrl(data.path).data.publicUrl;
      meta.file_url = url;

      const { error: dbError } = await supabase.from('cloud').insert(meta);

      if (dbError) {
        set({ uploading: false });
        throw new Error('Database insert failed');
      }

      set({ uploading: false });
    },

    uploadFile: async (file, parentId) => {
      set({ uploading: true });

      const fileId = uuidv4();
      const filePath = parentId ? `${parentId}/${file.name}` : file.name;

      const meta: CloudModel = {
        id: fileId,
        name: filePath,
        is_folder: false,
        file_url: '',
        type: file.type.split('/')[0] || 'other',
        mime_type: file.type,
        file_extension: file.name.split('.').pop() || null,
        size: file.size,
        user_id: '',
        is_shared: false,
        shared_with: [],
        is_liked: false,
        is_trashed: false,
        description: '',
        tags: [],
        device_name: '',
        file_origin: 'manual upload',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        set({ uploading: false });
        throw new Error('User not authenticated');
      }

      meta.user_id = user.data.user.id;

      const storagePath = `${fileId}/${file.name}`;

      const { data, error } = await supabase.storage.from('cloud').upload(storagePath, file, { upsert: true });

      if (error) {
        set({ uploading: false });
        throw new Error(error.message);
      }

      const url = supabase.storage.from('cloud').getPublicUrl(data.path).data.publicUrl;
      meta.file_url = url;

      const { error: dbError } = await supabase.from('cloud').insert(meta);

      if (dbError) {
        set({ uploading: false });
        throw new Error('Database insert failed');
      }

      set({ uploading: false });
    },

    updateFile: async (fileId, updates) => {
      if (!fileId) throw new Error('Invalid file ID provided');
      set({ loading: true });

      const updatedAt = new Date().toISOString();
      const { error } = await supabase
        .from('cloud')
        .update({ ...updates, updated_at: updatedAt })
        .eq('id', fileId);

      if (error) {
        set({ loading: false });
        throw new Error(error.message);
      }

      set({ loading: false });
    },

    deleteFile: async (fileId) => {
      set({ loading: true });

      const { error } = await supabase
        .from('cloud')
        .update({ is_trashed: true, updated_at: new Date().toISOString() })
        .eq('id', fileId);

      if (error) {
        set({ loading: false });
        throw new Error(error.message);
      }

      set({ loading: false });
    },

    reset: () => {
      set({ files: [], uploading: false, loading: false });
      if (channel) {
        channel.unsubscribe();
        channel = null;
      }
    },
  };
});