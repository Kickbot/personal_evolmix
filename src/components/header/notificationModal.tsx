import './notificationModal.css';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button, IconButton } from 'ui/button';
import { CloseIcon } from 'ui/icons/CloseIcon';
import type { INotificationSection } from 'types/notifications.types';
import { cn } from 'utils';

interface NotificationModalProps {
  sections: INotificationSection[];
}

export function NotificationModal({ sections }: NotificationModalProps) {
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
              Уведомления
            </h5>
            <IconButton
              type="button"
              className="button-icon ms-auto"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <CloseIcon />
            </IconButton>
          </div>

          <div className="modal-body">
            {sections.length === 0 && (
              <p className="text-center text-muted">Нет уведомлений</p>
            )}

            {sections.map((section) => {
              const renderedItems =
                !section.isLoading &&
                section.items.map((item) => {
                  const itemClassName = item.className ?? 'approval-user-card';
                  if (item.href) {
                    return (
                      <Link
                        key={item.id}
                        to={item.href}
                        className={itemClassName}
                        data-bs-dismiss="modal"
                      >
                        {item.content}
                      </Link>
                    );
                  }
                  return (
                    <article key={item.id} className={itemClassName}>
                      {item.content}
                      {item.actions && item.actions.length > 0 && (
                        <div className="approval-user-card__actions">
                          {item.actions.map((action) => (
                            <Button
                              key={action.label}
                              type="button"
                              className={`${action.variant} has-icon`}
                              iconBefore={action.icon}
                              onClick={action.onClick}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </article>
                  );
                });

              return (
                <section
                  className={cn('approval-section', section.className)}
                  key={section.key}
                >
                  <h6 className="approval-section__title">{section.title}</h6>
                  {section.error && (
                    <div className="alert alert-danger mb-0" role="alert">
                      {section.error}
                    </div>
                  )}
                  {section.itemsClassName ? (
                    <div className={section.itemsClassName}>
                      {renderedItems}
                    </div>
                  ) : (
                    renderedItems
                  )}
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
