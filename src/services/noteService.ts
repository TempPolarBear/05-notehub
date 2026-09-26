import axios, { type AxiosResponse } from 'axios';
import type { Note, NoteTag } from '../types/note';

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  signal?: AbortSignal;
}
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}
const noteApi = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: { Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}` },
});
export async function fetchNotes({
  signal,
  ...params
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const response: AxiosResponse<FetchNotesResponse> = await noteApi.get(
    '/notes',
    { params, signal },
  );
  return response.data;
}
export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const response: AxiosResponse<Note> = await noteApi.post('/notes', payload);
  return response.data;
}
export async function deleteNote(id: Note['id']): Promise<Note> {
  const response: AxiosResponse<Note> = await noteApi.delete(`/notes/${id}`);
  return response.data;
}
