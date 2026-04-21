import { TimeIcon } from 'ui/icons';

interface RecipeApprovalCardProps {
  recipeNumber: string;
}

export function RecipeApprovalCard({ recipeNumber }: RecipeApprovalCardProps) {
  return (
    <>
      <span className="recipe-approval-card__badge">Новый</span>
      <span className="recipe-approval-card__id">{recipeNumber}</span>
      <span className="recipe-approval-card__status">
        <TimeIcon />
        Ожидает
      </span>
    </>
  );
}
