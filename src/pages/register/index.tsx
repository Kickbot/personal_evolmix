import './register.css';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from 'api';
import routes from 'const/routes';
import { Button } from 'ui/button';
import { Input } from 'ui/input';
import { PasswordInput } from 'ui/passwordInput';
import { Select } from 'ui/select';
import Loader from 'ui/loader';
import type { ApiFormError } from 'features/form/types/api-error';
import { applyServerErrors } from 'features/form/lib/applyServerErrors';
import { registerSchema, type RegisterFormValues } from 'features/auth/model/register.schema';

function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      role: '',
      first_name: '',
      email_address: '',
      last_name: '',
      password: '',
      middle_name: '',
      confirm_password: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    clearErrors('root');

    try {
      const { confirm_password, ...payload } = values;
      void confirm_password;
      await auth.register(payload);
      navigate(routes.registerSuccess, { replace: true });
    } catch (error) {
      applyServerErrors(error as ApiFormError, setError);
    }
  };

  return (
    <>
      {isSubmitting && <Loader position="fixed" />}

      <div className="container-fluid register-page auth-bg">
        <div className="register-wrap">
          <div className="auth-logo"></div>
          <h2 className="text-center">Регистрация в EvolMIX</h2>
          <div className="auth-text">
            <span className="d-block w-100 fs-6 text-center">Регистрация нового пользователя в системе EvolMIX</span>
          </div>
          <form
            className="row g-3 needs-validation mb-3"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Select
              id="choosePosition"
              {...register('role', {
                onChange: () => clearErrors('role'),
              })}
              label="Должность"
              required
              autoComplete="off"
              wrapperClassName="col-12 col-md-6 field-role"
              error={errors.role?.message}
              placeholder="Выберите должность"
              options={[
                { value: 'admin', label: 'Администратор' },
                { value: 'doctor', label: 'Врач' },
                { value: 'pharmacist', label: 'Фармацевт' },
                { value: 'tech', label: 'Оператор' },
              ]}
            />
            <Input
              id="first_name"
              {...register('first_name', {
                onChange: () => clearErrors('first_name'),
              })}
              label="Имя"
              type="text"
              required
              autoComplete="off"
              wrapperClassName="col-12 col-md-6 field-firstname"
              error={errors.first_name?.message}
            />
            <Input
              id="email_address"
              {...register('email_address', {
                onChange: () => clearErrors('email_address'),
              })}
              label="Email"
              type="email"
              required
              autoComplete="off"
              wrapperClassName="col-12 col-md-6 field-email"
              error={errors.email_address?.message}
            />
            <Input
              id="last_name"
              {...register('last_name', {
                onChange: () => clearErrors('last_name'),
              })}
              label="Фамилия"
              type="text"
              required
              autoComplete="off"
              wrapperClassName="col-12 col-md-6 field-lastname"
              error={errors.last_name?.message}
            />
            <PasswordInput
              id="register-password"
              {...register('password', {
                onChange: () => clearErrors('password'),
              })}
              label="Пароль"
              required
              autoComplete="off"
              wrapperClassName="col-12 col-md-6 field-password"
              error={errors.password?.message}
            />
            <Input
              id="middle_name"
              {...register('middle_name', {
                onChange: () => clearErrors('middle_name'),
              })}
              label="Отчество"
              type="text"
              required
              autoComplete="off"
              wrapperClassName="col-12 col-md-6 field-middlename"
              error={errors.middle_name?.message}
            />
            <PasswordInput
              id="confirm-password"
              {...register('confirm_password', {
                onChange: () => clearErrors('confirm_password'),
              })}
              label="Подтверждение пароля"
              required
              autoComplete="off"
              wrapperClassName="col-12 col-md-6 field-confirm"
              error={errors.confirm_password?.message}
            />

            {errors.root?.server?.message ? (
              <div className="col-12 field-error">
                <div className="invalid-feedback d-block">{errors.root.server.message}</div>
              </div>
            ) : null}

            <div className="col-12 mt-4 field-submit">
              <Button className="w-100 fs-5 submit" type="submit">
                Регистрация
              </Button>
            </div>
          </form>
          <hr />
          <div className="register-text">
            <span>Уже есть учётная запись?</span>
            <Link to={routes.login}>Войти в систему</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
