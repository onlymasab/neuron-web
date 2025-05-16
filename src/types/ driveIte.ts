import { DriveItem } from "@/stores/useDriveStore";

export type SharedItem = {
  items: DriveItem | null;
  permission: 'view' | 'edit';
};