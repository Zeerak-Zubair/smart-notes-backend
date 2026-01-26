

export interface Notebook {
  id: string;
  created_at: string;
  title: string;
  description: string;
  color: string;
  updated_at: string;
  user_id: string;
  order_index: number;
}

export interface CreateNotebookDTO {
  title: string;
  description: string;
  color: string;
  order_index: number;
}

export interface UpdateNotebookDTO {
  title?: string;
  description?: string;
  color?: string;
}

export interface Note {
  id: string;
  created_at: string;
  notebook_id: string;
  content: string | null;
  order_index: number | null;
  updated_at: string | null;
}

export interface CreateNoteDTO {
  notebook_id: string;
  content?: string;
  order_index?: number;
}

export interface UpdateNoteDTO {
  content?: string;
  notebook_id?: string;
  order_index?: number;
}

export interface Profile {
  created_at: string;
  name: string;
  avatar_url: string;
  updated_at: string | null;
  email: string;
  user_id: string;
}

export interface CreateProfileDTO {
  name: string;
  email: string;
  avatar_url?: string;
}

export interface UpdateProfileDTO {
  name: string;
}
