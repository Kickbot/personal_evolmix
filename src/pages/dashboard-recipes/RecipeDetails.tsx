import { useContext } from 'react';
import Context from 'context';
import { Button } from 'ui/button';
import { ArchiveIcon, CloseIcon } from 'ui/icons';
import { RecipeInfoCard } from 'components/recipeInfoCard';
import { formatDate } from 'utils/date';
import { fullName } from 'utils/name';
import type { IUser } from 'types/auth.types';
import type { IRecipeListItem } from 'types/recipes.types';

interface RecipeDetailsProps {
  recipe: IRecipeListItem;
  onClose: () => void;
  onArchive: () => void;
}

export function RecipeDetails({ recipe, onClose, onArchive }: RecipeDetailsProps) {
  const { currentUser } = useContext(Context) as { currentUser: IUser | null };

  return (
    <div className="dt-details p-4">
      <div className="row g-3">
        <div className="col-xxl-9">
          <RecipeInfoCard recipe={recipe} />
        </div>

        <div className="col-xxl-3">
          <div className="rd-comment">
            <div className="rd-comment__title">Комментарий Глав. врача</div>
            <div className="rd-comment__placeholder">
              <div className="rd-comment__header">
                <span>{fullName(currentUser) || '—'}</span>
                <span>{formatDate(recipe.updated_at)}</span>
              </div>
              <div className="rd-comment__body">
                Комментарий появится после подтверждения.
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="dt-details-btn">
            <Button className="primary has-icon" disabled>
              Взять в работу
            </Button>
            <Button
              className="bordered has-icon"
              iconAfter={<ArchiveIcon />}
              onClick={onArchive}
            >
              {recipe.is_archived ? 'Восстановить из архива' : 'Переместить в архив'}
            </Button>
            <Button
              className="secondary has-icon ms-auto"
              iconBefore={<CloseIcon />}
              onClick={onClose}
            >
              Закрыть
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
