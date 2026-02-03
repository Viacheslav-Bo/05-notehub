import axios from "axios";
import type { Note, NoteTag } from "../types/note";
// import { number, string } from "yup";

const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;

// Інтерфейси, які описують відповіді http-запитів (FetchNotesResponse і т.д.)
// та параметри функцій, які виконують http-запити у — src/services/noteService.ts.

// Функції для виконання HTTP-запитів винесіть в окремий файл src/services/noteService.ts.
// Типізуйте їх параметри, результат, який вони повертають, та відповідь від Axios.
// У вас мають бути наступні функції:

// fetchNotes : має виконувати запит для отримання колекції нотаток із сервера.
// Повинна підтримувати пагінацію (через параметр сторінки) та фільтрацію за ключовим словом (пошук);

// createNote: має виконувати запит для створення нової нотатки на сервері.
// Приймає вміст нової нотатки та повертає створену нотатку у відповіді;

// deleteNote: має виконувати запит для видалення нотатки за заданим ідентифікатором.
// Приймає ID нотатки та повертає інформацію про видалену нотатку у відповіді.

export interface FetchNoteParams {
  page: number;
  perPage: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
  page: number;
  perPage: number;
  totalItems: number;
}

export interface CreateNotePayload {
  title: string;
  content?: string;
  tag: NoteTag;
}

export interface UpdateNotePayload {
  id: string;
  title?: string;
  content?: string;
  tag?: NoteTag;
}

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${myKey}`,
  },
});

export const getNotes = async (
  params: FetchNoteParams,
): Promise<FetchNotesResponse> => {
  const res = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page: params.page,
      perPage: params.perPage,
      ...(params.search ? { search: params.search } : {}),
    },
  });
  return res.data;
};

export const deleteNote = async (noteId: string) => {
  const res = await api.delete<Note>(`/notes/${noteId}`);
  return res.data;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const res = await api.post<Note>("/notes", payload);
  return res.data;
};

export const updateNote = async ({
  id,
  ...patch
}: UpdateNotePayload): Promise<Note> => {
  const res = await api.patch<Note>(`/notes/${id}`, patch);
  return res.data;
};
