(function () {
  var STORAGE_KEY = 'spuff-admin-projects';
  var defaultProjects = [
    { id: 'proyecto-ejemplo-1', title: 'Figura decorativa geomètrica', description: 'Disseny minimalista en PLA, ideal per a prestatgeries i escriptoris.', images: ['https://picsum.photos/600/600?random=1'], tags: ['decoració', 'geometria', 'PLA'], createdAt: '2025-02-09' },
    { id: 'proyecto-ejemplo-2', title: 'Suport per a auriculars', description: 'Organitzador funcional imprès en PETG, resistent i personalitzable.', images: ['https://picsum.photos/600/600?random=2'], tags: ['organització', 'funcional', 'PETG'], createdAt: '2025-02-09' },
    { id: 'proyecto-ejemplo-3', title: 'Test de flors hexagonal', description: 'Test amb disseny de bresca per a plantes petites.', images: ['https://picsum.photos/600/600?random=3'], tags: ['plantes', 'hexagonal', 'exterior'], createdAt: '2025-02-09' }
  ];

  function id() { return 'proj-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9); }
  function getProjects() {
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (s) { var p = JSON.parse(s); if (p && p.length) return p; }
    } catch (e) {}
    return JSON.parse(JSON.stringify(defaultProjects));
  }
  function saveProjects(projects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    renderList();
  }

  var form = document.getElementById('form');
  var editingId = null;
  var formData = { images: [''], files: [{ name: '', url: '' }], tags: [''] };

  function renderRow(container, value, onChange, onRemove, placeholder, inputType) {
    var div = document.createElement('div');
    div.className = 'row';
    var input = document.createElement('input');
    if (value && typeof value === 'object') {
      if (value.name !== undefined) {
        var nameInp = document.createElement('input');
        nameInp.type = 'text';
        nameInp.placeholder = 'ej: modelo.stl';
        nameInp.value = value.name || '';
        nameInp.oninput = function () { onChange({ name: nameInp.value, url: urlInp.value }); };
        var urlInp = document.createElement('input');
        urlInp.type = 'url';
        urlInp.placeholder = 'URL del archivo';
        urlInp.value = value.url || '';
        urlInp.oninput = function () { onChange({ name: nameInp.value, url: urlInp.value }); };
        div.appendChild(nameInp);
        div.appendChild(urlInp);
      }
    } else {
      input.type = inputType || 'url';
      input.placeholder = placeholder || 'https://...';
      input.value = value || '';
      input.oninput = function () { onChange(input.value); };
      div.appendChild(input);
    }
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-small';
    btn.textContent = '−';
    btn.onclick = onRemove;
    div.appendChild(btn);
    if (value && typeof value === 'object' && value.url !== undefined) {
      container.appendChild(div);
      return;
    }
    container.appendChild(div);
  }

  function syncForm() {
    var imgCont = document.getElementById('f-images');
    var fileCont = document.getElementById('f-files');
    var tagCont = document.getElementById('f-tags');
    imgCont.innerHTML = '';
    fileCont.innerHTML = '';
    tagCont.innerHTML = '';
    formData.images.forEach(function (v, i) {
      renderRow(imgCont, v, function (val) { formData.images[i] = val; }, function () { formData.images.splice(i, 1); syncForm(); });
    });
    formData.files.forEach(function (v, i) {
      var div = document.createElement('div');
      div.className = 'row';
      var n = document.createElement('input');
      n.type = 'text';
      n.placeholder = 'ej: modelo.stl';
      n.value = v.name || '';
      var u = document.createElement('input');
      u.type = 'url';
      u.placeholder = 'URL';
      u.value = v.url || '';
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn-small';
      b.textContent = '−';
      b.onclick = function () { formData.files.splice(i, 1); syncForm(); };
      n.oninput = function () { formData.files[i] = { name: n.value, url: u.value }; };
      u.oninput = function () { formData.files[i] = { name: n.value, url: u.value }; };
      div.appendChild(n);
      div.appendChild(u);
      div.appendChild(b);
      fileCont.appendChild(div);
    });
    formData.tags.forEach(function (v, i) {
      renderRow(tagCont, v, function (val) { formData.tags[i] = val; }, function () { formData.tags.splice(i, 1); syncForm(); }, 'ej: PLA, decoración', 'text');
    });
  }

  document.getElementById('add-image').onclick = function () { formData.images.push(''); syncForm(); };
  document.getElementById('add-file').onclick = function () { formData.files.push({ name: '', url: '' }); syncForm(); };
  document.getElementById('add-tag').onclick = function () { formData.tags.push(''); syncForm(); };

  document.getElementById('btn-new').onclick = function () {
    editingId = null;
    formData = { images: [''], files: [{ name: '', url: '' }], tags: [''] };
    document.getElementById('f-title').value = '';
    document.getElementById('f-desc').value = '';
        document.getElementById('form-title').textContent = 'Nou projecte';
    syncForm();
    form.classList.remove('hidden');
  };

  document.getElementById('btn-cancel').onclick = function () { form.classList.add('hidden'); };

  form.onsubmit = function (e) {
    e.preventDefault();
    var title = document.getElementById('f-title').value.trim();
    var desc = document.getElementById('f-desc').value.trim();
    var images = formData.images.filter(function (x) { return (x && typeof x === 'string') ? x.trim() : false; });
    var tags = formData.tags.filter(function (x) { return (x && typeof x === 'string') ? x.trim() : false; });
    var files = formData.files.filter(function (f) { return f.name && f.url; });
    if (!title || !desc) return;
    var projects = getProjects();
    var proj = {
      id: editingId || id(),
      title: title,
      description: desc,
      images: images,
      tags: tags,
      createdAt: editingId ? (projects.find(function (p) { return p.id === editingId; }) || {}).createdAt || new Date().toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
    };
    if (files.length) proj.files = files;
    if (editingId) {
      projects = projects.map(function (p) { return p.id === editingId ? proj : p; });
    } else {
      projects.push(proj);
    }
    saveProjects(projects);
    form.classList.add('hidden');
  };

  function renderList() {
    var projects = getProjects();
    document.getElementById('count').textContent = projects.length;
    var list = document.getElementById('projects-list');
    list.innerHTML = projects.map(function (p) {
      var thumb = p.images && p.images[0]
        ? '<img src="' + p.images[0].replace(/"/g, '&quot;') + '" alt="">'
        : '<div class="thumb-placeholder">🖼</div>';
      return '<div class="admin-item" data-id="' + (p.id || '').replace(/"/g, '&quot;') + '">' +
        thumb +
        '<div class="admin-item-info"><strong>' + (p.title || '').replace(/</g, '&lt;') + '</strong><small>' + (p.description || '').replace(/</g, '&lt;') + '</small></div>' +
        '<div class="admin-item-actions">' +
          '<button type="button" class="edit">Editar</button>' +
          '<button type="button" class="del">Eliminar</button>' +
        '</div></div>';
    }).join('');
    list.querySelectorAll('.edit').forEach(function (btn) {
      btn.onclick = function () {
        var item = btn.closest('.admin-item');
        var pid = item && item.getAttribute('data-id');
        var p = projects.find(function (x) { return x.id === pid; });
        if (!p) return;
        editingId = p.id;
        document.getElementById('f-title').value = p.title || '';
        document.getElementById('f-desc').value = p.description || '';
        formData = {
          images: (p.images && p.images.length) ? p.images.slice() : [''],
          files: (p.files && p.files.length) ? p.files.map(function (f) { return { name: f.name, url: f.url }; }) : [{ name: '', url: '' }],
          tags: (p.tags && p.tags.length) ? p.tags.slice() : ['']
        };
        document.getElementById('form-title').textContent = 'Editar projecte';
        syncForm();
        form.classList.remove('hidden');
      };
    });
    list.querySelectorAll('.del').forEach(function (btn) {
      btn.onclick = function () {
        if (!confirm('Eliminar aquest projecte?')) return;
        var item = btn.closest('.admin-item');
        var pid = item && item.getAttribute('data-id');
        saveProjects(projects.filter(function (p) { return p.id !== pid; }));
      };
    });
  }

  document.getElementById('btn-export').onclick = function () {
    var blob = new Blob([JSON.stringify(getProjects(), null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'projects.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  document.getElementById('input-import').onchange = function () {
    var f = this.files[0];
    if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      try {
        var data = JSON.parse(r.result);
        if (Array.isArray(data)) {
          saveProjects(data);
          alert('Projectes importats correctament.');
        } else alert('El fitxer ha de contenir un array de projectes.');
      } catch (e) { alert('Error en parsejar el JSON.'); }
    };
    r.readAsText(f);
    this.value = '';
  };

  renderList();
})();
