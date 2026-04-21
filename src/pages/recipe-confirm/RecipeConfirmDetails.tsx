import { useContext, useState } from 'react';
import Context from 'context';
import { Button } from 'ui/button';
import { CheckCircleIcon, CloseIcon, TimeIcon } from 'ui/icons';
import { formatDate } from 'utils/date';
import type { IUser } from 'types/auth.types';
import type { IRecipeListItem } from 'types/recipes.types';
import { ConfirmRecipeDialog } from './ConfirmRecipeDialog';
import './recipeConfirm.css';

function fullName(
  u?: {
    first_name: string;
    middle_name: string;
    last_name: string;
  } | null,
) {
  if (!u) return '—';
  return `${u.last_name} ${u.first_name} ${u.middle_name}`.trim();
}

function shortName(
  d?: {
    first_name: string;
    middle_name: string;
    last_name: string;
  } | null,
) {
  if (!d) return '—';
  const fi = d.first_name?.trim().charAt(0);
  const mi = d.middle_name?.trim().charAt(0);
  const initials = [fi, mi]
    .filter(Boolean)
    .map((c) => `${c}.`)
    .join('');
  return `${d.last_name} ${initials}`.trim();
}

function formatNullable(value: number | null | undefined, suffix = '') {
  if (value == null || Number.isNaN(value)) return '—';
  return `${value}${suffix}`;
}

interface RecipeConfirmDetailsProps {
  recipe: IRecipeListItem;
  onClose: () => void;
  onConfirm?: () => void;
}

export function RecipeConfirmDetails({
  recipe,
  onClose,
  onConfirm,
}: RecipeConfirmDetailsProps) {
  const { currentUser } = useContext(Context) as { currentUser: IUser | null };
  const [comment, setComment] = useState('');

  const handleToggleConfirm = () => {
    onConfirm?.();
  };

  const { patient, doctor, active_substance, solvent } = recipe;
  const isPending = recipe.doctor_confirm_status === 'new';

  return (
    <div className="recipe-confirm">
      <div className="rc-card">
        <div className="rc-card__body">
          <div className="rc-card__main">
            <dl className="rd-fields">
              <div className="rd-field">
                <dt>№ Рецепта</dt>
                <dd className="rd-field__value--bold">
                  {recipe.recipe_number}
                </dd>
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
                <dd>{shortName(doctor)}</dd>
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
                  {active_substance.country && (
                    <>, {active_substance.country}</>
                  )}
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

            <div className="rc-side">
              <dl className="rd-fields">
                <div className="rd-field">
                  <dt>Пациент</dt>
                  <dd>{shortName(patient)}</dd>
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

              {/* <div className="rc-waiting">
                <TimeIcon />
                <span>{isPending ? 'Ожидает' : 'Заверено'}</span>
              </div> */}
            </div>
          </div>

          <div className="rc-comment">
            <label className="rc-comment__label" htmlFor="rc-comment-input">
              Комментарий
            </label>
            <textarea
              id="rc-comment-input"
              className="form-control rc-comment__textarea"
              placeholder="Комментарий глав. врача"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button className="primary w-100" disabled>
              Написать
            </Button>
          </div>
        </div>
      </div>

      <div className="recipe-confirm__actions">
        <Button
          className="primary has-icon"
          iconBefore={<CheckCircleIcon />}
          data-bs-toggle={isPending ? 'modal' : undefined}
          data-bs-target={isPending ? '#recipeConfirmDialog' : undefined}
          onClick={isPending ? undefined : handleToggleConfirm}
        >
          Подтвердить рецепт
        </Button>
        <Button
          className="secondary has-icon"
          iconBefore={<CloseIcon />}
          onClick={undefined}
        >
          Отклонить рецепт
        </Button>
        <Button
          className="secondary has-icon ms-auto"
          iconBefore={<CloseIcon />}
          onClick={onClose}
        >
          Скрыть подробности
        </Button>
      </div>

      <ConfirmRecipeDialog
        userFullName={fullName(currentUser)}
        recipeNumber={recipe.recipe_number}
        onConfirm={handleToggleConfirm}
      />
    </div>
  );
}
