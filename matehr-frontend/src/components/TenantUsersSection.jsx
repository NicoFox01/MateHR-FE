import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Loader2,
  Plus,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';
import api from '../lib/api';
import { confirmAction, toastSuccess } from '../lib/alerts';
import { extractApiError } from '../lib/tenantOptions';

const inputClass =
  'w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal transition-all duration-200 text-sm';

const emptyForm = { firstName: '', lastName: '', email: '', password: '' };

const initials = (user) =>
  `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || '?';

const TenantUsersSection = ({ tenantId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/users', {
        params: { tenantId, role: 'Admin' },
      });
      setUsers(Array.isArray(data) ? data : data?.items ?? []);
    } catch (loadError) {
      setError(extractApiError(loadError));
    } finally {
      setLoading(false);
    }
  }, [tenantId]);

  useEffect(() => {
    load();
  }, [load]);

  const updateForm = (field) => (event) =>
    setForm((previous) => ({ ...previous, [field]: event.target.value }));

  const handleCreate = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      await api.post('/users', {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        password: form.password,
        role: 'Admin',
        tenantId,
      });
      setForm(emptyForm);
      setShowForm(false);
      await load();
      toastSuccess('Usuario admin creado');
    } catch (createError) {
      setError(extractApiError(createError));
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (user) => {
    const nextActive = !user.isActive;

    if (!nextActive) {
      const result = await confirmAction({
        title: 'Suspender usuario',
        text: `¿Suspender a ${user.firstName} ${user.lastName}? No podrá iniciar sesión.`,
        confirmButtonText: 'Suspender',
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    setBusyId(user.id);
    setError('');

    try {
      const { data } = await api.patch(`/users/${user.id}/status`, {
        isActive: nextActive,
      });
      setUsers((previous) =>
        previous.map((item) => (item.id === user.id ? data : item))
      );
      toastSuccess(
        nextActive ? 'Usuario reactivado' : 'Usuario suspendido'
      );
    } catch (toggleError) {
      setError(extractApiError(toggleError));
    } finally {
      setBusyId(null);
    }
  };

  const renderError = () =>
    error ? (
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-xl text-xs">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <span>{error}</span>
      </div>
    ) : null;

  return (
    <section className="border-t border-border pt-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Users className="h-4 w-4 text-text-muted" />
            Usuarios admin registrados
          </h4>
          <p className="text-xs text-text-muted mt-0.5">
            {loading
              ? 'Cargando…'
              : `${users.length} usuario${users.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setError('');
            setShowForm((previous) => !previous);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-medium text-text-primary hover:bg-bg-app transition-all duration-200"
        >
          {showForm ? 'Cancelar' : <><Plus className="h-4 w-4" /> Nuevo admin</>}
        </button>
      </div>

      {renderError()}

      {showForm && (
        <form
          onSubmit={handleCreate}
          autoComplete="off"
          className="space-y-3 bg-bg-app border border-border rounded-xl p-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-primary">Nombre</label>
              <input
                type="text"
                value={form.firstName}
                onChange={updateForm('firstName')}
                maxLength={100}
                required
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-primary">Apellido</label>
              <input
                type="text"
                value={form.lastName}
                onChange={updateForm('lastName')}
                maxLength={100}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-primary">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={updateForm('email')}
              required
              className={inputClass}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-text-primary">Contraseña</label>
            <input
              type="password"
              value={form.password}
              onChange={updateForm('password')}
              minLength={8}
              maxLength={128}
              placeholder="Mínimo 8 caracteres"
              required
              className={inputClass}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-dark text-white text-sm font-medium hover:bg-[#122c34] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Crear admin
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin" />
          Cargando usuarios…
        </div>
      ) : users.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-6 border border-dashed border-border rounded-xl">
          {showForm
            ? 'Completa el formulario para crear el primer admin.'
            : 'No hay usuarios admin registrados.'}
        </p>
      ) : (
        <ul className="divide-y divide-border border border-border rounded-xl overflow-hidden">
          {users.map((user) => (
            <li key={user.id} className="flex items-center gap-3 p-3">
              <div className="h-9 w-9 rounded-full bg-brand-green-light text-brand-green flex items-center justify-center text-xs font-semibold flex-shrink-0">
                {initials(user)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-text-muted truncate">{user.email}</p>
              </div>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                  user.isActive
                    ? 'bg-brand-green-bg text-brand-green'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                {user.isActive ? 'Activo' : 'Suspendido'}
              </span>
              <button
                type="button"
                onClick={() => handleToggle(user)}
                disabled={busyId === user.id}
                title={user.isActive ? 'Suspender' : 'Reactivar'}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 disabled:opacity-50 ${
                  user.isActive
                    ? 'border border-border text-text-primary hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                    : 'border border-brand-green/30 text-brand-green hover:bg-brand-green-bg'
                }`}
              >
                {busyId === user.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : user.isActive ? (
                  <UserX className="h-4 w-4" />
                ) : (
                  <UserCheck className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                  {user.isActive ? 'Suspender' : 'Reactivar'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default TenantUsersSection;
