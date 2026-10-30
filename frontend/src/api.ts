import { Teacher } from './types';

const API_BASE = '/api/teachers';

export async function fetchTeachers(): Promise<Teacher[]> {
  const response = await fetch(API_BASE, {
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to fetch teachers (Status ${response.status})`);
  }

  return response.json();
}

export async function createTeacher(teacher: Omit<Teacher, 'id'>): Promise<Teacher> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(teacher),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to create teacher (Status ${response.status})`);
  }

  return response.json();
}

export async function updateTeacher(id: number, teacher: Omit<Teacher, 'id'>): Promise<Teacher> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(teacher),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to update teacher (Status ${response.status})`);
  }

  return response.json();
}

export async function deleteTeacher(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to delete teacher (Status ${response.status})`);
  }
}
