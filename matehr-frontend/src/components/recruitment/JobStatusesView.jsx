import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import api from '../../lib/api';
import { confirmAction, toastSuccess } from '../../lib/alerts';
import { extractApiError } from '../../lib/tenantOptions';
import JobStatusModal from './JobStatusModal';

const PAGE_SIZE = 10;

const JobStatusesView = () => {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(
    async (showSpinner = true) => {
      if (showSpinner) setLoading(true);
      setError('');

      try {
        const { data } = await api.get('/recruitment/job-statuses', {
          params: { pageNumber: page, pageSize: PAGE_SIZE },
        });
        setStatuses(data.items ?? []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount ?? 0);
      } catch {
        setError('No se pudieron cargar los estados. Intentá nuevamente.');
      } finally {
        if (showSpinner) setLoading(false);
      }
    },
    [page]
  );

  useEffect(() => {
    load();
  }, [load]);

  const query = search.trim().toLowerCase();
  const visibleStatuses = query
    ? statuses.filter((status) => status.name.toLowerCase().includes(query))
    : statuses;

  const handleDelete = async (status) => {
    const result = await confirmAction({
      title: 'Eliminar status',
      text: `¿Estás seguro/a de que querés eliminar "${status.name}"?`,
      confirmButtonText: 'Eliminar',
    });

    if (!result.isConfirmed) return;

    setBusyId(status.id);
    setError('');

    try {
      await api.delete(`/recruitment/job-statuses/${status.id}`);
      toastSuccess('Status eliminado');

      if (statuses.length === 1 && page > 1) {
        setPage((current) => current - 1);
      } else {
        await load(false);
      }
    } catch (deleteError) {
      setError(extractApiError(deleteError));
    } finally {
      setBusyId(null);
    }
  };

  const handleSaved = () => load(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
            Job Status
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            {totalCount} {totalCount === 1 ? 'estado registrado' : 'estados registrados'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full sm:w-64 pl-9 pr-4 py-2.5 border border-border rounded-xl text-sm bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal transition-all duration-200"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-dark text-white text-sm font-medium hover:bg-[#122c34] transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Nuevo Status
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 text-primary-teal animate-spin" />
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && visibleStatuses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-14 w-14 rounded-2xl bg-brand-green-light flex items-center justify-center mb-3">
            <ClipboardList className="h-6 w-6 text-brand-green" />
          </div>
          <p className="text-sm font-medium text-text-primary">
            {statuses.length === 0
              ? 'No hay estados para mostrar'
              : 'No hay estados que coincidan con la búsqueda'}
          </p>
          <p className="text-xs text-text-muted">
            {statuses.length === 0
              ? 'Crea un nuevo status para comenzar.'
              : 'Probá con otro nombre.'}
          </p>
        </div>
      )}

      {!loading && !error && visibleStatuses.length > 0 && (
        <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-bg-app border-b border-border">
                <tr className="text-left text-xs uppercase tracking-wide text-text-muted">
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="px-4 py-3 font-medium text-right w-32">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visibleStatuses.map((status) => (
                  <tr key={status.id} className="hover:bg-bg-app transition-colors">
                    <td className="px-4 py-3 text-text-primary font-medium">
                      {status.name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setEditingStatus(status)}
                          title="Editar"
                          aria-label={`Editar ${status.name}`}
                          className="p-2 rounded-lg text-text-muted hover:text-primary-teal hover:bg-bg-app transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(status)}
                          disabled={busyId === status.id}
                          title="Eliminar"
                          aria-label={`Eliminar ${status.name}`}
                          className="p-2 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {busyId === status.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="p-2 border border-border rounded-xl text-text-muted hover:bg-bg-app hover:text-text-primary transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-text-muted">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page >= totalPages}
            className="p-2 border border-border rounded-xl text-text-muted hover:bg-bg-app hover:text-text-primary transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {isCreateOpen && (
        <JobStatusModal
          key="create"
          status={null}
          open
          onClose={() => setIsCreateOpen(false)}
          onSaved={handleSaved}
        />
      )}

      {editingStatus && (
        <JobStatusModal
          key={editingStatus.id}
          status={editingStatus}
          open
          onClose={() => setEditingStatus(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default JobStatusesView;
