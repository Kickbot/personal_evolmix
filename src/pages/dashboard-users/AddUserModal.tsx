import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { auth } from 'api';
import { Input } from 'ui/input';
import { PasswordInput } from 'ui/passwordInput';
import { Select } from 'ui/select';
import { Button } from 'ui/button';
import type { ApiFormError } from 'features/form/types/api-error';
import { applyServerErrors } from 'features/form/lib/applyServerErrors';
import {
  addUserSchema,
  type AddUserFormValues,
} from 'features/users/model/addUser.schema';
import './addUserModal.css';
import { AddSaveIcon } from 'ui/icons/AddSaveIcon';

interface AddUserModalProps {
  onSuccess?: () => void;
}

export function AddUserModal({ onSuccess }: AddUserModalProps) {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<AddUserFormValues>({
    resolver: zodResolver(addUserSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      first_name: '',
      last_name: '',
      middle_name: '',
      role: '',
      email_address: '',
      password: '',
      registration_date: '',
    },
  });

  const onSubmit = async (values: AddUserFormValues) => {
    clearErrors('root');
    try {
      await auth.register(values);
      reset();
      onSuccess?.();
    } catch (error) {
      applyServerErrors(error as ApiFormError, setError);
    }
  };

  return (
    <div
      className="modal fade"
      id="addUserModal"
      tabIndex={-1}
      aria-labelledby="addUserModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="addUserModalLabel">
              Пользователь
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
                    placeholder="– Выбрать из списка –"
                    options={[
                      { value: 'admin', label: 'Администратор' },
                      { value: 'doctor', label: 'Доктор' },
                      { value: 'pharmacist', label: 'Фармацевт' },
                      { value: 'tech', label: 'Оператор' },
                    ]}
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
                  />
                  <PasswordInput
                    id="add-password"
                    {...register('password', {
                      onChange: () => clearErrors('password'),
                    })}
                    label="Password"
                    required
                    error={errors.password?.message}
                  />
                  <Input
                    id="add-date"
                    {...register('registration_date', {
                      onChange: () => clearErrors('registration_date'),
                    })}
                    label="Дата"
                    type="date"
                    required
                    error={errors.registration_date?.message}
                  />
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
                        strokeWidth ="1.5"
                      />
                      <path
                        d="M17.5 14.5833C17.5 16.6544 17.5 18.3333 10.5 18.3333C3.5 18.3333 3.5 16.6544 3.5 14.5833C3.5 12.5123 6.63401 10.8333 10.5 10.8333C14.366 10.8333 17.5 12.5123 17.5 14.5833Z"
                        stroke="#292C2E"
                        strokeWidth ="1.5"
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

              <Button className="w-100 has-icon" type="submit" iconBefore={<AddSaveIcon />}>
                Сохранить
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
