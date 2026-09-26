import { useCallback, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { deleteNote, fetchNotes } from '../../services/noteService';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import css from './App.module.css';
const perPage = 12;
export default function App() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const closeModal = useCallback((): void => setIsModalOpen(false), []);
  const updateSearch = useDebouncedCallback((value: string): void => {
    setSearch(value.trim());
    setPage(1);
  }, 350);
  const notesQuery = useQuery({
    queryKey: ['notes', page, perPage, search],
    queryFn: ({ signal }) => fetchNotes({ page, perPage, search, signal }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: async () => {
      if (notesQuery.data?.notes.length === 1 && page > 1) setPage(page - 1);
      await queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
  const handleCreated = (): void => {
    updateSearch.cancel();
    setSearchInput('');
    setSearch('');
    setPage(1);
    closeModal();
  };
  const data = notesQuery.data;
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={searchInput}
          onChange={(value: string): void => {
            setSearchInput(value);
            updateSearch(value);
          }}
        />
        {data && data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        )}
        <button
          type="button"
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>
      {notesQuery.isPending && <p role="status">Loading notes…</p>}
      {notesQuery.isFetching && !notesQuery.isPending && (
        <p role="status">Updating notes…</p>
      )}
      {notesQuery.isError && (
        <p role="alert">
          Could not load notes.{' '}
          <button type="button" onClick={() => void notesQuery.refetch()}>
            Try again
          </button>
        </p>
      )}
      {deleteMutation.isError && (
        <p role="alert">Could not delete the note. Please try again.</p>
      )}
      {data && data.notes.length > 0 && (
        <NoteList
          notes={data.notes}
          onDelete={(id: string): void => deleteMutation.mutate(id)}
          deletingId={
            deleteMutation.isPending ? deleteMutation.variables : undefined
          }
        />
      )}
      {notesQuery.isSuccess && data?.notes.length === 0 && (
        <p role="status">No notes found.</p>
      )}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} onSuccess={handleCreated} />
        </Modal>
      )}
    </div>
  );
}
