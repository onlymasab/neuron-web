// Import required packages and modules
import { create } from 'zustand'; // Zustand for state management
import { v4 as uuidv4 } from 'uuid'; // To generate unique IDs
import { createClient } from '@/lib/supabase/client'; // Supabase client setup
import { CloudModel } from '@/types/CloudModel'; // Type definition for a cloud file/folder

// Define the shape of the CloudStore state and its actions
interface CloudStore {
  files: CloudModel[]; // List of files/folders
  uploading: boolean; // Uploading state indicator
  fetchFiles: (userId: string) => Promise<void>; // Fetch user files
  createFolder: (folderName: string, parentId?: string) => Promise<void>; // Create a new folder
  uploadFile: (file: File, parentId?: string, onProgress?: (progress: number) => void) => Promise<void>; // Upload a file
  updateFile: (fileId: string, updates: Partial<CloudModel>) => Promise<void>; // Update file metadata
  deleteFile: (fileId: string) => Promise<void>; // Soft delete a file
  reset: () => void; // Reset store state
}

const supabase = createClient(); // Initialize Supabase client

// Create Zustand store
export const useCloudStore = create<CloudStore>((set) => ({
  files: [], // Initial empty list of files
  uploading: false, // Initially not uploading

  // Fetch files for a specific user
  fetchFiles: async (userId) => {
    const { data, error } = await supabase
      .from('cloud') // From "cloud" table
      .select('*') // Select all columns
      .eq('user_id', userId) // Match user ID
      .eq('is_trashed', false); // Only show non-deleted files

    if (error) {
      console.error('Fetch files error:', error);
      throw new Error(error.message);
    }
    set({ files: data }); // Set fetched files to state
  },

  // Create a folder
  createFolder: async (folderName, parentId) => {
    set({ uploading: true }); // Set uploading to true

    const folderId = uuidv4(); // Generate unique folder ID
    const folderPath = parentId ? `${parentId}/${folderName}` : folderName; // Path structure

    // Folder metadata
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

    // Optimistically add folder to UI
    set((state) => ({ files: [...state.files, meta] }));

    const user = await supabase.auth.getUser(); // Get current user
    console.log('Supabase user for folder:', user);

    if (!user.data.user) {
      // Mark folder as trashed if user not found
      set((state) => ({
        files: state.files.map((f) =>
          f.id === folderId ? { ...f, is_trashed: true, description: 'User not authenticated' } : f
        ),
      }));
      set({ uploading: false });
      throw new Error('User not authenticated');
    }

    meta.user_id = user.data.user.id; // Assign user ID to metadata

    const emptyFile = new File([''], '.keep', { type: 'text/plain' }); // Dummy file
    const storagePath = `${folderId}/${folderPath}/.keep`; // Dummy file path to reserve folder

    // Upload .keep file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('cloud')
      .upload(storagePath, emptyFile, { upsert: true });

    if (error) {
      // Mark folder as trashed if storage upload fails
      set((state) => ({
        files: state.files.map((f) =>
          f.id === folderId ? { ...f, is_trashed: true, description: error.message } : f
        ),
      }));
      set({ uploading: false });
      throw new Error(error.message);
    }

    // Get public URL of the uploaded dummy file
    const url = supabase.storage.from('cloud').getPublicUrl(data.path).data.publicUrl;
    meta.file_url = url;

    try {
      console.log('Inserting folder:', meta);

      // Insert folder metadata into database
      const { error: dbError } = await supabase.from('cloud').insert(meta);

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

      // Update state with final meta data
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
      throw new Error('Database insert failed');
    }

    set({ uploading: false }); // Reset uploading state
  },

  // Upload file
  uploadFile: async (file, parentId, onProgress) => {
    set({ uploading: true });

    const fileId = uuidv4(); // Unique file ID
    const filePath = parentId ? `${parentId}/${file.name}` : file.name; // Full path in folder structure

    // File metadata
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

    set((state) => ({ files: [...state.files, meta] })); // Optimistic update

    const user = await supabase.auth.getUser(); // Get user
    console.log('Supabase user for file:', user);

    if (!user.data.user) {
      // Mark as trashed if user not found
      set((state) => ({
        files: state.files.map((f) =>
          f.id === fileId ? { ...f, is_trashed: true, description: 'User not authenticated' } : f
        ),
      }));
      set({ uploading: false });
      throw new Error('User not authenticated');
    }

    meta.user_id = user.data.user.id; // Assign user ID

    const storagePath = parentId ? `${parentId}/${file.name}` : `${fileId}/${file.name}`;
    console.log('Uploading file to:', storagePath);

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from('cloud')
      .upload(storagePath, file, {
        upsert: true,
        onUploadProgress: (event) => {
          if (event.totalBytes && event.bytesSent) {
            const progress = (event.bytesSent / event.totalBytes) * 100;
            console.log(`Upload progress: ${progress.toFixed(2)}%`);
            if (onProgress) onProgress(progress); // Progress callback
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

    const url = supabase.storage.from('cloud').getPublicUrl(data.path).data.publicUrl;
    meta.file_url = url;

    try {
      console.log('Inserting file:', meta);

      // Insert file metadata into DB
      const { error: dbError } = await supabase.from('cloud').insert(meta);

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
      throw new Error('Database insert failed');
    }

    set({ uploading: false });
  },

  // Update file metadata
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

  // Soft delete file
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

  // Reset state
  reset: () => set({ files: [], uploading: false }),
}));