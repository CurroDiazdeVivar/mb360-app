// Funcionalidad principal de la aplicación MB360

// Verificar si estamos en modo Telegram WebApp o demo
const isTelegramMode = typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp;

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
  loadSavedNotes();
  
  // Si estamos en Telegram, configurar la integración
  if (isTelegramMode) {
    setupTelegramIntegration();
  } else {
    // Mostrar modo demo
    document.getElementById('demo-mode').classList.remove('hidden');
  }
});

// Inicializar la aplicación
function initializeApp() {
  // Renderizar vistas iniciales
  renderDashboard();
  renderClientsList();
  renderPressList();
  renderCrisisView();
  renderNotesForm();
  renderSavedNotes();
  
  // Configurar filtros de prensa
  setupPressFilters();
}

// Configurar integración con Telegram
function setupTelegramIntegration() {
  const webApp = window.Telegram.WebApp;
  
  // Notificar que la app está lista
  webApp.ready();
  
  // Expandir la app para ocupar toda la pantalla
  webApp.expand();
  
  // Aplicar tema de Telegram si está disponible
  if (webApp.themeParams) {
    const theme = webApp.themeParams;
    document.documentElement.style.setProperty('--bg-primary', theme.bg_color || '#0B1F3A');
    document.documentElement.style.setProperty('--text-primary', theme.text_color || '#FFFFFF');
  }
  
  // Configurar el botón principal de Telegram
  webApp.MainButton.setText("Guardar nota").hide();
  
  // Mostrar el botón principal cuando se esté en la vista de notas
  document.getElementById('bottom-nav').addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-button') && e.target.dataset.view === 'notes-view') {
      webApp.MainButton.show();
    } else {
      webApp.MainButton.hide();
    }
  });
  
  // Configurar retroalimentación háptica
  document.body.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.classList.contains('nav-button')) {
      webApp.HapticFeedback.impactOccurred('light');
    }
  });
}

// Configurar listeners de eventos
function setupEventListeners() {
  // Navegación entre pestañas
  document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', function() {
      const viewId = this.dataset.view;
      switchView(viewId);
    });
  });
  
  // Selector de sesión
  document.getElementById('session-selector').addEventListener('change', function() {
    const session = this.value;
    localStorage.setItem('mb360-session', session);
  });
  
  // Formulario de notas
  document.getElementById('note-form').addEventListener('submit', function(e) {
    e.preventDefault();
    saveNote();
  });
  
  // Botón de copiar holding statement
  document.getElementById('copy-statement').addEventListener('click', function() {
    copyToClipboard(document.getElementById('statement-text').textContent);
    
    // Feedback visual
    const originalText = this.textContent;
    this.textContent = '¡Copiado!';
    setTimeout(() => {
      this.textContent = originalText;
    }, 2000);
  });
  
  // Búsqueda en prensa
  document.getElementById('press-search').addEventListener('input', function() {
    renderPressList();
  });
  
  // Filtro por cliente en prensa
  document.getElementById('press-client-filter').addEventListener('change', function() {
    renderPressList();
  });
}

// Cambiar vista activa
function switchView(viewId) {
  // Ocultar todas las vistas
  document.querySelectorAll('.view').forEach(view => {
    view.classList.remove('active');
  });
  
  // Mostrar la vista seleccionada
  document.getElementById(viewId).classList.add('active');
  
  // Actualizar botones de navegación
  document.querySelectorAll('.nav-button').forEach(button => {
    button.classList.remove('active');
  });
  document.querySelector(`[data-view="${viewId}"]`).classList.add('active');
}

// Renderizar dashboard
function renderDashboard() {
  // Mostrar/ocultar banner de crisis
  const crisisBanner = document.getElementById('crisis-banner');
  const hasActiveCrisis = clients.some(client => client.status === 'crisis');
  
  if (hasActiveCrisis) {
    crisisBanner.classList.remove('hidden');
  } else {
    crisisBanner.classList.add('hidden');
  }
  
  // Actualizar KPIs
  document.getElementById('kpi-clients').textContent = clients.filter(c => c.status === 'active').length;
  document.getElementById('kpi-alerts').textContent = newsItems.filter(n => n.tone === 'negative').length;
  document.getElementById('kpi-crisis').textContent = clients.filter(c => c.status === 'crisis').length;
  
  // Renderizar últimas noticias
  const newsList = document.getElementById('news-list');
  newsList.innerHTML = '';
  
  // Mostrar las 4 últimas noticias
  const latestNews = [...newsItems].reverse().slice(0, 4);
  
  latestNews.forEach(news => {
    const newsElement = document.createElement('div');
    newsElement.className = `news-item ${news.tone}`;
    newsElement.innerHTML = `
      <div>${news.title}</div>
      <div class="source">${news.source}</div>
      <div class="time">${news.time}</div>
    `;
    newsList.appendChild(newsElement);
  });
}

// Renderizar lista de clientes
function renderClientsList() {
  const clientsList = document.getElementById('clients-list');
  clientsList.innerHTML = '';
  
  clients.forEach(client => {
    const clientElement = document.createElement('div');
    clientElement.className = 'client-item';
    
    let statusClass = '';
    switch (client.status) {
      case 'active':
        statusClass = 'status-active';
        break;
      case 'warning':
        statusClass = 'status-warning';
        break;
      case 'crisis':
        statusClass = 'status-crisis';
        break;
    }
    
    clientElement.innerHTML = `
      <div>
        <div><strong>${client.name}</strong></div>
        <div>${client.sector}</div>
      </div>
      <div class="client-status ${statusClass}">${client.statusText}</div>
    `;
    
    clientsList.appendChild(clientElement);
  });
}

// Configurar filtros de prensa
function setupPressFilters() {
  const clientFilter = document.getElementById('press-client-filter');
  
  // Agregar opciones de cliente
  clients.forEach(client => {
    const option = document.createElement('option');
    option.value = client.id;
    option.textContent = client.name;
    clientFilter.appendChild(option);
  });
}

// Renderizar lista de prensa
function renderPressList() {
  const pressList = document.getElementById('press-list');
  const searchTerm = document.getElementById('press-search').value.toLowerCase();
  const clientId = document.getElementById('press-client-filter').value;
  
  pressList.innerHTML = '';
  
  let filteredNews = newsItems;
  
  // Filtrar por término de búsqueda
  if (searchTerm) {
    filteredNews = filteredNews.filter(news => 
      news.title.toLowerCase().includes(searchTerm) ||
      news.source.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filtrar por cliente
  if (clientId) {
    filteredNews = filteredNews.filter(news => news.clientId == clientId);
  }
  
  // Ordenar por tiempo (más reciente primero)
  filteredNews.sort((a, b) => b.time.localeCompare(a.time));
  
  filteredNews.forEach(news => {
    const newsElement = document.createElement('div');
    newsElement.className = `news-item ${news.tone}`;
    
    let toneText = '';
    switch (news.tone) {
      case 'positive':
        toneText = 'Positivo';
        break;
      case 'neutral':
        toneText = 'Neutro';
        break;
      case 'negative':
        toneText = 'Negativo';
        break;
    }
    
    newsElement.innerHTML = `
      <div><strong>${news.title}</strong></div>
      <div class="source">${news.source} • ${toneText}</div>
      <div class="time">${news.time}</div>
    `;
    
    pressList.appendChild(newsElement);
  });
}

// Renderizar vista de crisis
function renderCrisisView() {
  // Mostrar/ocultar holding statement
  const crisisStatement = document.getElementById('crisis-statement');
  const hasActiveCrisis = clients.some(client => client.status === 'crisis');
  
  if (hasActiveCrisis) {
    crisisStatement.classList.remove('hidden');
  } else {
    crisisStatement.classList.add('hidden');
  }
  
  // Renderizar playbooks
  const playbooksList = document.getElementById('playbooks-list');
  playbooksList.innerHTML = '';
  
  playbooks.forEach(playbook => {
    const playbookElement = document.createElement('div');
    playbookElement.className = 'playbook-item';
    playbookElement.innerHTML = `<h4>${playbook.title}</h4>`;
    
    const stepsList = document.createElement('ol');
    playbook.steps.forEach(step => {
      const stepItem = document.createElement('li');
      stepItem.textContent = step;
      stepsList.appendChild(stepItem);
    });
    
    playbookElement.appendChild(stepsList);
    playbooksList.appendChild(playbookElement);
  });
}

// Renderizar formulario de notas
function renderNotesForm() {
  const noteClient = document.getElementById('note-client');
  
  // Limpiar opciones existentes
  noteClient.innerHTML = '<option value="">Seleccionar cliente</option>';
  
  // Agregar clientes al select
  clients.forEach(client => {
    const option = document.createElement('option');
    option.value = client.id;
    option.textContent = client.name;
    noteClient.appendChild(option);
  });
}

// Guardar nota
function saveNote() {
  const clientId = document.getElementById('note-client').value;
  const title = document.getElementById('note-title').value;
  const content = document.getElementById('note-content').value;
  
  if (!clientId || !title || !content) {
    alert('Por favor, completa todos los campos');
    return;
  }
  
  const note = {
    id: Date.now(), // ID único basado en timestamp
    clientId: parseInt(clientId),
    title,
    content,
    date: new Date().toLocaleString('es-ES')
  };
  
  // Agregar nota al array
  savedNotes.push(note);
  
  // Guardar en localStorage
  localStorage.setItem('mb360-notes', JSON.stringify(savedNotes));
  
  // Actualizar vista
  renderSavedNotes();
  
  // Limpiar formulario
  document.getElementById('note-form').reset();
  
  // Feedback visual
  if (isTelegramMode) {
    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
  }
  
  // Mostrar confirmación
  const submitButton = document.querySelector('#note-form button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = '¡Guardado!';
  setTimeout(() => {
    submitButton.textContent = originalText;
  }, 2000);
}

// Cargar notas guardadas
function loadSavedNotes() {
  const savedNotesData = localStorage.getItem('mb360-notes');
  if (savedNotesData) {
    savedNotes = JSON.parse(savedNotesData);
  }
}

// Renderizar notas guardadas
function renderSavedNotes() {
  const savedNotesContainer = document.getElementById('saved-notes');
  savedNotesContainer.innerHTML = '';
  
  if (savedNotes.length === 0) {
    savedNotesContainer.innerHTML = '<p>No hay notas guardadas</p>';
    return;
  }
  
  // Ordenar por fecha (más reciente primero)
  const sortedNotes = [...savedNotes].sort((a, b) => b.id - a.id);
  
  sortedNotes.forEach(note => {
    const noteElement = document.createElement('div');
    noteElement.className = 'note-item';
    
    // Encontrar nombre del cliente
    const client = clients.find(c => c.id === note.clientId);
    const clientName = client ? client.name : 'Cliente desconocido';
    
    noteElement.innerHTML = `
      <div class="note-date">${note.date}</div>
      <div><strong>${note.title}</strong> (${clientName})</div>
      <div>${note.content}</div>
    `;
    
    savedNotesContainer.appendChild(noteElement);
  });
}

// Copiar texto al portapapeles
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Error al copiar al portapapeles:', err);
    });
  } else {
    // Fallback para navegadores antiguos
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}