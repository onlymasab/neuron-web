export type DriveItemType = 'file' | 'folder';

export interface DriveItem {
  id: string;
  name: string;
  type: DriveItemType;
  parent_id: string | null;
  owner_id: string;
  path: string; // e.g., cloud/user_id/folder_id/filename.ext
  is_trashed: boolean;
  size: number | null;
  mime_type: string | null;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>; // for preview image, tags, etc.
}