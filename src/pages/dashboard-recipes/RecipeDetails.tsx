import { useContext } from 'react';
import Context from 'context';
import { Button } from 'ui/button';
import { ArchiveIcon, CloseIcon, CheckCircleIcon, TimeIcon } from 'ui/icons';
import { formatDate } from 'utils/date';
import { fullName, shortName } from 'utils/name';
import type { IUser } from 'types/auth.types';
import type {
  IRecipeListItem,
  IRecipeDoctorConfirmStatus,
} from 'types/recipes.types';

interface RecipeDetailsProps {
  recipe: IRecipeListItem;
  onClose: () => void;
  onArchive: () => void;
}

const CONFIRM_LABELS: Record<IRecipeDoctorConfirmStatus, string> = {
  new: 'Ожидает',
  confirmed_by_doctor: 'Заверено',
  rejected_by_doctor: 'Отклонено',
};

function formatNullable(value: number | null | undefined, suffix = '') {
  if (value == null || Number.isNaN(value)) return '—';
  return `${value}${suffix}`;
}

export function RecipeDetails({ recipe, onClose, onArchive }: RecipeDetailsProps) {
  const { currentUser } = useContext(Context) as { currentUser: IUser | null };
  const { patient, doctor, active_substance, solvent } = recipe;
  const status = recipe.doctor_confirm_status;

  return (
    <div className="dt-details p-4">
      <div className="row g-3">
        <div className="col-xxl-9">
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

                <div className={`rd-signature rd-signature--${status}`}>
                  <div className="rd-signature__icon">
                    {status === 'confirmed_by_doctor' && <CheckCircleIcon />}
                    {status === 'new' && <TimeIcon />}
                    {status === 'rejected_by_doctor' && <CloseIcon />}
                  </div>
                  <div className="rd-signature__label">
                    {CONFIRM_LABELS[status]}
                  </div>
                  <div className="rd-signature__role">Глав. Врач</div>
                  <div className="rd-signature__name">{fullName(currentUser) || '—'}</div>
                  <div className="rd-signature__date">
                    <span>Подписано:</span>
                    <span>{formatDate(recipe.updated_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
