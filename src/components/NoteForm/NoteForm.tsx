import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote, type CreateNotePayload } from '../../services/noteService';
import type { NoteTag } from '../../types/note';
import css from './NoteForm.module.css';
import { noteSchema, tags } from './noteSchema';
interface NoteFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}
const initialValues: CreateNotePayload = {
  title: '',
  content: '',
  tag: 'Todo',
};
export default function NoteForm({ onCancel, onSuccess }: NoteFormProps) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
      onSuccess();
    },
  });
  const handleSubmit = async (
    values: CreateNotePayload,
    helpers: FormikHelpers<CreateNotePayload>,
  ): Promise<void> => {
    try {
      await mutation.mutateAsync(values);
    } catch {
      helpers.setSubmitting(false);
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={noteSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form} noValidate>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              name="title"
              type="text"
              className={css.input}
              aria-describedby="title-error"
            />
            <ErrorMessage
              id="title-error"
              name="title"
              component="span"
              className={css.error}
            />
          </div>
          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
              aria-describedby="content-error"
            />
            <ErrorMessage
              id="content-error"
              name="content"
              component="span"
              className={css.error}
            />
          </div>
          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field
              as="select"
              id="tag"
              name="tag"
              className={css.select}
              aria-describedby="tag-error"
            >
              {tags.map((tag: NoteTag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </Field>
            <ErrorMessage
              id="tag-error"
              name="tag"
              component="span"
              className={css.error}
            />
          </div>
          {mutation.isError && (
            <p role="alert" className={css.error}>
              Could not create the note. Please try again.
            </p>
          )}
          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || mutation.isPending}
            >
              {isSubmitting ? 'Creating…' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
