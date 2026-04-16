import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth, user as userApi } from 'api';
import { Input } from 'ui/input';
import { PasswordInput } from 'ui/passwordInput';
import { Select } from 'ui/select';
import { Button } from 'ui/button';
import type { ApiFormError } from 'features/form/types/api-error';
import { applyServerErrors } from 'features/form/lib/applyServerErrors';
import {
  editUserSchema,
  type AddUserFormValues,
  type EditUserFormValues,
} from 'features/users/model/addUser.schema';
import './addUserModal.css';
import { AddSaveIcon } from 'ui/icons/AddSaveIcon';
import type {
  IUserListItem,
  IUserPatchData,
  IUserPatchResponse,
} from 'types/users.types';

interface AddUserModalProps {
  onSuccess?: (updatedUser?: IUserListItem) => void;
  editingUser?: IUserListItem | null;
}

type UserFormValues = AddUserFormValues | EditUserFormValues;

const EMPTY_VALUES: UserFormValues = {
  first_name: '',
  last_name: '',
  middle_name: '',
  role: '',
  email_address: '',
  password: '',
  registration_date: '',
  department: '',
};

export function AddUserModal({ onSuccess, editingUser }: AddUserModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastTriggerRef = useRef<HTMLElement | null>(null);
  const [closeRequestId, setCloseRequestId] = useState(0);
  const isEditMode = Boolean(editingUser);

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(editUserSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: EMPTY_VALUES,
  });

  const onSubmit = async (values: UserFormValues) => {
    clearErrors('root');
    try {
      if (editingUser) {
        const patchPayload: IUserPatchData = {
          first_name: values.first_name,
          last_name: values.last_name,
          middle_name: values.middle_name,
          department: values.department || undefined,
          ...(values.password ? { password: values.password } : {}),
        };
        const response = (await userApi.patchUser(
          editingUser.id,
          patchPayload,
        )) as IUserPatchResponse;
        onSuccess?.(response.user);
      } else {
        if (!values.password || values.password.trim().length < 8) {
          setError('password', {
            type: 'manual',
            message: 'Минимум 8 символов',
          });
          return;
        }
        await auth.register(values as AddUserFormValues);
        window.dispatchEvent(new CustomEvent('user-approval-updated'));
        onSuccess?.();
      }
      reset(EMPTY_VALUES);
      setCloseRequestId((current) => current + 1);
    } catch (error) {
      applyServerErrors(error as ApiFormError, setError);
    }
  };

  useEffect(() => {
    if (editingUser) {
      reset({
        first_name: editingUser.first_name,
        last_name: editingUser.last_name,
        middle_name: editingUser.middle_name,
        role: editingUser.role,
        email_address: editingUser.email_address,
        password: '',
        registration_date: editingUser.registration_date?.slice(0, 10) ?? '',
        department: editingUser.department ?? '',
      });
    } else {
      reset(EMPTY_VALUES);
    }
    clearErrors();
  }, [clearErrors, editingUser, reset]);

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
      id="addUserModal"
      tabIndex={-1}
      aria-labelledby="addUserModalLabel"
      aria-hidden="true"
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addUserModalLabel">
              {isEditMode
                ? 'Редактировать пользователя'
                : 'Добавить пользователя'}
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
              className="add-user-form"
              noValidate
              autoComplete="off"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="add-user-form__fields">
                <div className="add-user-form__left">
                  <Input
                    id="add-first-name"
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
                    id="add-last-name"
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
                    id="add-middle-name"
                    {...register('middle_name', {
                      onChange: () => clearErrors('middle_name'),
                    })}
                    label="Отчество"
                    placeholder="Отчество"
                    required
                    error={errors.middle_name?.message}
                  />
                  <Select
                    id="add-role"
                    {...register('role', {
                      onChange: () => clearErrors('role'),
                    })}
                    label="Должность"
                    required
                    error={errors.role?.message}
                    disabled={isEditMode}
                    placeholder="– Выбрать из списка –"
                    options={[
                      { value: 'admin', label: 'Администратор' },
                      { value: 'doctor', label: 'Доктор' },
                      { value: 'pharmacist', label: 'Фармацевт' },
                      { value: 'tech', label: 'Оператор' },
                    ]}
                  />
                  <Input
                    id="add-department"
                    {...register('department', {
                      onChange: () => clearErrors('middle_name'),
                    })}
                    label="Отделение"
                    placeholder="Отделение"
                    error={errors.department?.message}
                  />
                  <Input
                    id="add-email"
                    {...register('email_address', {
                      onChange: () => clearErrors('email_address'),
                    })}
                    label="E-mail"
                    type="email"
                    placeholder="E-mail"
                    required
                    error={errors.email_address?.message}
                    disabled={isEditMode}
                  />
                  <PasswordInput
                    id="add-password"
                    {...register('password', {
                      onChange: () => clearErrors('password'),
                    })}
                    label="Пароль"
                    required={!isEditMode}
                    error={errors.password?.message}
                  />
                  {isEditMode && (
                    <Input
                      id="add-date"
                      {...register('registration_date')}
                      label="Дата регистрации"
                      type="date"
                      disabled
                    />
                  )}
                </div>

                <div className="add-user-form__photo">
                  <div className="add-user-form__photo-area">
                    <svg
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <ellipse
                        cx="10.5"
                        cy="5"
                        rx="3.5"
                        ry="3.33333"
                        stroke="#292C2E"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M17.5 14.5833C17.5 16.6544 17.5 18.3333 10.5 18.3333C3.5 18.3333 3.5 16.6544 3.5 14.5833C3.5 12.5123 6.63401 10.8333 10.5 10.8333C14.366 10.8333 17.5 12.5123 17.5 14.5833Z"
                        stroke="#292C2E"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                  <span className="add-user-form__photo-label">
                    Загрузить фото
                  </span>
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
                Сохранить
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
