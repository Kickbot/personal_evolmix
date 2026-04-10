import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { auth } from 'api';
import { Link } from 'ui/link';
import { Button } from 'ui/button';
import { Input } from 'ui/input';
import { PasswordInput } from 'ui/passwordInput';

import Loader from 'ui/loader';
import Context from 'context';
import routes from 'const/routes';
import type { IAuthResponse } from 'types/auth.types';
import type { ApiFormError } from 'features/form/types/api-error';
import { applyServerErrors } from 'features/form/lib/applyServerErrors';
import { loginSchema, type LoginFormValues } from 'features/auth/model/login.schema';
import './login.css';

function Login() {
  const appContext = useContext(Context);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      email_address: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    clearErrors('root');

    if (!appContext) {
      return;
    }

    try {
      const response = await auth.login(values);

      const { user } = response as IAuthResponse;
      localStorage.setItem('access_token', user.access_token);
      appContext.setCurrentUser(user);
      navigate(routes.dashboard, { replace: true });
    } catch (error) {
      applyServerErrors(error as ApiFormError, setError);
    }
  };

  return (
    <>
      {isSubmitting && <Loader position="fixed" />}

      <div className="container-fluid auth-bg">
        <div className="login-wrap">
          <div className="auth-logo"></div>
          <h2 className="fw-semibold">Вход в систему EvolMIX</h2>
          <div className="auth-text">
            <span>Нет учетной записи?</span>
            <Link to={routes.register} theme="" className="">
              Зарегистрироваться
            </Link>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
            <Input
              id="login-email"
              {...register('email_address', {
                onChange: () => clearErrors('email_address'),
              })}
              label="Email"
              type="email"
              autoComplete="off"
              required
              wrapperClassName="mb-4"
              error={errors.email_address?.message}
            />

            <PasswordInput
              id="login-password"
              {...register('password', {
                onChange: () => clearErrors('password'),
              })}
              label="Password"
              autoComplete="off"
              required
              wrapperClassName="mb-2"
              error={errors.password?.message}
            />

            {errors.root?.server?.message ? (
              <div className="invalid-feedback d-block mb-2">{errors.root.server.message}</div>
            ) : null}

            {/* <div className="mb-4 text-end fw-medium">
              <Link to="#">Забыли пароль?</Link>
            </div> */}

            <Button className="w-100 mt-4 fs-5 submit" type="submit">
              Вход
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
