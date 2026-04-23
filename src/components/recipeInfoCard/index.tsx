import { useContext } from 'react';
import Context from 'context';
import { ApprovalSignature } from 'ui/approvalSignature';
import { formatDate } from 'utils/date';
import { fullName, shortName } from 'utils/name';
import type { IUser } from 'types/auth.types';
import type { IRecipeListItem } from 'types/recipes.types';
import './recipeInfoCard.css';

function formatNullable(value: number | null | undefined, suffix = '') {
  if (value == null || Number.isNaN(value)) return '—';
  return `${value}${suffix}`;
}

interface RecipeInfoCardProps {
  recipe: IRecipeListItem;
}

export function RecipeInfoCard({ recipe }: RecipeInfoCardProps) {
  const { currentUser } = useContext(Context) as { currentUser: IUser | null };
  const { patient, doctor, active_substance, solvent } = recipe;

  return (
    <div className="rd-card">
      <div className="rd-card__grid">
        <dl className="rd-fields">
          <div className="rd-field">
            <dt>№ Рецепта</dt>
            <dd className="rd-field__value--bold">{recipe.recipe_number}</dd>
          </div>
          <div className="rd-field">
            <dt>№ Истории болезни</dt>
            <dd className="rd-field__value--link">
              {patient.identification_number?.trim() || '—'}
            </dd>
          </div>
          <div className="rd-field">
            <dt>Дата</dt>
            <dd>{formatDate(recipe.created_at)}</dd>
          </div>
          <div className="rd-field">
            <dt>Врач</dt>
            <dd>{shortName(doctor) || '—'}</dd>
          </div>
          <div className="rd-field">
            <dt>Отделение</dt>
            <dd>{patient.department?.trim() || '—'}</dd>
          </div>
          <div className="rd-field">
            <dt>Палата</dt>
            <dd>{patient.room_number ?? '—'}</dd>
          </div>
          <div className="rd-field">
            <dt>Действующее вещество</dt>
            <dd>
              {active_substance.name}
              {active_substance.manufacturer && (
                <> / {active_substance.manufacturer}</>
              )}
              {active_substance.country && <>, {active_substance.country}</>}
            </dd>
          </div>
          <div className="rd-field">
            <dt>Концентрация: мг/1мл</dt>
            <dd>{formatNullable(active_substance.concentration)}</dd>
          </div>
          <div className="rd-field">
            <dt>Количество Д/В в дозе: мг/мл</dt>
            <dd>
              {formatNullable(recipe.active_substance_dosage)} /{' '}
              {formatNullable(recipe.active_substance_dosage_ml)}
            </dd>
          </div>
          <div className="rd-field">
            <dt>Растворитель</dt>
            <dd>{solvent.name}</dd>
          </div>
          <div className="rd-field">
            <dt>Кол-во растворителя/мл</dt>
            <dd>{formatNullable(recipe.solvent_dosage)}</dd>
          </div>
          <div className="rd-field">
            <dt>Общий вес дозы/г</dt>
            <dd>{formatNullable(recipe.total_dosage_ml, ' (г)')}</dd>
          </div>
        </dl>

        <div className="rd-side">
          <dl className="rd-fields">
            <div className="rd-field">
              <dt>Пациент</dt>
              <dd>{shortName(patient) || '—'}</dd>
            </div>
            <div className="rd-field">
              <dt>Пол</dt>
              <dd>{patient.gender === 'male' ? 'М' : 'Ж'}</dd>
            </div>
            <div className="rd-field">
              <dt>Дата рождения</dt>
              <dd>{formatDate(patient.date_of_birth)}</dd>
            </div>
            <div className="rd-field">
              <dt>Рост пациента (см)</dt>
              <dd>{formatNullable(patient.height, ' (см)')}</dd>
            </div>
            <div className="rd-field">
              <dt>Вес пациента (кг)</dt>
              <dd>{formatNullable(patient.weight, ' (кг)')}</dd>
            </div>
          </dl>

          <ApprovalSignature
            status={recipe.doctor_confirm_status}
            role="Глав. Врач"
            name={fullName(currentUser)}
            signedAt={recipe.updated_at}
          />
        </div>
      </div>
    </div>
  );
}
