import * as Yup from 'yup';
import type { CreateNotePayload } from '../../services/noteService';
import type { NoteTag } from '../../types/note';

export const tags: NoteTag[] = [
  'Todo',
  'Work',
  'Personal',
  'Meeting',
  'Shopping',
];

export const noteSchema: Yup.ObjectSchema<CreateNotePayload> = Yup.object({
  title: Yup.string()
    .min(3, 'Title must be at least 3 characters')
    .max(50, 'Title must be at most 50 characters')
    .required('Title is required'),
  content: Yup.string()
    .max(500, 'Content must be at most 500 characters')
    .defined(),
  tag: Yup.mixed<NoteTag>()
    .oneOf(tags, 'Select a valid tag')
    .required('Tag is required'),
});
