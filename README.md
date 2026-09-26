# NoteHub

GoIT homework 05: React + TypeScript notes application built with Vite.

## Development

Run `npm ci`, copy `.env.example` to `.env`, set your existing `VITE_NOTEHUB_TOKEN`, then run `npm run dev`.

## Checks

- `npm run lint`
- `npm run build`
- `npm run format:check`
- `git diff --check`

## Architecture

- `src/types/note.ts` contains only shared Note and NoteTag entity types.
- `src/services/noteService.ts` contains FetchNotesResponse, request parameters, payloads, and typed Axios API functions.
- QueryClientProvider is configured in main.tsx. TanStack Query owns server data and invalidates notes after mutations.
- App uses useDebouncedCallback (350 ms) and resets the page when search changes. Pages contain 12 notes.
- Formik and Yup validate title (required, 3–50 characters), content (maximum 500), and the five allowed tags.
- The portal modal supports Escape, backdrop, Cancel, focus trapping and restoration.
- Creating a note returns to the first unfiltered page. Deleting the last note on a later page returns to the previous page.
- Every component has a separate folder, default export, and matching CSS Module.

CSS Modules come from the [official GoIT hw-05 styles](https://github.com/goitacademy/react-notehub-styles/tree/hw-05/styles). Only whitespace is formatted with Prettier; style declarations are unchanged. API follows the [official documentation](https://notehub-public.goit.study/api/docs/).

## Deployment

Set VITE_NOTEHUB_TOKEN in Vercel Production (and Preview if used), then deploy again. Never commit `.env`.
