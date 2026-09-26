import type { Note } from '../../types/note';
import css from './NoteList.module.css';
interface NoteListProps {
  notes: Note[];
  onDelete: (id: Note['id']) => void;
  deletingId?: Note['id'];
}
export default function NoteList({
  notes,
  onDelete,
  deletingId,
}: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((note: Note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              type="button"
              className={css.button}
              disabled={deletingId !== undefined}
              onClick={() => onDelete(note.id)}
            >
              {deletingId === note.id ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
