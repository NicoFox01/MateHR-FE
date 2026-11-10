import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(usernameOrEmail, password);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.title ||
          err.response?.data?.message ||
          'Credenciales inválidas. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-app flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-surface rounded-2xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Columna Izquierda - Logo */}
        <div className="relative min-h-[280px] md:min-h-full bg-primary-dark overflow-hidden">
          <img
            src="/LogoMateHR_loggin.jpg"
            alt="MATEHR"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* Columna Derecha - Formulario */}
        <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-text-primary">
                Iniciar Sesión
              </h1>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">
                  Usuario o Correo
                </label>
                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  autoComplete="off"
                  name="matehr-login-user"
                  className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal transition-all duration-200 text-sm sm:text-base"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-text-primary">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    autoComplete="new-password"
                    name="matehr-login-pass"
                    className="w-full px-4 py-2.5 pr-10 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal transition-all duration-200 text-sm sm:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-primary-teal hover:underline transition-colors"
                >
                  ¿Olvidé mi contraseña?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-dark text-white py-2.5 rounded-xl font-medium hover:bg-[#122c34] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;