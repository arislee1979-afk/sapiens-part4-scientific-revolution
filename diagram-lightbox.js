(() => {
  const cards = [...document.querySelectorAll('[data-diagram-card]')];
  if (!cards.length || document.querySelector('[data-diagram-lightbox]')) return;

  const lightbox = document.createElement('div');
  lightbox.className = 'diagram-lightbox';
  lightbox.dataset.diagramLightbox = '';
  lightbox.hidden = true;
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.innerHTML = `
    <div class="diagram-lightbox__panel">
      <div class="diagram-lightbox__header">
        <div class="diagram-lightbox__title" data-diagram-lightbox-title></div>
        <button class="btn btn-glass" type="button" data-diagram-close aria-label="關閉全螢幕圖示">關閉</button>
      </div>
      <div class="diagram-lightbox__stage" data-diagram-lightbox-stage></div>
    </div>`;
  document.body.append(lightbox);

  const title = lightbox.querySelector('[data-diagram-lightbox-title]');
  const stage = lightbox.querySelector('[data-diagram-lightbox-stage]');
  const closeButton = lightbox.querySelector('[data-diagram-close]');
  let returnFocus = null;

  const open = (card, trigger) => {
    const svg = card.querySelector('.svg-shell svg');
    if (!svg) return;
    returnFocus = trigger;
    title.textContent = card.dataset.diagramTitle || card.querySelector('h2, h3')?.textContent || '圖示';
    stage.replaceChildren(svg.cloneNode(true));
    lightbox.hidden = false;
    document.body.classList.add('diagram-modal-open');
    closeButton.focus();
  };

  const close = () => {
    lightbox.hidden = true;
    stage.replaceChildren();
    document.body.classList.remove('diagram-modal-open');
    returnFocus?.focus();
  };

  cards.forEach((card) => {
    const shell = card.querySelector('.svg-shell');
    if (!shell) return;
    shell.tabIndex = 0;
    shell.setAttribute('role', 'button');
    shell.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      open(card, shell);
    });
  });

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-diagram-open], [data-diagram-card] .svg-shell');
    if (trigger) {
      const card = trigger.closest('[data-diagram-card]');
      if (card) open(card, trigger);
      return;
    }
    if (event.target === lightbox || event.target.closest('[data-diagram-close]')) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !lightbox.hidden) close();
  });
})();
