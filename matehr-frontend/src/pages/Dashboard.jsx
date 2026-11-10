import { useState } from 'react';
import {
  Home,
  Users,
  DollarSign,
  Clock,
  BarChart3,
  Settings,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  MoreVertical,
  Building2,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import TenantsView from '../components/TenantsView';
import JobStatusesView from '../components/recruitment/JobStatusesView';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const mockRendimientoData = [
  { day: 'Lun', clima: 75, rendimiento: 82 },
  { day: 'Mar', clima: 78, rendimiento: 85 },
  { day: 'Mié', clima: 72, rendimiento: 78 },
  { day: 'Jue', clima: 80, rendimiento: 88 },
  { day: 'Vie', clima: 82, rendimiento: 90 },
  { day: 'Sáb', clima: 68, rendimiento: 70 },
  { day: 'Dom', clima: 65, rendimiento: 68 },
];

const mockAsistenciaData = [
  { day: 'Lun', presentismo: 96 },
  { day: 'Mar', presentismo: 98 },
  { day: 'Mié', presentismo: 94 },
  { day: 'Jue', presentismo: 97 },
  { day: 'Vie', presentismo: 95 },
  { day: 'Sáb', presentismo: 88 },
  { day: 'Dom', presentismo: 85 },
];

const recentActivities = [
  {
    id: 1,
    name: 'María González',
    avatar: 'MG',
    action: 'Aprobó solicitud',
    time: 'Hace 2h',
  },
  {
    id: 2,
    name: 'Lucas Pérez',
    avatar: 'LP',
    action: 'Completó evaluación',
    time: 'Hace 4h',
  },
  {
    id: 3,
    name: 'Javier Torres',
    avatar: 'JT',
    action: 'Nuevo contrato firmado',
    time: 'Hace 6h',
  },
  {
    id: 4,
    name: 'Sofía Ramírez',
    avatar: 'SR',
    action: 'Actualizó perfil',
    time: 'Ayer',
  },
];

const upcomingEvents = [
  {
    id: 1,
    name: 'María González',
    avatar: 'MG',
    event: 'Cumpleaños',
    date: '20 Septiembre - 18:00',
  },
  {
    id: 2,
    name: 'Lucas Pérez',
    avatar: 'LP',
    event: 'Aniversario',
    date: '22 Septiembre - 09:00',
  },
  {
    id: 3,
    name: 'Equipo RRHH',
    avatar: 'RH',
    event: 'Reunión mensual',
    date: '25 Septiembre - 14:00',
  },
];

const menuItems = [
  { icon: Home, label: 'Inicio', id: 'inicio' },
  { icon: Building2, label: 'Empresas', id: 'tenants', superAdminOnly: true },
  {
    icon: Briefcase,
    label: 'Recruitment',
    id: 'recruitment',
    adminOnly: true,
    children: [{ id: 'job-status', label: 'Job Status' }],
  },
  { icon: Users, label: 'Colaboradores' },
  { icon: DollarSign, label: 'Nómina' },
  { icon: Clock, label: 'Asistencia & Turnos' },
  { icon: BarChart3, label: 'Desempeño' },
  { icon: Settings, label: 'Configuración' },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [expandedMenus, setExpandedMenus] = useState({});

  const isSuperAdmin = user?.role === 'SuperAdmin';
  const isAdmin = user?.role === 'Admin';
  const visibleMenuItems = menuItems.filter((item) => {
    if (item.superAdminOnly) return isSuperAdmin;
    if (item.adminOnly) return isAdmin;
    return true;
  });

  const handleSelectSection = (item) => {
    if (item.children?.length) {
      setExpandedMenus((previous) => ({
        ...previous,
        [item.id]: !previous[item.id],
      }));
      return;
    }

    if (item.id) {
      setActiveSection(item.id);
      setSidebarOpen(false);
    }
  };

  const handleSelectChild = (child) => {
    setActiveSection(child.id);
    setSidebarOpen(false);
  };

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-bg-app flex">
      {/* Sidebar móvil overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-aside flex flex-col transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:flex-shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-white/10">
          <img
            src="/LogoMateHR_Aside.jpg"
            alt="MATEHR"
            className="w-full h-auto"
          />
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {visibleMenuItems.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isExpanded = Boolean(expandedMenus[item.id]);
            const hasActiveChild = item.children?.some(
              (child) => child.id === activeSection
            );
            const isActive = item.id === activeSection || hasActiveChild;

            return (
              <div key={item.label}>
                <button
                  onClick={() => handleSelectSection(item)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-teal text-white shadow-sm'
                      : 'text-white/80 hover:bg-[#122c34] hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {hasChildren && (
                    <ChevronDown
                      className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {hasChildren && isExpanded && (
                  <div className="mt-1 ml-4 pl-4 border-l border-white/10 space-y-1">
                    {item.children.map((child) => {
                      const isChildActive = child.id === activeSection;
                      return (
                        <button
                          key={child.id}
                          onClick={() => handleSelectChild(child)}
                          className={`w-full flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isChildActive
                              ? 'bg-primary-teal text-white shadow-sm'
                              : 'text-white/70 hover:bg-[#122c34] hover:text-white'
                          }`}
                        >
                          {child.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-brand-green flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.firstName?.[0] || 'A'}
                {user?.lastName?.[0] || 'M'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'Admin MATEHR'}
              </p>
              <p className="text-white/60 text-xs truncate">
                {user?.email || 'admin@matehr.com'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-white/80 hover:bg-[#122c34] hover:text-white rounded-lg transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-surface border-b border-border p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start sm:items-center gap-3">
              <button
                className="md:hidden p-2 -ml-2 text-text-muted hover:text-text-primary"
                onClick={() => setSidebarOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-text-primary">
                  ¡Hola, {user?.firstName || 'Administrador'}! 👋
                </h1>
                <p className="text-xs sm:text-sm text-text-muted capitalize">
                  {today}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full pl-9 pr-4 py-2 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-teal/20 focus:border-primary-teal transition-all duration-200"
                />
              </div>

              <div className="flex items-center gap-2">
                <button className="relative p-2 border border-border rounded-xl hover:bg-bg-app transition-all duration-200">
                  <Bell className="h-5 w-5 text-text-muted" />
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-brand-green text-white text-xs rounded-full flex items-center justify-center font-medium">
                    3
                  </span>
                </button>

                <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-xl hover:bg-bg-app transition-all duration-200 cursor-pointer">
                  <span className="text-sm text-text-primary hidden sm:inline">
                    Últimos 30 días
                  </span>
                  <span className="text-sm text-text-primary sm:hidden">
                    30 días
                  </span>
                  <ChevronDown className="h-4 w-4 text-text-muted" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {activeSection === 'job-status' && isAdmin ? (
            <JobStatusesView />
          ) : activeSection === 'tenants' && isSuperAdmin ? (
            <TenantsView />
          ) : (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-medium text-text-muted">
                    Colaboradores Activos
                  </h3>
                  <span className="px-2 py-1 bg-brand-green-bg text-brand-green text-xs font-medium rounded-full">
                    +6.8% vs mes anterior
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-semibold text-text-primary">
                  3,892
                </p>
              </div>

              <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border">
                <h3 className="text-sm font-medium text-text-muted mb-2">
                  Nuevos Ingresos este mes
                </h3>
                <p className="text-2xl sm:text-3xl font-semibold text-text-primary">
                  18
                </p>
                <p className="text-xs text-text-muted mt-1">
                  4 pendientes de onboarding
                </p>
              </div>

              <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border">
                <h3 className="text-sm font-medium text-text-muted mb-2">
                  Solicitudes Pendientes
                </h3>
                <p className="text-2xl sm:text-3xl font-semibold text-text-primary">
                  12
                </p>
                <p className="text-xs text-text-muted mt-1">
                  vacaciones, licencias, recibos
                </p>
              </div>

              <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border">
                <h3 className="text-sm font-medium text-text-muted mb-2">
                  Tasa de Retención / Clima
                </h3>
                <p className="text-2xl sm:text-3xl font-semibold text-text-primary">
                  94.2%
                </p>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border">
                <h3 className="text-base font-semibold text-text-primary mb-4">
                  Rendimiento y Clima Laboral
                </h3>
                <div className="h-72 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockRendimientoData}
                      margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E3ECE8" />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12 }}
                        stroke="#6C7D82"
                      />
                      <YAxis tick={{ fontSize: 12 }} stroke="#6C7D82" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E3ECE8',
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                      />
                      <Bar
                        dataKey="clima"
                        name="Clima Laboral"
                        fill="#4EA868"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="rendimiento"
                        name="Rendimiento"
                        fill="#193C47"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border">
                <h3 className="text-base font-semibold text-text-primary mb-4">
                  Asistencia Semanal
                </h3>
                <div className="h-72 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={mockAsistenciaData}
                      margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E3ECE8" />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12 }}
                        stroke="#6C7D82"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        stroke="#6C7D82"
                        domain={[80, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E3ECE8',
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                        formatter={(value) => [`${value}%`, 'Presentismo']}
                      />
                      <Bar
                        dataKey="presentismo"
                        fill="#257C82"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Widgets inferiores */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-text-primary">
                    Actividad Reciente
                  </h3>
                  <button className="text-sm text-primary-teal hover:underline">
                    Ver todo
                  </button>
                </div>
                <div className="space-y-3">
                  {recentActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-bg-app transition-colors"
                    >
                      <div className="h-9 w-9 rounded-full bg-brand-green-light flex items-center justify-center flex-shrink-0">
                        <span className="text-brand-green text-xs font-medium">
                          {activity.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {activity.name}
                        </p>
                        <p className="text-xs text-text-muted truncate">
                          {activity.action}
                        </p>
                      </div>
                      <span className="text-xs text-text-muted flex-shrink-0">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-5 shadow-sm border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-text-primary">
                    Próximos Cumpleaños & Eventos
                  </h3>
                  <MoreVertical className="h-5 w-5 text-text-muted cursor-pointer hover:text-text-primary transition-colors" />
                </div>
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-bg-app transition-colors"
                    >
                      <div className="h-9 w-9 rounded-full bg-brand-green-light flex items-center justify-center flex-shrink-0">
                        <span className="text-brand-green text-xs font-medium">
                          {event.avatar}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {event.name}
                        </p>
                        <p className="text-xs text-text-muted truncate">
                          {event.event} • {event.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;