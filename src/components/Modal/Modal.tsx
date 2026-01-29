import css from "./Modal.module.css";
import { createPortal } from "react-dom";
import { useEffect } from "react";

// Компонент Modal має створювати DOM-елемент наступної структури:
const modalRoot = document.getElementById("modal-root");

export interface ModalProps {
  //   note: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ children, onClose }: ModalProps) {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!modalRoot) return null;

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
          type="button"
        >
          x
        </button>
        {children}
      </div>
    </div>,
    modalRoot,
  );
}

// Модальне вікно має створюватись через createPortal, щоб рендерити
// модалку поза межами основного дерева компонентів, та закриватися при
// кліку на бекдроп і натисканням на клавішу Escape.
