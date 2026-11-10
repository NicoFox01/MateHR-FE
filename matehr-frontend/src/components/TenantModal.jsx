import { useState } from 'react';
import { AlertCircle, Building2, Loader2 } from 'lucide-react';
import Modal from './ui/Modal';
import TenantUsersSection from './TenantUsersSection';
import api from '../lib/api';
import {
  extractApiError,
  formatAddress,
  formatDate,
  industryLabels,
  industryOptions,
  recruitmentModeLabels,
  recruitmentModeOptions,
  statusLabels,
  statusOptions,
  statusStyles,
  subscriptionStatusLabels,
  subscriptionTypeLabels,
  subscriptionTypeOptions,
} from '../lib/tenantOptions';

const inputClass =
  'w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal transition-all duration-200 text-sm';

const toForm = (tenant) => ({
  name: tenant?.name ?? '',
  cuit: tenant?.cuit ?? '',
  ownerEmail: tenant?.ownerEmail ?? '',
  industry: tenant?.industry ?? '',
  street: tenant?.address?.street ?? '',
  city: tenant?.address?.city ?? '',
  state: tenant?.address?.state ?? '',
  country: tenant?.address?.country ?? '',
  postalCode: tenant?.address?.postalCode ?? '',
});

const toSettings = (tenant) => ({
  status: tenant?.status ?? '',
  recruitmentMode: tenant?.recruitmentMode ?? '',
  subscriptionType: tenant?.subscriptionType ?? '',
});

const Field = ({ label, value, className = '' }) => (
  <div className={className}>
    <dt className="text-xs font-medium text-text-muted">{label}</dt>
    <dd className="text-sm text-text-primary mt-0.5 break-words">{value || '—'}</dd>
  </div>
);

const TenantModal = ({ tenant, open, onClose, onSaved }) => {
  const isCreate = !tenant;

  const [current, setCurrent] = useState(tenant);
  const [view, setView] = useState(isCreate ? 'edit' : 'detail');
  const [form, setForm] = useState(toForm(tenant));
  const [settings, setSettings] = useState(toSettings(tenant));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const updateForm = (field) => (event) =>
    setForm((previous) => ({ ...previous, [field]: event.target.value }));

  const updateSettings = (field) => (event) =>
    setSettings((previous) => ({ ...previous, [field]: event.target.value }));

  const buildAddress = () => {
    const keys = ['street', 'city', 'state', 'country', 'postalCode'];
    if (!keys.some((key) => form[key].trim() !== '')) return null;

    return {
      street: form.street.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      country: form.country.trim(),
      postalCode: form.postalCode.trim(),
    };
  };

  const handleCancel = () => {
    if (isCreate || !current) {
      onClose();
      return;
    }
    setError('');
    setView('detail');
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      cuit: form.cuit.trim(),
      ownerEmail: form.ownerEmail.trim(),
      industry: form.industry,
      address: buildAddress(),
    };

    try {
      if (isCreate) {
        await api.post('/tenants', payload);
        onSaved?.();
        onClose();
        return;
      }

      const { data } = await api.put(`/tenants/${current.id}`, payload);
      setCurrent(data);
      setSettings(toSettings(data));
      setForm(toForm(data));
      setView('detail');
      onSaved?.();
    } catch (submitError) {
      setError(extractApiError(submitError));
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitSettings = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const requests = [];
      if (settings.status !== current.status) {
        requests.push(
          api.patch(`/tenants/${current.id}/status`, { status: settings.status })
        );
      }
      if (settings.recruitmentMode !== current.recruitmentMode) {
        requests.push(
          api.patch(`/tenants/${current.id}/recruitment-mode`, {
            recruitmentMode: settings.recruitmentMode,
          })
        );
      }
      if (settings.subscriptionType !== current.subscriptionType) {
        requests.push(
          api.patch(`/tenants/${current.id}/subscription-type`, {
            subscriptionType: settings.subscriptionType,
          })
        );
      }

      if (requests.length > 0) {
        await Promise.all(requests);
        const { data } = await api.get(`/tenants/${current.id}`);
        setCurrent(data);
        setSettings(toSettings(data));
        setForm(toForm(data));
        onSaved?.();
      }

      setView('detail');
    } catch (submitError) {
      setError(extractApiError(submitError));
    } finally {
      setSaving(false);
    }
  };

  const title =
    view === 'edit'
      ? isCreate
        ? 'Nueva empresa'
        : 'Editar datos'
      : view === 'settings'
        ? 'Suscripción y configuración'
        : current?.name || 'Empresa';

  const renderError = () =>
    error ? (
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <span>{error}</span>
      </div>
    ) : null;

  const renderDetail = () => (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-brand-green-light flex items-center justify-center flex-shrink-0">
          <Building2 className="h-6 w-6 text-brand-green" />
        </div>
        <div className="min-w-0">
          <p className="text-base font-semibold text-text-primary truncate">
            {current.name}
          </p>
          <p className="text-xs text-text-muted truncate">/{current.slug}</p>
        </div>
        <span
          className={`ml-auto px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
            statusStyles[current.status] ?? 'bg-border text-text-muted'
          }`}
        >
          {statusLabels[current.status] ?? current.status}
        </span>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
        <Field label="CUIT" value={current.cuit} />
        <Field label="Email del dueño" value={current.ownerEmail} />
        <Field
          label="Industria"
          value={industryLabels[current.industry] ?? current.industry}
        />
        <Field
          label="Modo de reclutamiento"
          value={
            recruitmentModeLabels[current.recruitmentMode] ?? current.recruitmentMode
          }
        />
        <Field
          label="Tipo de suscripción"
          value={
            subscriptionTypeLabels[current.subscriptionType] ?? current.subscriptionType
          }
        />
        <Field
          label="Estado de suscripción"
          value={
            subscriptionStatusLabels[current.subscriptionStatus] ??
            current.subscriptionStatus
          }
        />
        <Field
          label="Vence suscripción"
          value={formatDate(current.subscriptionExpiresAt)}
        />
        <Field label="Creada" value={formatDate(current.createdAt)} />
        <Field label="Última actualización" value={formatDate(current.updatedAt)} />
        <Field
          label="Dirección"
          value={formatAddress(current.address)}
          className="sm:col-span-2"
        />
      </dl>

      <TenantUsersSection tenantId={current.id} />
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmitForm} className="space-y-4" autoComplete="off">
      {renderError()}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-text-primary">Nombre</label>
        <input
          type="text"
          value={form.name}
          onChange={updateForm('name')}
          maxLength={200}
          required
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-primary">CUIT</label>
          <input
            type="text"
            inputMode="numeric"
            value={form.cuit}
            onChange={(event) =>
              setForm((previous) => ({
                ...previous,
                cuit: event.target.value.replace(/\D/g, '').slice(0, 11),
              }))
            }
            placeholder="11 dígitos"
            required
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-primary">Industria</label>
          <select
            value={form.industry}
            onChange={updateForm('industry')}
            required
            className={inputClass}
          >
            <option value="" disabled>
              Seleccionar
            </option>
            {industryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-text-primary">
          Email del dueño
        </label>
        <input
          type="email"
          value={form.ownerEmail}
          onChange={updateForm('ownerEmail')}
          required
          className={inputClass}
        />
      </div>

      <div className="pt-1">
        <p className="text-sm font-medium text-text-primary mb-3">
          Dirección <span className="text-text-muted font-normal">(opcional)</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs text-text-muted">Calle</label>
            <input
              type="text"
              value={form.street}
              onChange={updateForm('street')}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-text-muted">Ciudad</label>
            <input
              type="text"
              value={form.city}
              onChange={updateForm('city')}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-text-muted">Provincia / Estado</label>
            <input
              type="text"
              value={form.state}
              onChange={updateForm('state')}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-text-muted">País</label>
            <input
              type="text"
              value={form.country}
              onChange={updateForm('country')}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-text-muted">Código postal</label>
            <input
              type="text"
              value={form.postalCode}
              onChange={updateForm('postalCode')}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <div className="pt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={saving}
          className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-primary hover:bg-bg-app transition-all duration-200 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-dark text-white text-sm font-medium hover:bg-[#122c34] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {isCreate ? 'Crear empresa' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  );

  const renderSettings = () => (
    <form onSubmit={handleSubmitSettings} className="space-y-4">
      {renderError()}

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-text-primary">Estado</label>
        <select
          value={settings.status}
          onChange={updateSettings('status')}
          className={inputClass}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-text-primary">
          Modo de reclutamiento
        </label>
        <select
          value={settings.recruitmentMode}
          onChange={updateSettings('recruitmentMode')}
          className={inputClass}
        >
          {recruitmentModeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-text-primary">
          Tipo de suscripción
        </label>
        <select
          value={settings.subscriptionType}
          onChange={updateSettings('subscriptionType')}
          className={inputClass}
        >
          {subscriptionTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={saving}
          className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-primary hover:bg-bg-app transition-all duration-200 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-dark text-white text-sm font-medium hover:bg-[#122c34] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Guardar cambios
        </button>
      </div>
    </form>
  );

  const renderDetailFooter = () => (
    <>
      <button
        type="button"
        onClick={() => {
          setError('');
          setSettings(toSettings(current));
          setView('settings');
        }}
        className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-primary hover:bg-bg-app transition-all duration-200"
      >
        Suscripción y modos
      </button>
      <button
        type="button"
        onClick={() => {
          setError('');
          setForm(toForm(current));
          setView('edit');
        }}
        className="px-4 py-2.5 rounded-xl bg-primary-dark text-white text-sm font-medium hover:bg-[#122c34] transition-all duration-200"
      >
        Editar datos
      </button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size={view === 'detail' ? 'lg' : 'md'}
      footer={view === 'detail' ? renderDetailFooter() : null}
    >
      {view === 'detail' && renderDetail()}
      {view === 'edit' && renderForm()}
      {view === 'settings' && renderSettings()}
    </Modal>
  );
};

export default TenantModal;
