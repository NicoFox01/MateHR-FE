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

## GUÍA DE INTEGRACIÓN POR HERRAMIENTA

| Herramienta | Dónde pegarlo | Recomendación de Framework |
| :--- | :--- | :--- |
| **v0.dev (Vercel)** | En el chat inicial principal. | Genera directamente React + Tailwind + Lucide Icons y Shadcn UI. |
| **Cursor / Claude Code** | En el panel de Composer (`Ctrl+I` / `Cmd+I`) o chat. | Pídele que lo guarde en `src/pages/AuthDashboardPreview.tsx`. |
| **Bolt.new / Lovable.dev** | En el prompt de inicio para crear un nuevo proyecto. | Crea el entorno listo con Vite + Tailwind y preview en vivo. |
| **ChatGPT / Claude Web** | En una nueva conversación. | Pídele: *"Dame todo el código en un único componente React con Tailwind para probarlo en StackBlitz o Vite"*. |