const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

for (const gallery of document.querySelectorAll('.gallery')) {
  const screens = [...gallery.querySelectorAll('.browser-screen, .phone-screen')].map(screen => [...screen.querySelectorAll('.slide')]);
  const count = Math.max(...screens.map(slides => slides.length));
  const pager = gallery.querySelector('.pager');
  let active = 0;
  let elapsed = 0;
  let lastTime = 0;
  let visible = false;
  let paused = reducedMotion.matches;
  let hovering = false;
  let focused = false;
  const duration = 6000;

  for (const slides of screens) {
    slides.forEach((slide, index) => {
      slide.setAttribute('aria-hidden', String(index !== active));
      slide.hidden = false;
    });
  }
  for (let index = 0; index < count; index++) {
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label', `${index + 1} of ${count}: Web and iOS screenshots`);
    button.setAttribute('aria-current', String(index === active));
    button.innerHTML = '<svg viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="10" /><circle class="countdown" cx="13" cy="13" r="10" pathLength="100" /></svg>';
    button.addEventListener('click', () => show(index));
    pager.append(button);
  }
  const buttons = [...pager.children];
  const rings = [...pager.querySelectorAll('.countdown')];
  gallery.querySelector('.gallery-controls').hidden = false;

  function show(index) {
    active = (index + count) % count;
    elapsed = 0;
    for (const slides of screens) {
      slides.forEach((slide, i) => { slide.setAttribute('aria-hidden', String(i !== active % slides.length)); });
    }
    buttons.forEach((button, i) => button.setAttribute('aria-current', String(i === active)));
    rings.forEach(ring => { ring.style.strokeDashoffset = '0'; });
  }

  reducedMotion.addEventListener('change', event => { paused = event.matches; });
  gallery.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') hovering = true; });
  gallery.addEventListener('pointerleave', () => { hovering = false; });
  gallery.addEventListener('focusin', () => { focused = true; });
  gallery.addEventListener('focusout', event => { focused = gallery.contains(event.relatedTarget); });
  pager.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    show(event.key === 'Home' ? 0 : event.key === 'End' ? count - 1 : active + (event.key === 'ArrowLeft' ? -1 : 1));
    buttons[active].focus();
  });
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { threshold: .15 }).observe(gallery);

  function tick(time) {
    const delta = Math.min(time - lastTime, 100);
    lastTime = time;
    if (visible && !document.hidden && !paused && !hovering && !focused && screens.every(slides => slides[active % slides.length].complete)) {
      elapsed += delta;
      if (elapsed >= duration) show(active + 1);
      rings[active].style.strokeDashoffset = String(elapsed / duration * 100);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
