import { useEffect, useState } from 'react';
import { patient as patientApi } from 'api';
import ROLES, { ROLE_NAMES } from 'const/roles';
import type { IPatientListItem } from 'types/patients.types';
import type { UserDetailsProps } from 'types/users.types';
import { Button } from 'ui/button';
import Loader from 'ui/loader';
import {
  ArchiveIcon,
  CloseIcon,
  DefaultUserIcon,
  EditIcon,
  HidePasswordIcon,
  VisiblePasswordIcon,
} from 'ui/icons';
import { formatDate } from 'utils/date';
import { StatusBadge } from 'ui/statusBadge';

const GENDER_SHORT: Record<string, string> = {
  male: 'М',
  female: 'Ж',
};

function getAge(dob: string): number {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function UserDetails({ user, onClose, onArchive }: UserDetailsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [patients, setPatients] = useState<IPatientListItem[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);

  const isDoctor = user.role === ROLES.DOCTOR;

  useEffect(() => {
    if (!isDoctor) return;
    let cancelled = false;
    void (async () => {
      setPatientsLoading(true);
      setPatients([]);
      try {
        const res = (await patientApi.getSearchPatient({
          doctor_id: user.id,
          limit: 3,
          archived_status: 'nonarchived',
        })) as { patients: IPatientListItem[] };
        if (!cancelled) setPatients(res.patients ?? []);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setPatientsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user.id, isDoctor]);

  return (
    <div className="dt-details p-4">
      <div className="row">
        <div className={isDoctor ? 'col-md-5' : 'col-12'}>
          <div className="ud-card">
            <button className="ud-card__edit-btn" type="button" data-bs-toggle="modal" data-bs-target="#addUserModal">
              <EditIcon />
            </button>

            <div className="ud-card__body">
              <div className="ud-card__left">
                <div className="ud-card__avatar">
                  <DefaultUserIcon />
                </div>
                <StatusBadge
                  status={user.status as 'active' | 'archived'}
                  className="ud-status w-100"
                ></StatusBadge>
              </div>

              <div className="ud-card__right">
                {/* <span className="ud-card__role-badge">
                  {ROLE_NAMES[user.role] ?? user.role}
                </span> */}
                <h4 className="ud-card__display-role">
                  {ROLE_NAMES[user.role] ?? user.role}
                </h4>
                <p className="ud-card__full-name">
                  {user.last_name} {user.first_name} {user.middle_name}
                </p>
                <a
                  href={`mailto:${user.email_address}`}
                  className="ud-card__email"
                >
                  {user.email_address}
                </a>
                <div className="ud-card__password-row">
                  <span className="ud-card__password-text">•••••••••</span>
                  <button
                    className="ud-card__password-toggle"
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    {showPassword ? (
                      <HidePasswordIcon />
                    ) : (
                      <VisiblePasswordIcon />
                    )}
                  </button>
                </div>
                <div className="ud-card__reg">
                  <span className="ud-card__reg-label">Регистрация:</span>
                  <span>{formatDate(user.registration_date)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isDoctor && (
          <div className="col-md-7">
            <div className="ud-patients">
              <div className="ud-patients__header">
                <h5 className="ud-patients__title">Пациенты</h5>
                <a href="#" className="ud-patients__link">
                  Все пациенты
                </a>
              </div>
              <div className="ud-patients__list-host">
                {patientsLoading && <Loader position="absolute" />}
                <div className="ud-patients__list">
                  {!patientsLoading && patients.length === 0 ? (
                    <p className="ud-patients__empty">Нет пациентов</p>
                  ) : null}
                  {!patientsLoading &&
                    patients.map((p) => (
                      <div key={p.id} className="ud-patient-item">
                        <div className="ud-patient-item__meta">
                          <span className="ud-patient-item__id">
                            {p.identification_number}
                          </span>
                          <span className="ud-patient-item__dept">
                            {p.department}
                          </span>
                          <span className="ud-patient-item__name">
                            {p.first_name} {p.last_name}
                          </span>
                        </div>
                        <div className="ud-patient-item__row">
                          <div className="ud-patient-item__stats">
                            <span>{GENDER_SHORT[p.gender] ?? p.gender}</span>
                            <span>{p.weight != null && ` ${p.weight}кг`}</span>
                            <span>{` ${getAge(p.date_of_birth)}лет`}</span>
                          </div>
                          {p.room_number != null && (
                            <span className="ud-patient-item__room">
                              <span className="ud-patient-item__room-label">
                                Палата
                              </span>
                              <strong>{p.room_number}</strong>
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="col-12">
          <div className="dt-details-btn ">
            {!user.is_archived && (
              <Button
                className="bordered has-icon"
                iconAfter={<ArchiveIcon />}
                onClick={onArchive}
              >
                Переместить в архив
              </Button>
            )}
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
