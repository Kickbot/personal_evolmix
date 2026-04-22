import { useContext, useState, useEffect } from 'react';
import Context from 'context';
import ROLES from 'const/roles';
import type { IPatientListItem } from 'types/patients.types';
import type { IRecipeListItem } from 'types/recipes.types';
import { Button } from 'ui/button';
import { ArchiveIcon, CloseIcon, EditIcon } from 'ui/icons';
import { StatusBadge } from 'ui/statusBadge';
import { recipe } from 'api';
import Loader from 'ui/loader';
import { shortName } from 'utils/name';

const GENDER_SHORT: Record<string, string> = {
  male: 'М',
  female: 'Ж',
};

function formatNullable(value: number | null, suffix = ''): string {
  if (value == null || Number.isNaN(value)) return '—';
  return `${value}${suffix}`;
}

interface PatientDetailsProps {
  patient: IPatientListItem;
  onClose: () => void;
  onArchive: () => void;
  onEdit: (patient: IPatientListItem) => void;
}

export function PatientDetails({
  patient,
  onClose,
  onArchive,
  onEdit,
}: PatientDetailsProps) {
  const { currentUser } = useContext(Context) as {
    currentUser: { role: string };
  };
  const canEdit =
    currentUser?.role === ROLES.DOCTOR ||
    currentUser?.role === ROLES.HEAD_DOCTOR ||
    currentUser?.role === ROLES.ADMIN;
  const genderLabel = GENDER_SHORT[patient.gender] ?? patient.gender;
  const [recipes, setRecipes] = useState<IRecipeListItem[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(false);

  useEffect(() => {
    const fetchPatientRecipes = async () => {
      setIsLoadingRecipes(true);
      try {
        const response = await recipe.postSearchRecipe({
          patient_id: patient.id,
          limit: 10,
          offset: 0,
        }) as { recipes: IRecipeListItem[] };
        setRecipes(response.recipes || []);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      } finally {
        setIsLoadingRecipes(false);
      }
    };

    fetchPatientRecipes();
  }, [patient.id]);

  return (
    <div className="dt-details p-4">
      <div className="row">
        {/* Left block — patient card */}
        <div className="col-md-6 col-xxl-5">
          <div className="pd-card">
            {canEdit && (
              <button
                className="pd-card__edit-btn"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#addPatientModal"
                onClick={() => onEdit(patient)}
              >
                <EditIcon />
              </button>
            )}

            <div className="pd-card__body">
              <div className="pd-card__left">
                <div className="pd-card__name">
                  <span>{patient.last_name}</span>
                  <span>{patient.first_name}</span>
                  <span>{patient.middle_name}</span>
                </div>
                <StatusBadge
                  status={patient.is_archived ? 'archived' : 'active'}
                  className="pd-status w-100"
                />
                <div className="pd-card__stats">
                  <div>
                    Пол: <span>{genderLabel}</span>
                  </div>
                  <div>
                    Вес (кг): <span>{formatNullable(patient.weight)}</span>
                  </div>
                  <div>
                    Рост (см): <span>{formatNullable(patient.height)}</span>
                  </div>
                </div>
              </div>

              <div className="pd-card__right">
                <div className="pd-card__field">
                  <span className="pd-card__label">Лечащий врач</span>
                  <span className="pd-card__value">
                    {shortName(patient.doctor) || '—'}
                  </span>
                </div>
                <div className="pd-card__field">
                  <span className="pd-card__label">Отделение</span>
                  <span className="pd-card__value">
                    {patient.department?.trim() || '—'}
                  </span>
                </div>
                <div className="pd-card-field-wrap">
                  <div className="pd-card__field">
                    <span className="pd-card__label">№ Истории болезни</span>
                    <span className="pd-card__value pd-card__value--bold">
                      {patient.identification_number?.trim() || '—'}
                    </span>
                  </div>
                  {patient.room_number != null && (
                    <span className="pd-prescriptions__room">
                      <span className="pd-prescriptions__room-label">
                        Палата
                      </span>
                      <strong>{patient.room_number}</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right block — prescription history (hardcoded) */}
        <div className="col-md-6 col-xxl-7">
          <div className="pd-prescriptions">
            <div className="pd-prescriptions__header">
              <h5 className="pd-prescriptions__title">История назначений</h5>
              <a href="#" className="pd-prescriptions__link">
                Все назначения
              </a>
            </div>

            <div className="pd-prescriptions__list-host">
              <div className="pd-prescriptions__list">
                {isLoadingRecipes ? (
                  <Loader position="absolute" />
                ) : recipes.length === 0 ? (
                  <div className="text-center py-4">Нет назначений</div>
                ) : (
                  recipes.map((recipe) => (
                    <div key={recipe.id} className="pd-prescription-item">
                      <div className="pd-prescription-item__meta">
                        <span className="pd-prescription-item__id">
                          {recipe.recipe_number}
                        </span>
                        <span className="pd-prescription-item__drug">
                          {recipe.active_substance.name}
                        </span>
                        <span className="pd-prescription-item__dose">
                          Концентрация: &nbsp; {recipe.active_substance.concentration}
                          мг
                        </span>
                      </div>
                      <div className="pd-prescription-item__row">
                        <div className="pd-prescription-item__date">
                          Дата: &nbsp;
                          {new Date(recipe.created_at).toLocaleDateString(
                            'ru-RU',
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom — buttons */}
        <div className="col-12">
          <div className="dt-details-btn">
            <Button
              className="bordered has-icon"
              iconAfter={<ArchiveIcon />}
              onClick={onArchive}
            >
              {patient.is_archived
                ? 'Восстановить из архива'
                : 'Переместить в архив'}
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
