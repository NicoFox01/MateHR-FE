export const statusLabels = {
  Active: 'Activa',
  Inactive: 'Inactiva',
  Suspended: 'Suspendida',
};

export const statusStyles = {
  Active: 'bg-brand-green-bg text-brand-green',
  Inactive: 'bg-border text-text-muted',
  Suspended: 'bg-red-50 text-red-600',
};

export const statusCardStyles = {
  Active: 'bg-brand-green-bg text-brand-green border-brand-green/30',
  Inactive: 'bg-border text-text-muted border-border',
  Suspended: 'bg-red-50 text-red-600 border-red-200',
};

export const statusOptions = [
  { value: 'Active', label: 'Activa' },
  { value: 'Inactive', label: 'Inactiva' },
  { value: 'Suspended', label: 'Suspendida' },
];

export const statusFilterOptions = [{ value: '', label: 'Todas' }, ...statusOptions];

export const recruitmentModeLabels = {
  Internal: 'Interno',
  External: 'Externo',
  Hybrid: 'Híbrido',
};

export const recruitmentModeOptions = [
  { value: 'Internal', label: 'Interno' },
  { value: 'External', label: 'Externo' },
  { value: 'Hybrid', label: 'Híbrido' },
];

export const subscriptionTypeLabels = {
  Free: 'Gratis',
  Monthly: 'Mensual',
  Yearly: 'Anual',
};

export const subscriptionTypeOptions = [
  { value: 'Free', label: 'Gratis' },
  { value: 'Monthly', label: 'Mensual' },
  { value: 'Yearly', label: 'Anual' },
];

export const subscriptionStatusLabels = {
  None: 'Sin suscripción',
  Active: 'Activa',
  GracePeriod: 'En gracia',
  Expired: 'Expirada',
  Cancelled: 'Cancelada',
};

export const industryLabels = {
  Technology: 'Tecnología',
  Healthcare: 'Salud',
  Retail: 'Retail',
  Manufacturing: 'Manufactura',
  Education: 'Educación',
  Finance: 'Finanzas',
  Logistics: 'Logística',
  Government: 'Gobierno',
  Construction: 'Construcción',
  Telecommunications: 'Telecomunicaciones',
  Energy: 'Energía',
  Agriculture: 'Agro',
  Hospitality: 'Hotelería',
  Media: 'Medios',
  ProfessionalServices: 'Servicios profesionales',
  RealEstate: 'Inmobiliaria',
  Automotive: 'Automotriz',
  Pharmaceuticals: 'Farmacéutica',
  Other: 'Otra',
};

export const industryOptions = Object.entries(industryLabels).map(
  ([value, label]) => ({ value, label })
);

export const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatAddress = (address) => {
  if (!address) return '';
  return [address.street, address.city, address.state, address.country, address.postalCode]
    .filter(Boolean)
    .join(', ');
};

export const extractApiError = (error) => {
  const data = error?.response?.data;
  if (data?.errors) {
    const first = Object.values(data.errors).flat().find(Boolean);
    if (first) return first;
  }
  return (
    data?.message ||
    data?.detail ||
    data?.title ||
    'Ocurrió un error. Intenta nuevamente.'
  );
};
