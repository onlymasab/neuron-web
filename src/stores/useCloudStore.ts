// store/cloudStore.ts
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@/lib/supabase/client';
import { CloudModel } from '@/types/CloudModel';

interface CloudStore {
  files: CloudModel[];
  uploading: boolean;
  fetchFiles: (userId: string) => Promise<void>;
  createFolder: (folderName: string, parentId?: string) => Promise<void>;
  uploadFile: (file: File, parentId?: string, onProgress?: (progress: number) => void) => Promise<void>;
  updateFile: (fileId: string, updates: Partial<CloudModel>) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  reset: () => void;
}

const supabase = createClient();

export const useCloudStore = create<CloudStore>((set) => ({
  files: [],
  uploading: false,

  fetchFiles: async (userId) => {
    const { data, error } = await supabase
      .from('cloud')
      .select('*')
      .eq('user_id', userId)
      .eq('is_trashed', false);
    if (error) {
      console.error('Fetch files error:', error);
      throw new Error(error.message);
    }
    set({ files: data });
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
      device_name: "",
      file_origin: 'manual upload',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    set((state) => ({ files: [...state.files, meta] }));

    const user = await supabase.auth.getUser();
    console.log('Supabase user for folder:', user);
    if (!user.data.user) {
      set((state) => ({
        files: state.files.map((f) =>
          f.id === folderId ? { ...f, is_trashed: true, description: 'User not authenticated' } : f
        ),
      }));
      set({ uploading: false });
      throw new Error('User not authenticated');
    }

    meta.user_id = user.data.user.id;

    const emptyFile = new File([''], '.keep', { type: 'text/plain' });
    const storagePath = `${folderId}/${folderPath}/.keep`;

    const { data, error } = await supabase.storage
      .from('cloud')
      .upload(storagePath, emptyFile, { upsert: true });

    if (error) {
      set((state) => ({
        files: state.files.map((f) =>
          f.id === folderId ? { ...f, is_trashed: true, description: error.message } : f
        ),
      }));
      set({ uploading: false });
      throw new Error(error.message);
    }

    const url = supabase.storage.from('cloud').getPublicUrl(data.path).data.publicUrl;
    meta.file_url = url;

    try {
      console.log('Inserting folder:', meta);
      const { error: dbError } = await supabase.from('cloud').insert({
        id: meta.id,
        name: meta.name,
        is_folder: meta.is_folder,
        file_url: meta.file_url,
        type: meta.type,
        mime_type: meta.mime_type,
        file_extension: meta.file_extension,
        size: meta.size,
        user_id: meta.user_id,
        is_shared: meta.is_shared,
        shared_with: meta.shared_with,
        is_liked: meta.is_liked,
        is_trashed: meta.is_trashed,
        description: meta.description,
        tags: meta.tags,
        device_name: meta.device_name,
        file_origin: meta.file_origin,
        created_at: meta.created_at,
        updated_at: meta.updated_at,
      });

      if (dbError) {
        console.error('Folder insert error:', dbError);
        set((state) => ({
          files: state.files.map((f) =>
            f.id === folderId ? { ...f, is_trashed: true, description: 'Database insert failed' } : f
          ),
        }));
        set({ uploading: false });
        throw new Error('Database insert failed');
      }

      set((state) => ({
        files: state.files.map((f) => (f.id === folderId ? meta : f)),
      }));
    } catch (dbError) {
      console.error('Folder caught error:', dbError);
      set((state) => ({
        files: state.files.map((f) =>
          f.id === folderId ? { ...f, is_trashed: true, description: 'Database insert failed' } : f
        ),
      }));
      set({ uploading: false });
      throw new Error('Database insert failed');
    }

    set({ uploading: false });
  },

  uploadFile: async (file, parentId, onProgress) => {
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
      description: "",
      tags: [],
      device_name: "",
      file_origin: 'manual upload',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    set((state) => ({ files: [...state.files, meta] }));

    const user = await supabase.auth.getUser();
    console.log('Supabase user for file:', user);
    if (!user.data.user) {
      set((state) => ({
        files: state.files.map((f) =>
          f.id === fileId ? { ...f, is_trashed: true, description: 'User not authenticated' } : f
        ),
      }));
      set({ uploading: false });
      throw new Error('User not authenticated');
    }

    meta.user_id = user.data.user.id;

    const storagePath = parentId ? `${parentId}/${file.name}` : `${fileId}/${file.name}`;
    console.log('Uploading file to:', storagePath);

    const { data, error } = await supabase.storage
      .from('cloud')
      .upload(storagePath, file, {
        upsert: true,
        onUploadProgress: (event) => {
          if (event.totalBytes && event.bytesSent) {
            const progress = (event.bytesSent / event.totalBytes) * 100;
            console.log(`Upload progress: ${progress.toFixed(2)}%`);
            if (onProgress) onProgress(progress);
          }
        },
      });

    if (error) {
      console.error('Storage upload error:', error);
      set((state) => ({
        files: state.files.map((f) =>
          f.id === fileId ? { ...f, is_trashed: true, description: error.message } : f
        ),
      }));
      set({ uploading: false });
      throw new Error(error.message);
    }

    console.log('Storage upload success:', data);
    const url = supabase.storage.from('cloud').getPublicUrl(data.path).data.publicUrl;
    meta.file_url = url;

    try {
      console.log('Inserting file:', meta);
      const { error: dbError } = await supabase.from('cloud').insert({
        id: meta.id,
        name: meta.name,
        is_folder: meta.is_folder,
        file_url: meta.file_url,
        type: meta.type,
        mime_type: meta.mime_type,
        file_extension: meta.file_extension,
        size: meta.size,
        user_id: meta.user_id,
        is_shared: meta.is_shared,
        shared_with: meta.shared_with,
        is_liked: meta.is_liked,
        is_trashed: meta.is_trashed,
        description: meta.description,
        tags: meta.tags,
        device_name: meta.device_name,
        file_origin: meta.file_origin,
        created_at: meta.created_at,
        updated_at: meta.updated_at,
      });

      if (dbError) {
        console.error('File insert error:', dbError);
        set((state) => ({
          files: state.files.map((f) =>
            f.id === fileId ? { ...f, is_trashed: true, description: 'Database insert failed' } : f
          ),
        }));
        set({ uploading: false });
        throw new Error('Database insert failed');
      }

      set((state) => ({
        files: state.files.map((f) => (f.id === fileId ? meta : f)),
      }));
    } catch (dbError) {
      console.error('File caught error:', dbError);
      set((state) => ({
        files: state.files.map((f) =>
          f.id === fileId ? { ...f, is_trashed: true, description: 'Database insert failed' } : f
        ),
      }));
      set({ uploading: false });
      throw new Error('Database insert failed');
    }

    set({ uploading: false });
  },

  updateFile: async (fileId, updates) => {
    const { error } = await supabase
      .from('cloud')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', fileId);

    if (error) {
      console.error('Update file error:', error);
      throw new Error(error.message);
    }

    set((state) => ({
      files: state.files.map((f) =>
        f.id === fileId ? { ...f, ...updates, updated_at: new Date().toISOString() } : f
      ),
    }));
  },

  deleteFile: async (fileId) => {
    const { error } = await supabase
      .from('cloud')
      .update({ is_trashed: true, updated_at: new Date().toISOString() })
      .eq('id', fileId);

    if (error) {
      console.error('Delete file error:', error);
      throw new Error(error.message);
    }

    set((state) => ({
      files: state.files.map((f) =>
        f.id === fileId ? { ...f, is_trashed: true, updated_at: new Date().toISOString() } : f
      ),
    }));
  },

  reset: () => set({ files: [], uploading: false }),
}));