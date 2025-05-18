// types/cloud.ts

export interface CloudModel {
  /** Unique file ID (automatically generated as UUID) */
  id: string;

  /** Name of the file (e.g., 'invoice.pdf') */
  name: string;

  is_folder: boolean; 

  /** Public or signed Supabase Storage URL for the file */
  file_url: string;

  /** General file type (e.g., 'image', 'video', 'document', 'audio', 'other') */
  type: string;

  /** Specific MIME type (e.g., 'image/png', 'application/pdf') */
  mime_type?: string;

  /** File extension (e.g., 'png', 'mp3', 'pdf') */
  file_extension?: string | null;

  /** File size in bytes (e.g., 204800 for 200 KB) */
  size?: number;

  /** User ID (UUID) who owns the file (linked to Supabase auth.users) */
  user_id: string;

  /** Indicates whether the file is shared with others */
  is_shared?: boolean;

  /** Array of UUIDs representing users the file is shared with */
  shared_with?: string[];

  /** Marks whether the current user has liked the file */
  is_liked?: boolean;

  /** Indicates if the file is in the trash (soft deleted) */
  is_trashed?: boolean;

  /** Optional description for the file (e.g., 'Project Report Q1') */
  description?: string;

  /** Array of tags (e.g., ['work', 'important', 'Q1']) */
  tags?: string[];

  /** Name of the device used to upload the file (e.g., 'MacBook Pro') */
  device_name?: string;

  /** Origin of file (e.g., 'manual upload', 'cloud sync', 'mobile app') */
  file_origin?: string;

  /** Timestamp when the file entry was created (ISO string) */
  created_at?: string;

  /** Timestamp when the file entry was last updated (ISO string) */
  updated_at?: string;
}