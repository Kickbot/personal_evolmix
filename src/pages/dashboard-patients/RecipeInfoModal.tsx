import { createPortal } from 'react-dom';
import { RecipeInfoCard } from 'components/recipeInfoCard';
import type { IRecipeListItem } from 'types/recipes.types';

interface RecipeInfoModalProps {
  recipe: IRecipeListItem | null;
}

export function RecipeInfoModal({ recipe }: RecipeInfoModalProps) {
  return createPortal(
    <div
      className="modal fade"
      id="recipeInfoModal"
      tabIndex={-1}
      aria-labelledby="recipeInfoModalLabel"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="recipeInfoModalLabel">
              {recipe ? `Рецепт № ${recipe.recipe_number}` : ''}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
            {recipe && <RecipeInfoCard recipe={recipe} />}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
