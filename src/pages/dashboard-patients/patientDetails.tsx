import type { IDoctorListItem, IPatientListItem } from 'types/patients.types';
import { Button } from 'ui/button';
import { ArchiveIcon, CloseIcon } from 'ui/icons';
import { formatDate } from 'utils/date';

function doctorFullName(doctor: IDoctorListItem | null): string {
  if (!doctor) return '—';
  const parts = [doctor.last_name, doctor.first_name, doctor.middle_name]
    .map((s) => s?.trim())
    .filter(Boolean) as string[];
  return parts.length ? parts.join(' ') : '—';
}

function formatNullableNumber(value: number | null, suffix = ''): string {
  if (value == null || Number.isNaN(value)) return '—';
  return `${value}${suffix}`;
}

export function PatientDetails({ patient }: { patient: IPatientListItem }) {
  const genderLabel = patient.gender === 'male' ? 'М' : 'Ж';
  const archiveLabel = patient.is_archived ? 'Архив' : 'Активен';

  return (
    <div className="dt-details p-3">
      <div className="row">
        <div className="col-md-6">
          <div className="dt-details-data p-3">
            <p>
              <strong>Фамилия:</strong> {patient.last_name}
            </p>
            <p>
              <strong>Имя:</strong> {patient.first_name}
            </p>
            <p>
              <strong>Отчество:</strong> {patient.middle_name?.trim() || '—'}
            </p>
            <p>
              <strong>История болезни:</strong>{' '}
              {patient.identification_number?.trim() || '—'}
            </p>
            <p>
              <strong>Дата рождения:</strong> {formatDate(patient.date_of_birth)}
            </p>
            <p>
              <strong>Пол:</strong> {genderLabel}
            </p>
            <p>
              <strong>Вес (кг):</strong> {formatNullableNumber(patient.weight)}
            </p>
            <p>
              <strong>Рост (см):</strong> {formatNullableNumber(patient.height)}
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="dt-details-data p-3">
            <p>
              <strong>Отделение:</strong> {patient.department?.trim() || '—'}
            </p>
            <p>
              <strong>Номер палаты:</strong>{' '}
              {formatNullableNumber(patient.room_number)}
            </p>
            <p>
              <strong>Врач:</strong> {doctorFullName(patient.doctor)}
            </p>
            <p>
              <strong>Статус:</strong> {archiveLabel}
            </p>
          </div>
        </div>
        <div className="col-12">
          <div className="dt-details-btn">
            <Button className="bordered has-icon" iconAfter={<ArchiveIcon />}>
              Переместить в архив
            </Button>
            <Button className="secondary has-icon" iconBefore={<CloseIcon />}>
              Закрыть
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}