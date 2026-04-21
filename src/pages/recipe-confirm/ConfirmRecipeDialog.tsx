import { Button, IconButton } from 'ui/button';
import { CheckCircleIcon, CloseIcon } from 'ui/icons';

interface ConfirmRecipeDialogProps {
  userFullName: string;
  recipeNumber: string;
  onConfirm: () => void;
}

export function ConfirmRecipeDialog({
  userFullName,
  recipeNumber,
  onConfirm,
}: ConfirmRecipeDialogProps) {
  return (
    <div
      className="modal fade"
      id="recipeConfirmDialog"
      tabIndex={-1}
      aria-labelledby="recipeConfirmDialogLabel"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rc-dialog">
          <div className="modal-header">
            <h5 className="modal-title" id="recipeConfirmDialogLabel">
              Внимание!
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
            <p className="rc-dialog__text">
              Подтверждая данный рецепт, я Глав.Врач (должность){' '}
              <strong>{userFullName}</strong> даю свое согласие на использование
              рецепта <strong>№{recipeNumber}</strong>
            </p>

            <div className="rc-dialog__actions">
              <Button
                className="primary has-icon"
                iconBefore={<CheckCircleIcon />}
                data-bs-dismiss="modal"
                onClick={onConfirm}
              >
                Подтвердить
              </Button>
              <Button
                className="secondary has-icon"
                iconBefore={<CloseIcon />}
                data-bs-dismiss="modal"
              >
                Отменить
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
