import { useState } from "react";
import css from "./App.module.css";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import Modal from "../Modal/Modal";
import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import { useQuery } from "@tanstack/react-query";
import { getNotes } from "../../services/noteService";
import { Toaster } from "react-hot-toast";

const PER_PAGE = 12;

export default function App() {
  const [inputValue, setInputValue] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const debouncedQuery = useDebouncedCallback((value: string) => {
    setQuery(value.trim());
    setCurrentPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, query],
    queryFn: () =>
      getNotes({
        page: currentPage,
        perPage: PER_PAGE,
        search: query,
      }),
    placeholderData: (prev) => prev,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox
            value={inputValue}
            onChange={(value) => {
              setInputValue(value);
              debouncedQuery(value);
            }}
          />

          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />

          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        </header>
        {/* Додайте умову, щоб компонент NoteList рендерився 
        лише в тому випадку, якщо в колекції нотаток є хоча б один елемент. */}
        {isLoading && (
          <strong className={css.loading}> Loading notes...</strong>
        )}

        {isError && (
          <strong className={css.loading}>Something went wrong…</strong>
        )}

        {notes.length > 0 && !isLoading && <NoteList notes={notes} />}

        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onCancel={closeModal} />
          </Modal>
        )}
      </div>
      <Toaster position="top-right" />

      {/* Користувач може шукати нотатки за допомогою текстового поля, 
      при зміні значення якого на бекенд відправляється запит для отримання нотаток, 
      які підходять під пошук. Для цього до запиту потрібно додати параметр search із 
      текстовим значенням для пошуку:

GET https://notehub-public.goit.study/api/notes?search=mysearchtext

Обов’язково зробіть відкладений пошук з use-debounce, щоб не виконувати запит 
на кожний введений символ. Хук useDebounce варто використовувати саме в Арр і 
передавати відкладене пошукове слово у залежності в useQuery. */}
    </>
  );
}
