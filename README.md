# Generador de Horarios UCAB 📅

Planificador y generador inteligente de combinaciones de horarios sin choques para estudiantes de la **Universidad Católica Andrés Bello (UCAB)**.

Soporta actualmente:
- 💻 **Ingeniería Informática** (Pensum Oficial 8 Semestres)
- 🧠 **Psicología** (Pensum Oficial 8 Semestres)

---

## ✨ Características Principales

- **Multi-carrera**: Selector inicial de carrera y cambio en cualquier momento sin perder los datos guardados.
- **Teoría + Práctica vinculadas**: Emparejamiento de secciones teóricas con sus prácticas correspondientes sin choques.
- **Materias Virtuales Asíncronas**: Ubicación automática en Domingo para no interferir con clases presenciales.
- **Horas Redondas (24h)**: Selectores precisos de 07:00 a 22:00.
- **Descarga en Imagen (PNG)**: Descarga directa de tu horario en alta resolución con un solo clic.
- **Copiado de NRCs**: Exporta la lista limpia de NRCs formateada para inscribir en el portal universitario.
- **Persistencia Local**: Guarda tus materias seleccionadas, secciones y NRCs independientemente para cada carrera en el navegador (`localStorage`).
- **Arquitectura Modular**: Código desacoplado en componentes React, servicios puros y datos de pensums ampliables.

---

## 🚀 Inicio Rápido

### Requisitos
- [Node.js](https://nodejs.org/) v18 o superior
- `npm` (incluido con Node)

### Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/vlessvndroo/HorariosPlusAlessVersion.git
   cd HorariosPlusAlessVersion
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo local:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación en vivo con HMR instantáneo.

---

## 🛠️ Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor local de desarrollo con Vite en `http://localhost:3000` |
| `npm run build` | Compila y optimiza la aplicación para producción en la carpeta `dist/` |
| `npm run preview` | Previsualiza localmente el bundle de producción generado |

---

## 📁 Estructura del Proyecto

```text
├── .github/workflows/deploy.yml   # Despliegue continuo a GitHub Pages
├── legacy/                        # Archivo monolítico original como respaldo histórico
│   └── horarios_monolito.html
├── src/
│   ├── constants/                 # Carreras, paletas temáticas y configuración de horas
│   │   ├── careers.js
│   │   ├── palettes.js
│   │   └── schedule.js
│   ├── data/curricula/            # Pensums oficiales por carrera
│   │   ├── informatica.js
│   │   └── psicologia.js
│   ├── services/
│   │   └── schedulerEngine.js     # Motor de backtracking y cálculo de combinaciones sin choques
│   ├── utils/
│   │   ├── exportUtils.js         # Exportación a PNG (html2canvas) y copiado de NRCs
│   │   ├── storage.js             # Persistencia por carrera en localStorage
│   │   └── timeUtils.js           # Cálculo y solapamiento de horas 24h
│   ├── components/
│   │   ├── calendar/              # Grilla semanal interactiva y tarjetas de bloques de clase
│   │   │   ├── CalendarSlot.jsx
│   │   │   └── ScheduleCalendar.jsx
│   │   ├── common/                # Header superior y barra de navegación de 3 pasos
│   │   │   ├── Header.jsx
│   │   │   └── TabNav.jsx
│   │   ├── modals/                # Modal para materias personalizadas
│   │   │   └── NewCourseModal.jsx
│   │   ├── sections/              # Editores especializados de secciones (estándar, teoría+práctica, virtual)
│   │   │   ├── StandardSectionEditor.jsx
│   │   │   ├── TheoryPracticeEditor.jsx
│   │   │   └── VirtualSectionEditor.jsx
│   │   ├── tabs/                  # Vistas principales de cada paso
│   │   │   ├── CombinationsTab.jsx
│   │   │   ├── CourseSelectionTab.jsx
│   │   │   └── NrcEditorTab.jsx
│   │   └── views/                 # Pantalla de bienvenida y selección de carrera
│   │       └── CareerSelectScreen.jsx
│   ├── App.jsx                    # Orquestador del estado de la aplicación
│   ├── index.css                  # Estilos globales y tokens de Tailwind CSS
│   └── main.jsx                   # Punto de entrada de React
├── index.html                     # Entry point de la SPA
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## ➕ Cómo Agregar una Nueva Carrera

Para añadir un nuevo pensum (por ejemplo, *Ingeniería Civil* o *Derecho*):

1. Crea un nuevo archivo en `src/data/curricula/miCarrera.js` con el listado de materias por semestre.
2. Regístrala en `src/constants/careers.js`:
   ```javascript
   import { CURRICULUM_MI_CARRERA } from '../data/curricula/miCarrera';

   export const CAREERS = {
     // ... otras carreras
     mi_carrera: {
       id: 'mi_carrera',
       name: 'Ingeniería Civil',
       shortName: 'Civil',
       icon: '🏗️',
       faculty: 'Facultad de Ingeniería',
       description: 'Pensum oficial de Ingeniería Civil.',
       curriculum: CURRICULUM_MI_CARRERA
     }
   };
   ```
3. ¡Listo! La carrera aparecerá automáticamente en el selector inicial y en la navegación.

---

Hecho con ❤️ para la comunidad de estudiantes de la UCAB.
