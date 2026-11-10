import { useCallback, useEffect, useState } from 'react';
import {
  AlertCircle,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Plus,
} from 'lucide-react';
import api from '../lib/api';
import TenantModal from './TenantModal';
import { statusCardStyles, statusFilterOptions } from '../lib/tenantOptions';

const PAGE_SIZE = 24;

const TenantsView = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const loadTenants = useCallback(
    async (showSpinner = true) => {
      if (showSpinner) setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/tenants', {
          params: {
            pageNumber: page,
            pageSize: PAGE_SIZE,
            ...(status ? { status } : {}),
          },
        });
        setTenants(data.items ?? []);
        setTotalPages(data.totalPages || 1);
        setTotalCount(data.totalCount ?? 0);
      } catch {
        setError('No se pudieron cargar las empresas. Intenta nuevamente.');
      } finally {
        if (showSpinner) setLoading(false);
      }
    },
    [page, status]
  );

  useEffect(() => {
    loadTenants();
  }, [loadTenants]);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const handleSaved = () => loadTenants(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-text-primary">
            Empresas
          </h2>
          <p className="text-xs sm:text-sm text-text-muted">
            {totalCount} {totalCount === 1 ? 'empresa registrada' : 'empresas registradas'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative">
            <select
              value={status}
              onChange={handleStatusChange}
              className="w-full sm:w-44 appearance-none px-4 py-2.5 pr-9 border border-border rounded-xl text-sm text-text-primary bg-surface focus:outline-none focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal transition-all duration-200"
            >
              {statusFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-dark text-white text-sm font-medium hover:bg-[#122c34] transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            Nueva empresa
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

      {!loading && !error && tenants.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-14 w-14 rounded-2xl bg-brand-green-light flex items-center justify-center mb-3">
            <Building2 className="h-6 w-6 text-brand-green" />
          </div>
          <p className="text-sm font-medium text-text-primary">
            No hay empresas para mostrar
          </p>
          <p className="text-xs text-text-muted">
            Crea una nueva empresa o cambia el filtro de estado.
          </p>
        </div>
      )}

      {!loading && !error && tenants.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {tenants.map((tenant) => (
            <button
              key={tenant.id}
              type="button"
              onClick={() => setSelectedTenant(tenant)}
              className={`rounded-xl px-4 py-3 border shadow-sm hover:shadow-md transition-all duration-200 text-center ${
                statusCardStyles[tenant.status] ??
                'bg-surface text-text-primary border-border'
              }`}
            >
              <span className="block text-sm font-medium truncate">
                {tenant.name}
              </span>
            </button>
          ))}
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

      {selectedTenant && (
        <TenantModal
          key={selectedTenant.id}
          tenant={selectedTenant}
          open
          onClose={() => setSelectedTenant(null)}
          onSaved={handleSaved}
        />
      )}

      {isCreateOpen && (
        <TenantModal
          key="create"
          tenant={null}
          open
          onClose={() => setIsCreateOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default TenantsView;
