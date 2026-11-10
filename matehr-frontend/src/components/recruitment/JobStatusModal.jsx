import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import Modal from '../ui/Modal';
import api from '../../lib/api';
import { confirmAction, toastSuccess } from '../../lib/alerts';
import { extractApiError } from '../../lib/tenantOptions';

const NAME_MAX_LENGTH = 30;

const inputClass =
  'w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal transition-all duration-200 text-sm';

const JobStatusModal = ({ status, open, onClose, onSaved }) => {
  const isEdit = Boolean(status);

  const [name, setName] = useState(status?.name ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmed = name.trim();
    if (!trimmed) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (trimmed.length > NAME_MAX_LENGTH) {
      setError(`El nombre no puede tener más de ${NAME_MAX_LENGTH} caracteres.`);
      return;
    }

    if (isEdit) {
      const result = await confirmAction({
        title: 'Confirmar cambio',
        text: `¿Estás seguro/a de que querés cambiar el nombre a "${trimmed}"?`,
        confirmButtonText: 'Confirmar',
      });

      if (!result.isConfirmed) return;
    }

    setSaving(true);
    setError('');

    try {
      if (isEdit) {
        await api.put(`/recruitment/job-statuses/${status.id}`, { name: trimmed });
      } else {
        await api.post('/recruitment/job-statuses', { name: trimmed });
      }

      toastSuccess(isEdit ? 'Status actualizado' : 'Status creado');
      onSaved?.();
      onClose();
    } catch (submitError) {
      setError(extractApiError(submitError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Editar Status' : 'Nuevo Status'}
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-primary hover:bg-bg-app transition-all duration-200 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="job-status-form"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-dark text-white text-sm font-medium hover:bg-[#122c34] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Confirmar
          </button>
        </>
      }
    >
      <form id="job-status-form" onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="job-status-name" className="text-sm font-medium text-text-primary">
            Nombre
          </label>
          <input
            id="job-status-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={NAME_MAX_LENGTH}
            placeholder="Ej. Abierto"
            required
            autoFocus
            className={inputClass}
          />
          <p className="text-xs text-text-muted">
            Máximo {NAME_MAX_LENGTH} caracteres.
          </p>
        </div>
      </form>
    </Modal>
  );
};

export default JobStatusModal;
