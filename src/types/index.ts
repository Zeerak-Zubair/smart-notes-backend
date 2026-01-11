export interface Folder {
  id: number;
  created_at: string;
  title: string;
  user_id: string;
}

export interface CreateFolderDTO {
  title: string;
  user_id: string;
}

export interface UpdateFolderDTO {
  title?: string;
}

export interface Notebook {
  id: number;
  created_at: string;
  title: string;
  description: string;
  color: string;
  updated_at: string;
  folder_id: number;
  order_index: number;
}

export interface CreateNotebookDTO {
  title: string;
  description: string;
  color: string;
  folder_id: number;
  order_index: number;
}

export interface UpdateNotebookDTO {
  title?: string;
  description?: string;
  color?: string;
}

export interface Note {
  id: number;
  created_at: string;
  notebook_id: number;
  content: string | null;
  order_index: number | null;
  updated_at: string | null;
}

export interface CreateNoteDTO {
  notebook_id: number;
  content?: string;
  order_index?: number;
}

export interface UpdateNoteDTO {
  content?: string;
  notebook_id?: number;
  order_index?: number;
}

export interface Profile {
  id: number;
  created_at: string;
  name: string;
  avatar_url: string;
  updated_at: string | null;
  email: string;
  user_id: string | null;
}

export interface CreateProfileDTO {
  name: string;
  email: string;
  avatar_url?: string;
  user_id?: string;
}

export interface UpdateProfileDTO {
  name: string;
  user_id: string;
}
