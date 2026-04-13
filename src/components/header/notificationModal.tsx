import './notificationModal.css';
import { useEffect, useRef } from 'react';

export function NotificationModal() {
  const modalRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) {
      return;
    }
    const handleHide = () => {
      const activeElement = document.activeElement as HTMLElement | null;
      if (activeElement && modalElement.contains(activeElement)) {
        activeElement.blur();
      }
    };
    const handleHidden = () => {
      const trigger = document.getElementById('notificationTrigger');
      if (trigger instanceof HTMLElement) {
        trigger.focus();
      }
    };
    modalElement.addEventListener('hide.bs.modal', handleHide);
    modalElement.addEventListener('hidden.bs.modal', handleHidden);
    return () => {
      modalElement.removeEventListener('hide.bs.modal', handleHide);
      modalElement.removeEventListener('hidden.bs.modal', handleHidden);
    };
  }, []);

  return (
    <div
      ref={modalRef}
      className="modal fade"
      id="notificationModal"
      tabIndex={-1}
      aria-labelledby="notificationModalLabel"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="notificationModalLabel">
            Запрос на утверждение
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body">

          </div>
        </div>
      </div>
    </div>
  );
}
