(function () {
  var STORAGE_KEY = 'spuff-admin-projects';
  var WHATSAPP = 'https://wa.me/34623963086';

  var defaultProjects = [
    { id: 'proyecto-ejemplo-1', title: 'Figura decorativa geomètrica', description: 'Disseny minimalista en PLA, ideal per a prestatgeries i escriptoris.', images: ['https://picsum.photos/600/600?random=1'], tags: ['decoració', 'geometria', 'PLA'], createdAt: '2025-02-09' },
    { id: 'proyecto-ejemplo-2', title: 'Suport per a auriculars', description: 'Organitzador funcional imprès en PETG, resistent i personalitzable.', images: ['https://picsum.photos/600/600?random=2'], tags: ['organització', 'funcional', 'PETG'], createdAt: '2025-02-09' },
    { id: 'proyecto-ejemplo-3', title: 'Test de flors hexagonal', description: 'Test amb disseny de bresca per a plantes petites.', images: ['https://picsum.photos/600/600?random=3'], tags: ['plantes', 'hexagonal', 'exterior'], createdAt: '2025-02-09' }
  ];

  function getProjects() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        var parsed = JSON.parse(stored);
        if (parsed && parsed.length) return parsed;
      }
    } catch (e) {}
    return defaultProjects;
  }

  function renderProjects(projects) {
    var grid = document.getElementById('projects-grid');
    if (!grid) return;
    grid.innerHTML = projects.map(function (p) {
      var img = p.images && p.images[0]
        ? '<img src="' + p.images[0].replace(/"/g, '&quot;') + '" alt="' + (p.title || '').replace(/"/g, '&quot;') + '">'
        : '<div class="empty"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8 4-8-4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg></div>';
      var tags = (p.tags || []).map(function (t) {
        return '<span class="card-tag">' + (t || '').replace(/</g, '&lt;') + '</span>';
      }).join('');
      var waText = encodeURIComponent('Hola! M\'interessa el disseny "' + (p.title || '') + '"');
      return '<article class="card">' +
        '<div class="card-img">' + img + '</div>' +
        '<div class="card-body">' +
          '<h3>' + (p.title || '').replace(/</g, '&lt;') + '</h3>' +
          '<p class="card-desc">' + (p.description || '').replace(/</g, '&lt;') + '</p>' +
          '<div class="card-tags">' + tags + '</div>' +
          '<a href="' + WHATSAPP + '?text=' + waText + '" target="_blank" rel="noopener noreferrer" class="card-link">Demanar pressupost <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg></a>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  document.getElementById('year').textContent = new Date().getFullYear();
  renderProjects(getProjects());
})();
