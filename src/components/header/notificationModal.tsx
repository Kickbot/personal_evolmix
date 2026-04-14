import { CheckCircleIcon } from 'ui/icons/CheckCircleIcon';
import './notificationModal.css';
import { useEffect, useRef } from 'react';
import { Button } from 'ui/button';
import { CloseIcon } from 'ui/icons/CloseIcon';
import { TimeIcon } from 'ui/icons/TimeIcon';

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
            <section className="approval-section">
              <article className="approval-user-card">
                <div className="approval-user-card__left">
                  {/* <span className="approval-user-card__role-badge">
                    Глав. Врач
                  </span> */}
                  <h6 className="approval-user-card__title">Доктор</h6>
                  <p className="approval-user-card__name">
                    Иванов Иван Иванович
                  </p>
                  <a
                    href="mailto:main.doctor@g.com"
                    className="approval-user-card__email"
                  >
                    main.doctor@g.com
                  </a>
                  <div className="approval-user-card__meta">
                    <span>Регистрация:</span> <strong>23.02.2026</strong>
                  </div>
                </div>

                <div className="approval-user-card__actions">
                  <Button
                    type="button"
                    className="primary has-icon"
                    iconBefore={<CheckCircleIcon />}
                  >
                    Подтвердить
                  </Button>
                  <Button
                    type="button"
                    className="secondary has-icon justify-content-start"
                    iconBefore={<CloseIcon />}
                  >
                    Отменить
                  </Button>
                </div>
              </article>
              <article className="approval-user-card">
                <div className="approval-user-card__left">
                  <h6 className="approval-user-card__title">Администратор</h6>
                  <p className="approval-user-card__name">
                    Иванов Иван Иванович
                  </p>
                  <a
                    href="mailto:main.doctor@g.com"
                    className="approval-user-card__email"
                  >
                    main.doctor@g.com
                  </a>
                  <div className="approval-user-card__meta">
                    <span>Регистрация:</span> <strong>23.02.2026</strong>
                  </div>
                </div>

                <div className="approval-user-card__actions">
                  <Button
                    type="button"
                    className="primary has-icon"
                    iconBefore={<CheckCircleIcon />}
                  >
                    Подтвердить
                  </Button>
                  <Button
                    type="button"
                    className="secondary has-icon justify-content-start"
                    iconBefore={<CloseIcon />}
                  >
                    Отменить
                  </Button>
                </div>
              </article>
            </section>

            <section className="approval-section gap-1">
              <h6 className="approval-section__title">Новые рецепты:</h6>

              <div className="recipe-approval-list">
                {['36275e22-d4c', '36275e22-d4c', '36275e22-d4c'].map(
                  (id, idx) => (
                    <article
                      key={`${id}-${idx}`}
                      className="recipe-approval-card"
                    >
                      <span className="recipe-approval-card__badge">Новый</span>
                      <span className="recipe-approval-card__id">{id}</span>
                      {/* <span className="recipe-approval-card__status">
                        Ожидает
                      </span> */}
                      <Button
                        type="button"
                        className="secondary has-icon recipe-approval-card__status"
                        iconBefore={<TimeIcon />}
                      >
                        Ожидает
                      </Button>
                    </article>
                  ),
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
