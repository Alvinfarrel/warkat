export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio?: string | null;
  createdAt: string;
}

export interface AttachmentItem {
  id: string;
  type: "IMAGE" | "AUDIO";
  fileUrl: string;
  fileName: string;
  fileSize: number;
  duration?: number | null;
  createdAt: string;
}

export interface LetterItem {
  id: string;
  userId: string;
  senderName?: string | null;
  content: string;
  presetStyle: string;
  isRead: boolean;
  isFavorite: boolean;
  createdAt: string;
  attachments: AttachmentItem[];
}
