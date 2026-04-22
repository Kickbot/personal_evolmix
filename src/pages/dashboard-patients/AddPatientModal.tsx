import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { patient as patientApi } from 'api';
import { Input } from 'ui/input';
import { Select } from 'ui/select';
import { Button } from 'ui/button';
import type { ApiFormError } from 'features/form/types/api-error';
import { applyServerErrors } from 'features/form/lib/applyServerErrors';
import {
  addPatientSchema,
  type AddPatientFormValues,
} from 'features/patients/model/addPatient.schema';
import './addPatientModal.css';
import { AddSaveIcon } from 'ui/icons/AddSaveIcon';
import type { IPatientListItem } from 'types/patients.types';
import { shortName } from 'utils/name';

interface AddPatientModalProps {
  onSuccess?: (updatedPatient?: IPatientListItem) => void;
  editingPatient?: IPatientListItem | null;
}

const EMPTY_VALUES: AddPatientFormValues = {
  first_name: '',
  last_name: '',
  middle_name: '',
  doctor: '',
  department: '',
  identification_number: '',
  room_number: '',
  date_of_birth: '',
  gender: '',
  weight: '',
  height: '',
};

export function AddPatientModal({
  onSuccess,
  editingPatient,
}: AddPatientModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const [closeRequestId, setCloseRequestId] = useState(0);
  const isEditMode = Boolean(editingPatient);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<AddPatientFormValues>({
    resolver: zodResolver(addPatientSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: EMPTY_VALUES,
  });

  const onSubmit = async (values: AddPatientFormValues) => {
    clearErrors('root');
    const payload = {
      first_name: values.first_name,
      last_name: values.last_name,
      middle_name: values.middle_name,
      department: values.department || undefined,
      identification_number: values.identification_number || undefined,
      room_number: values.room_number ? Number(values.room_number) : undefined,
      date_of_birth: values.date_of_birth || undefined,
      gender: values.gender || undefined,
      weight: values.weight
        ? Number(values.weight.replace(',', '.'))
        : undefined,
      height: values.height
        ? Number(values.height.replace(',', '.'))
        : undefined,
    };

    try {
      if (editingPatient) {
        const response = (await patientApi.patchPatient(
          editingPatient.id,
          payload,
        )) as { patient: IPatientListItem };
        onSuccess?.(response.patient);
      } else {
        await patientApi.createPatient(payload);
        onSuccess?.();
      }
      reset(EMPTY_VALUES);
      setCloseRequestId((current) => current + 1);
    } catch (error) {
      applyServerErrors(error as ApiFormError, setError);
    }
  };

  useEffect(() => {
    if (editingPatient) {
      reset({
        first_name: editingPatient.first_name,
        last_name: editingPatient.last_name,
        middle_name: editingPatient.middle_name,
        doctor: editingPatient.doctor ? shortName(editingPatient.doctor) : '',
        department: editingPatient.department ?? '',
        identification_number: editingPatient.identification_number ?? '',
        room_number: editingPatient.room_number?.toString() ?? '',
        date_of_birth: editingPatient.date_of_birth?.slice(0, 10) ?? '',
        gender: editingPatient.gender ?? '',
        weight: editingPatient.weight?.toString() ?? '',
        height: editingPatient.height?.toString() ?? '',
      });
    } else {
      reset(EMPTY_VALUES);
    }
    clearErrors();
  }, [clearErrors, editingPatient, reset]);

  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;
    const handleShow = (event: Event) => {
      const customEvent = event as Event & {
        relatedTarget?: EventTarget | null;
      };
      const trigger = customEvent.relatedTarget;
      lastTriggerRef.current = trigger instanceof HTMLElement ? trigger : null;
    };
    const handleHide = () => {
      const activeElement = document.activeElement as HTMLElement | null;
      if (activeElement && modalElement.contains(activeElement)) {
        activeElement.blur();
      }
    };
    const handleHidden = () => {
      lastTriggerRef.current?.focus();
    };
    modalElement.addEventListener('show.bs.modal', handleShow);
    modalElement.addEventListener('hide.bs.modal', handleHide);
    modalElement.addEventListener('hidden.bs.modal', handleHidden);
    return () => {
      modalElement.removeEventListener('show.bs.modal', handleShow);
      modalElement.removeEventListener('hide.bs.modal', handleHide);
      modalElement.removeEventListener('hidden.bs.modal', handleHidden);
    };
  }, []);

  useEffect(() => {
    if (closeRequestId === 0) return;
    modalRef.current
      ?.querySelector<HTMLButtonElement>('[data-bs-dismiss="modal"]')
      ?.click();
  }, [closeRequestId]);

  return (
    <div
      ref={modalRef}
      className="modal fade"
      id="addPatientModal"
      tabIndex={-1}
      aria-labelledby="addPatientModalLabel"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addPatientModalLabel">
              {isEditMode
                ? 'Редактировать пациента'
                : 'Добавить пациента'}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
            <form
              className="add-patient-form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="add-patient-form__fields">
                <div className="add-patient-form__left">
                  {editingPatient && (
                    <Input
                      id="add-patient-doctor"
                      {...register('doctor', {
                        onChange: () => clearErrors('doctor'),
                      })}
                      label="Доктор"
                      placeholder="Доктор"
                      autoComplete="off"
                      error={errors.doctor?.message}
                      disabled
                    />
                  )}
                  <Input
                    id="add-patient-department"
                    {...register('department', {
                      onChange: () => clearErrors('department'),
                    })}
                    label="Отделение"
                    // placeholder="Отделение"
                    autoComplete="off"
                    error={errors.department?.message}
                  />
                  <Input
                    id="add-patient-identification"
                    {...register('identification_number', {
                      onChange: () => clearErrors('identification_number'),
                    })}
                    label="История болезни"
                    // placeholder="История болезни"
                    autoComplete="off"
                    error={errors.identification_number?.message}
                  />
                  <Input
                    id="add-patient-room"
                    {...register('room_number', {
                      onChange: () => clearErrors('room_number'),
                    })}
                    label="Палата"
                    placeholder="Палата"
                    autoComplete="off"
                    error={errors.room_number?.message}
                  />
                  <Select
                    id="add-patient-gender"
                    {...register('gender', {
                      onChange: () => clearErrors('gender'),
                    })}
                    label="Пол"
                    placeholder="Выберите пол"
                    error={errors.gender?.message}
                    options={[
                      { value: 'male', label: 'М' },
                      { value: 'female', label: 'Ж' },
                    ]}
                  />
                  <Input
                    id="add-patient-weight"
                    {...register('weight', {
                      onChange: () => clearErrors('weight'),
                    })}
                    label="Вес (кг)"
                    placeholder="Вес (кг)"
                    required
                    autoComplete="off"
                    error={errors.weight?.message}
                  />
                  <Input
                    id="add-patient-height"
                    {...register('height', {
                      onChange: () => clearErrors('height'),
                    })}
                    label="Рост (см)"
                    placeholder="Рост (см)"
                    required
                    autoComplete="off"
                    error={errors.height?.message}
                  />
                </div>

                <div className="add-patient-form__right">
                  <Input
                    id="add-patient-first-name"
                    {...register('first_name', {
                      onChange: () => clearErrors('first_name'),
                    })}
                    label="Имя"
                    placeholder="Имя"
                    required
                    autoComplete="off"
                    error={errors.first_name?.message}
                  />
                  <Input
                    id="add-patient-last-name"
                    {...register('last_name', {
                      onChange: () => clearErrors('last_name'),
                    })}
                    label="Фамилия"
                    placeholder="Фамилия"
                    required
                    autoComplete="off"
                    error={errors.last_name?.message}
                  />
                  <Input
                    id="add-patient-middle-name"
                    {...register('middle_name', {
                      onChange: () => clearErrors('middle_name'),
                    })}
                    label="Отчество"
                    placeholder="Отчество"
                    required
                    autoComplete="off"
                    error={errors.middle_name?.message}
                  />
                  <Input
                    id="add-patient-dob"
                    {...register('date_of_birth', {
                      onChange: () => clearErrors('date_of_birth'),
                    })}
                    label="Дата рождения"
                    type="date"
                    autoComplete="off"
                    error={errors.date_of_birth?.message}
                  />
                </div>
              </div>

              {errors.root?.server?.message && (
                <div className="invalid-feedback d-block">
                  {errors.root.server.message}
                </div>
              )}

              <Button
                className="w-100 has-icon"
                type="submit"
                iconBefore={<AddSaveIcon />}
              >
                {isEditMode ? 'Обновить данные' : 'Сохранить'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
