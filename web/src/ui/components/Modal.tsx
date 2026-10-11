import { type ReactNode, useEffect, useRef } from 'react'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
}

/** Native <dialog> so focus trapping and Esc-to-close come for free. */
export function Modal({ title, onClose, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  // No close() on cleanup: React StrictMode runs effects twice in development,
  // and closing fires the dialog's `close` event, which would dismiss the modal
  // the instant it opened. Unmounting removes the dialog from the top layer anyway.
  useEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  return (
    <dialog
      ref={ref}
      className="modal panel"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      onKeyDown={(e) => e.stopPropagation()}
      aria-label={title}
    >
      <header className="modal__head">
        <h2 className="pixel">{title}</h2>
        <button type="button" className="btn modal__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </header>
      <div className="modal__body">{children}</div>
    </dialog>
  )
}
