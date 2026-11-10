# Prompt Maestro & Especificación de Frontend: MATEHR Platform

Copia y pega la siguiente especificación en tu herramienta de IA preferida (Cursor, v0.dev, Claude 3.5 Sonnet / Opus, Bolt.new, ChatGPT) para generar el frontend completo e interactivo.

---

## PROMPT LISTO PARA COPIAR Y PEGAR

```text
Actúa como un Diseñador UI/UX y Desarrollador Frontend Senior especializado en React, Tailwind CSS, Lucide Icons y Recharts (o Chart.js).

Necesito que construyas un prototipo interactivo completo de dos pantallas (Login y Dashboard HR) para la plataforma "MATEHR - Personas que hacen crecer a las empresas". Debe tener un diseño SaaS corporativo moderno, limpio, con bordes redondeados y una paleta visual basada fielmente en la marca.

---
### 1. SISTEMA DE DISEÑO Y TOKENS (Design Tokens)

Usa la siguiente paleta de colores extraída de la identidad corporativa:
- Primary Dark (Azul Petróleo / Slate oscuro): `#193C47` (para botones principales, sidebar, títulos fuertes y contraste)
- Teal / Petrol Claro: `#257C82` (para gradientes, íconos y acentos)
- Green Brand (Verde mate / MATEHR): `#4EA868` (para acentos positivos, badges, gráficos y estados activos)
- Green Light (Verde pastel suave): `#D1EAD8` o `#E9F6ED` (para fondos de chips, métricas positivas y degradados suaves)
- Background App: `#F4F7F6` (gris muy claro cálido / menta pálido)
- Surface / Cards: `#FFFFFF` con sombras suaves (`shadow-sm` / `shadow-md` con `rounded-2xl`)
- Text Primary: `#142930`
- Text Muted: `#6C7D82`
- Border: `#E3ECE8`
- Tipografía: Fuente Sans-serif limpia y geométrica (tipo Inter, Plus Jakarta Sans o Poppins).

---
### 2. PANTALLA 1: INICIO DE SESIÓN (LOGIN)

Crea un contenedor centrado tipo modal/tarjeta dividida en dos columnas (`grid grid-cols-1 md:grid-cols-2`):

#### Columna Izquierda (Branding & Ilustración Orgánica):
- Fondo verde suave con formas orgánicas onduladas tipo "blob/waves" en tonos verde oscuro (`#193C47`), teal (`#257C82`) y verde hoja (`#4EA868`).
- Centrado: Logotipo de MATEHR (isotipo de dos personas brindando con un mate + texto MATEHR).
- Eslogan inferior: "Personas que hacen crecer a las empresas." en tipografía limpia y amigable.

#### Columna Derecha (Formulario de Acceso):
- Título: "Iniciar Sesión" (o "Sesión") en fuente bold.
- Inputs limpios con bordes redondeados (`rounded-xl` o `rounded-full`):
  1. Campo "Usuario o Correo" con placeholder.
  2. Campo "Contraseña" con botón interactivo para mostrar/ocultar contraseña (icono de ojo).
  3. Enlace "¿Olvidé mi contraseña?" alineado a la derecha en color teal.
- Botón principal: "Iniciar Sesión" en color `#193C47` con hover sutil (`hover:bg-[#122c34]`), texto blanco y bordes redondeados.
- Divisor con "o" ("or").
- Botones de Login Social en cápsula (`rounded-full` o `rounded-xl` con borde):
  - Botón con icono de Facebook.
  - Botón con icono de Google.
- Al hacer clic en "Iniciar Sesión", debe cambiar dinámicamente de vista a la pantalla de Dashboard.

---
### 3. PANTALLA 2: DASHBOARD RRHH (PANEL PRINCIPAL)

Estructura de aplicación con barra lateral fija y panel principal scrolleable:

#### A. Barra Lateral (Sidebar):
- Fondo oscuro en `#193C47` (Azul petróleo).
- Header de la sidebar: Logotipo de MATEHR en versión contrastada para fondo oscuro.
- Menú de navegación vertical con ítems:
  - 🏠 Inicio (Activo, con fondo `#257C82` o `#122c34` con bordes redondeados).
  - 👥 Colaboradores / Empleados
  - 💵 Nómina / Sueldos
  - ⏱ Asistencia & Turnos
  - 📈 Desempeño
  - ⚙️ Configuración
- Perfil inferior del usuario con avatar, nombre "Admin MATEHR" y botón de cerrar sesión (que vuelva a la pantalla de Login).

#### B. Barra Superior (Header):
- Saludo: "¡Hola, Administrador! 👋" con subtítulo de fecha actual.
- Filtro desplegable de rango de fechas ("Últimos 30 días" / "Mes actual").
- Acciones rápidas: Barra de búsqueda, botón de notificaciones con badge verde y botón para alternar entre vista Login y Dashboard para previsualización.

#### C. Métricas Clave (KPI Cards - Grid de 3 o 4 columnas):
1. **Colaboradores Activos:** `3,892` con badge verde `+6.8% vs mes anterior`.
2. **Nuevos Ingresos este mes:** `18` con subtítulo `4 pendientes de onboarding`.
3. **Solicitudes Pendientes:** `12` (vacaciones, licencias, recibos).
4. **Tasa de Retención / Clima:** `94.2%`.

#### D. Gráficos y Visualización de Datos (Grid de 2 columnas):
1. **Gráfico 1: Rendimiento y Clima Laboral**
   - Gráfico de barras combinadas o barras dobles semanales (Lun - Dom) usando `#193C47` y `#4EA868` con tooltip interactivo.
2. **Gráfico 2: Asistencia Semanal**
   - Gráfico de barras verticales mostrando porcentaje de presentismo por día.

#### E. Bloques Inferiores (Widgets):
1. **Actividad Reciente:**
   - Lista con avatares circulares de colaboradores recientes (María, Lucas, Javier, Sofía).
   - Acciones: "Aprobó solicitud", "Completó evaluación", "Nuevo contrato firmado".
2. **Próximos Cumpleaños & Eventos:**
   - Lista compacta con foto, nombre, fecha y hora ("20 Septiembre - 18:00").
   - Menú de tres puntos de acción rápida.

---
### 4. REQUERIMIENTOS TÉCNICOS
- Código limpio, modular y completamente responsive (mobile, tablet, desktop).
- Incluye un estado local simple en React (`useState`) para alternar fácilmente entre la vista del Login y la del Dashboard.
- Usa transiciones suaves (`transition-all duration-200`) para hover en botones, tarjetas y elementos del menú.
```

---

## CONVENCIONES DE UI PARA MÓDULOS CRUD (obligatorio)

Estas convenciones aplican a **todos los módulos y entidades futuras** (Job Status, Áreas, Clima,
Capacitación, Evaluación de desempeño, etc.). La implementación de referencia es
`src/components/recruitment/JobStatusesView.jsx` + `src/components/recruitment/JobStatusModal.jsx`.

### A. Navegación lateral

- El aside es un menú vertical con módulos de primer nivel.
- Los módulos que agrupan funcionalidades son **desplegables** y muestran un chevron que rota al
  abrir/cerrar.
- Cada módulo se define con una estructura de datos que soporte hijos, por ejemplo:

```js
{
  icon: Briefcase,
  label: 'Recruitment',
  id: 'recruitment',
  adminOnly: true,
  children: [{ id: 'job-status', label: 'Job Status' }],
}
```

- Al hacer click en un módulo desplegable, se abre/cierra su lista de subítems; al hacer click en un
  subítem, se navega a su vista y se marca como activo.
- Si un usuario no tiene permiso para un módulo, **el módulo no se renderiza**.

### B. Vista de listado

Toda entidad con CRUD debe tener una vista de listado con esta estructura:

1. **Encabezado**: título de la entidad, contador de registros y acciones.
2. **Buscador por nombre** arriba, a la izquierda del botón de alta.
3. **Botón primario de alta** arriba a la derecha, por ejemplo `Nuevo Status` / `Nueva Área`.
4. **Tabla**, no cards, con:
   - columna `Nombre`;
   - columna `Acciones` a la derecha;
   - ícono de lápiz para editar y tacho de basura para eliminar;
   - `title` y `aria-label` en cada acción.
5. **Paginación** con controles anterior/siguiente y texto `Página X de Y`. Tamaño recomendado:
   10 registros por página.
6. **Estado de carga** con spinner.
7. **Estado de error** con alerta visible, sin disfrazarlo de lista vacía.
8. **Estado vacío** con mensaje explícito:
   - sin registros: `No hay <Entidad> cargados` (ej. `No hay Job Status cargados`);
   - búsqueda sin coincidencias: `No hay <Entidad> que coincidan con la búsqueda`.
9. **Búsqueda**: por ahora se filtra en el front sobre los ítems de la página actual. Si más adelante
   el backend agrega `Search`, se reemplaza por búsqueda real contra el servidor.

La tabla debe ser responsive usando un contenedor con `overflow-x-auto`.

### C. Modal de alta y edición

- Reutilizar siempre `src/components/ui/Modal.jsx`.
- La cruz de cierre queda arriba a la derecha (consistente con los modales existentes).
- El modal se cierra al:
  - tocar la cruz;
  - tocar `Cancelar`;
  - hacer click fuera del modal;
  - presionar `Escape`.
- Mientras se guarda, bloquear el cierre para no interrumpir la operación.
- Título: `Nuevo <Entidad>` / `Editar <Entidad>`.
- Campos con las mismas validaciones que el backend:
  - obligatorios;
  - longitud máxima (usar la constante de la entidad o el máximo acordado);
  - `trim` del valor antes de enviar;
  - mensajes de error visibles dentro del modal.
- Botones abajo a la derecha:
  - `Cancelar` (secundario, borde);
  - `Confirmar` (primario, fondo `#193C47`).
- Implementación recomendada: `<form id="...">` para los campos y botón `type="submit" form="..."`
  en el footer del modal.

### D. Flujos de alta, edición y eliminación

**Crear**
1. El usuario completa el modal y presiona `Confirmar`.
2. Se llama directamente al `POST`.
3. Si responde OK: `toastSuccess('<Entidad> creado/creada')`, cerrar modal y recargar el listado.
4. No pedir una confirmación extra para crear.

**Editar**
1. El lápiz abre el modal con los datos actuales precargados.
2. El usuario modifica y presiona `Confirmar`.
3. Se abre un SweetAlert de confirmación: “¿Estás seguro/a de que querés hacer ese cambio?”.
4. Si confirma, se llama al `PUT`.
5. Si responde OK: `toastSuccess('<Entidad> actualizado/actualizada')`, cerrar modal y recargar el
   listado.
6. Si cancela la confirmación, no se llama a la API y el modal queda abierto.

**Eliminar**
1. El tacho abre un SweetAlert de confirmación:
   “¿Estás seguro/a de que querés eliminar `<nombre>`?”.
2. Si confirma, se llama al `DELETE`.
3. Si responde OK: `toastSuccess('<Entidad> eliminado/eliminada')` y recargar el listado.
4. Si era el último registro de una página mayor a 1, volver a la página anterior.
5. Si cancela, no se hace nada.

En los tres flujos, **recargar el listado con un nuevo `GET`**, no hacer `window.location.reload()`.

### E. Confirmaciones y notificaciones

- Usar siempre `src/lib/alerts.js`:
  - `confirmAction(...)` para confirmaciones destructivas o cambios importantes;
  - `toastSuccess(...)` para avisos de éxito.
- El toast de éxito debe aparecer **arriba a la derecha** (`position: 'top-end'`), sin botón de
  confirmación y con cierre automático (3 segundos).
- No usar `window.confirm`, `alert` ni mensajes nativos del navegador.

### F. Permisos y alcance por tenant

- Los catálogos de administración son **solo para Admin**: el Admin ve el módulo, el botón de alta y
  la columna de acciones.
- `Recruiter` no ve estos módulos de administración. Cuando necesite un catálogo (por ejemplo un
  dropdown de Job Status al crear un Job), se usa solo el `GET` correspondiente.
- El filtro por tenant lo resuelve el backend a partir del JWT. El frontend **no envía `tenantId`**
  en estas llamadas.

### G. API y manejo de errores

- Usar siempre `src/lib/api.js`.
- Mostrar los errores del backend con `extractApiError(...)`:
  - `400` de validación: mostrar el mensaje dentro del modal;
  - `409` de duplicado o entidad en uso: mostrar el mensaje dentro del modal;
  - errores de carga del listado: alerta inline en la vista.
- No capturar errores en componentes de nivel superior si ya los maneja el interceptor o el
  middleware de la API.

### H. Estructura de archivos recomendada

```
src/components/<modulo>/<Entidad>sView.jsx    // listado, búsqueda, paginación, acciones
src/components/<modulo>/<Entidad>Modal.jsx   // alta y edición
src/lib/<entidad>Options.js                  // labels/opciones si hace falta
```

Mantener el estilo visual existente: `bg-surface`, `rounded-2xl`, `border-border`, `shadow-sm`,
transiciones `duration-200` y la paleta definida en `src/index.css`.

### I. Checklist para cada nueva entidad

- [ ] Módulo visible solo para los roles autorizados.
- [ ] Vista de listado con buscador, botón de alta, tabla y paginación.
- [ ] Modal reutilizando `ui/Modal` con cierre por cruz, cancelar, click afuera y `Escape`.
- [ ] Validaciones del front alineadas con el backend.
- [ ] Alta sin confirmación extra; edición y borrado con `confirmAction`.
- [ ] `toastSuccess` arriba a la derecha después de cada operación exitosa.
- [ ] Recarga del listado con `GET` después de crear, editar o eliminar.
- [ ] Estados de carga, error y vacío implementados.
- [ ] Sin `tenantId` en el front; el backend lo toma del JWT.

---

## GUÍA DE INTEGRACIÓN POR HERRAMIENTA

| Herramienta | Dónde pegarlo | Recomendación de Framework |
| :--- | :--- | :--- |
| **v0.dev (Vercel)** | En el chat inicial principal. | Genera directamente React + Tailwind + Lucide Icons y Shadcn UI. |
| **Cursor / Claude Code** | En el panel de Composer (`Ctrl+I` / `Cmd+I`) o chat. | Pídele que lo guarde en `src/pages/AuthDashboardPreview.tsx`. |
| **Bolt.new / Lovable.dev** | En el prompt de inicio para crear un nuevo proyecto. | Crea el entorno listo con Vite + Tailwind y preview en vivo. |
| **ChatGPT / Claude Web** | En una nueva conversación. | Pídele: *"Dame todo el código en un único componente React con Tailwind para probarlo en StackBlitz o Vite"*. |