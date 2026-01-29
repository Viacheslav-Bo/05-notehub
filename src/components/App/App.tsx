import { useState } from "react";
import css from "./App.module.css";
import ReactPaginate from "react-paginate";
import SearchBox from "../SearchBox/SearchBox";
import { useDebounce } from "use-debounce";
import Modal from "../Modal/Modal";
import NoteForm, { NoteFormValues } from "../NoteForm/NoteForm";

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedQuery] = useDebounce(query.trim(), 300);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateNote = (values: NoteFormValues) => {
    console.log("create note:", values);
    closeModal();
  };

  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox value={query} onChange={setQuery} />
          {/* Компонент SearchBox */}
          {/* <ReactPaginate
            pageCount={data?.total_pages ?? 0}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            // selected + 1, бо в лібі починається з 0. просто шоб синхронізувати
            onPageChange={({ selected }) => setCurrentPage(selected + 1)}
            // те саме і для -1
            forcePage={currentPage - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
            renderOnZeroPageCount={null}
          /> */}
          <button className={css.button} onClick={openModal}>
            Create note +
          </button>
        </header>
        {/* Додайте умову, щоб компонент NoteList рендерився 
        лише в тому випадку, якщо в колекції нотаток є хоча б один елемент. */}

        {isModalOpen && (
          <Modal onClose={closeModal}>
            <NoteForm onCancel={closeModal} onSubmit={handleCreateNote} />
          </Modal>
        )}
      </div>

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
