// Datos demo para la aplicación MB360

// Clientes
const clients = [
  {
    id: 1,
    name: "Plus Ultra",
    sector: "Aviación",
    status: "crisis", // active, warning, crisis
    statusText: "Crisis"
  },
  {
    id: 2,
    name: "Cliente B",
    sector: "Tecnología",
    status: "active",
    statusText: "Activo"
  },
  {
    id: 3,
    name: "Cliente C",
    sector: "Alimentación",
    status: "warning",
    statusText: "Vigilancia"
  }
];

// Noticias
const newsItems = [
  {
    id: 1,
    title: "Plus Ultra anuncia nueva ruta transoceánica",
    source: "El Confidencial Digital",
    time: "10:30",
    tone: "positive",
    clientId: 1
  },
  {
    id: 2,
    title: "Cliente B supera sus expectativas de ventas trimestrales",
    source: "Expansión",
    time: "09:15",
    tone: "positive",
    clientId: 2
  },
  {
    id: 3,
    title: "Nuevo estudio revela tendencias en el sector alimentario",
    source: "La Razón",
    time: "08:45",
    tone: "neutral",
    clientId: 3
  },
  {
    id: 4,
    title: "Regulaciones gubernamentales afectan a la aviación comercial",
    source: "Europa Press",
    time: "07:20",
    tone: "negative",
    clientId: 1
  },
  {
    id: 5,
    title: "Cliente B enfrenta escasez de componentes tecnológicos",
    source: "El Periódico",
    time: "06:50",
    tone: "negative",
    clientId: 2
  },
  {
    id: 6,
    title: "Encuesta muestra creciente preocupación por alimentos procesados",
    source: "ABC",
    time: "05:30",
    tone: "neutral",
    clientId: 3
  },
  {
    id: 7,
    title: "Plus Ultra investigado por supuestas irregularidades",
    source: "Público",
    time: "04:15",
    tone: "negative",
    clientId: 1
  },
  {
    id: 8,
    title: "Innovación tecnológica impulsa el crecimiento de Cliente B",
    source: "Cinco Días",
    time: "03:00",
    tone: "positive",
    clientId: 2
  }
];

// Playbooks
const playbooks = [
  {
    id: 1,
    clientId: 1, // Plus Ultra
    title: "Crisis de reputación corporativa",
    steps: [
      "Reconocimiento público de la situación",
      "Comunicación empática con stakeholders",
      "Compromiso temporal con acciones concretas"
    ]
  },
  {
    id: 2,
    clientId: null, // Genérico
    title: "Protocolo general de crisis MB360",
    steps: [
      "Activación del equipo de crisis",
      "Evaluación inicial de impacto",
      "Desarrollo de mensaje clave",
      "Distribución coordinada a canales",
      "Monitoreo continuo de respuesta pública"
    ]
  }
];

// Notas guardadas (se actualizará desde localStorage)
let savedNotes = [];