function initProjects() {
  initProjectFilter();
  initProjectModal();
}

/*  Filter  */
function initProjectFilter() {
  const filterItems  = document.querySelectorAll('.filter-item');
  const projectCards = document.querySelectorAll('.project-card');
  const countEl      = document.getElementById('visibleCount');
  const emptyState   = document.getElementById('emptyState');
  if (filterItems.length === 0) return;

  function applyFilter(filter) {
    let visible = 0;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !match);
      if (match) visible++;
    });
    if (countEl)    countEl.textContent = visible;
    if (emptyState) emptyState.classList.toggle('visible', visible === 0);
    filterItems.forEach(item =>
      item.classList.toggle('active', item.dataset.filter === filter)
    );
  }

  filterItems.forEach(item => {
    item.addEventListener('click', () => applyFilter(item.dataset.filter));
  });
}

/*  Modal  */
function initProjectModal() {
  const overlay    = document.getElementById('modalOverlay');
  const modalCat   = document.getElementById('modalCat');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc  = document.getElementById('modalDesc');
  const modalRole  = document.getElementById('modalRole');
  const modalOut   = document.getElementById('modalOutcome');
  const modalTags  = document.getElementById('modalTags');
  const modalThumb = document.getElementById('modalThumb');
  if (!overlay) return;

  const thumbClasses = {
    cpp:   'project-card__thumb--cpp',
    unity: 'project-card__thumb--unity',
    eng:   'project-card__thumb--eng'
  };
  const catLabels = {
    cpp:   'C++',
    unity: 'Unity / C#',
    eng:   'Engineering Labs'
  };

  function openModal(card) {
    const d = card.dataset;
    const img = d.image;
    modalCat.textContent   = catLabels[d.category] || d.category;
    modalTitle.textContent = d.title;
    modalDesc.textContent  = d.descLong;
    modalRole.textContent  = d.role;
    modalOut.textContent   = d.outcome;
    modalTags.innerHTML    = d.tags
      .split(',')
      .map(t => `<span class="tag">${t.trim()}</span>`)
      .join('');
    modalThumb.className = `modal__thumb ${thumbClasses[d.category] || ''}`;
    modalThumb.innerHTML = `<span style="font-size:3.5rem">${d.emoji}</span>`;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (img) {
  modalThumb.innerHTML = `<img src="${img}" alt="${d.title}" />`;
} else {
  modalThumb.innerHTML = `<span style="font-size:3.5rem">${d.emoji}</span>`;
}
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.project-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') openModal(card);
    });
  });

  document.getElementById('modalClose')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}