const panel = document.querySelector('#animation-preview');
const canvas = document.querySelector('#led-preview');
const context = canvas.getContext('2d');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let animation;
let paused = reducedMotion.matches;
let visible = false;
let lastTime = 0;
let renderTime = 0;

// Load the Lua runtime only when the preview approaches the viewport.
const observer = new IntersectionObserver(async entries => {
  visible = entries[0].isIntersecting;
  if (!visible || panel.dataset.loaded) return;
  panel.dataset.loaded = 'true';
  try {
    const [{ Animation }, response] = await Promise.all([
      import('./lua-runtime.js'), fetch('./assets/presets.json?v=4'),
    ]);
    if (!response.ok) throw new Error('Could not load presets');
    const presets = await response.json();
    const buttons = [];
    for (const preset of presets) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'preset';
      button.textContent = preset.name;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        try {
          animation?.close();
          animation = new Animation(preset.source, 60, 'WS2812');
          buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
          canvas.setAttribute('aria-label', `Live preview of the ${preset.name} animation on 60 LEDs`);
          document.querySelector('#preview-error').hidden = true;
          renderTime = 0;
          draw(animation.tick());
        } catch (error) {
          animation = undefined;
          document.querySelector('#preview-error').hidden = false;
        }
      });
      buttons.push(button);
      document.querySelector('#presets').append(button);
    }
    buttons[0].click();
    requestAnimationFrame(tick);
  } catch (error) {
    document.querySelector('#preview-error').hidden = false;
  }
}, { rootMargin: '120px' });
observer.observe(panel);

reducedMotion.addEventListener('change', event => { paused = event.matches; });
new ResizeObserver(() => { if (animation) draw(animation.pixels); }).observe(canvas);

function draw(pixels) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const scale = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  context.setTransform(scale, 0, 0, scale, 0, 0);
  const cell = (width - 16) / pixels.length;
  context.fillStyle = '#282828';
  context.fillRect(6, height / 2 - 5, width - 12, 10);
  for (const [i, pixel] of pixels.entries()) {
    context.fillStyle = `rgb(${pixel.red}, ${pixel.green}, ${pixel.blue})`;
    context.shadowColor = context.fillStyle;
    context.shadowBlur = 16;
    context.fillRect(8 + i * cell, height / 2 - 3, Math.max(1, cell - 2), 6);
  }
}

function tick(time) {
  const delta = Math.min(time - lastTime, 100);
  lastTime = time;
  if (animation && visible && !paused && !document.hidden) {
    renderTime += delta;
    if (renderTime >= 33) {
      renderTime %= 33;
      try { draw(animation.tick()); }
      catch (error) {
        animation.close(); animation = undefined;
        document.querySelector('#preview-error').hidden = false;
      }
    }
  }
  requestAnimationFrame(tick);
}
