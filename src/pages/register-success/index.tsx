import { Link } from 'ui/link';
import './register-success.css';
import routes from 'const/routes';

function RegisterSuccess() {
  return (
    <div className="container-fluid auth-bg">
      <div className="register-success-wrap">
        <div className="register-success-top">
          <a href={routes.login} className="auth-logo d-block mb-0"></a>
        </div>
        <div className="register-success-middle">
          <h1>Спасибо за регистрацию в EvolMIX</h1>
          <p>
            Доступ к аккаунту будет предоставлен после подтверждения вашей
            регистрации Администратором
          </p>
        </div>
        <div className="register-success-bottom text-center">
          <p>
            Уже есть аккаунт? <Link to={routes.login}>Вход в систему</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterSuccess;
