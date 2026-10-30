export interface Teacher {
  id?: number;
  name: string;
  dob: string; // ISO date string 'YYYY-MM-DD'
  ph: string;
}

export type ModalMode = 'create' | 'edit' | null;

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}
