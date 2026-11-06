/* nav-tableros.js · botón «⌂ Tableros ▾» común a la portada y a todos los tableros del portal (26-Set-26, pedido del usuario:
   «enlaza los tableros… un botón para regresar al menú principal… tiene que estar interconectado… un botón discreto, que sea
   visible también, para poder navegar entre tableros»; eligió «⌂ Tableros ▾» en la cabecera).
   Uso: <script src="../nav-tableros.js" defer></script> (o "nav-tableros.js" en la raíz). Se monta en el elemento
   [data-nav-tableros]; si no lo hay, reemplaza el enlace «Portada» de la cabecera (a.iconbtn[href="../"]); si tampoco, queda fijo
   arriba a la derecha. Al pasar el puntero se abre (sin clic); con clic o toque también. Esc o un clic fuera lo cierran. */
(function () {
  if (window.__navTableros) return; window.__navTableros = true;
  const src = (document.currentScript && document.currentScript.src) || '';
  const BASE = src ? new URL('.', src).href : new URL('./', location.href).href;
  const T = [
    { k: 'portada', n: 'Inicio', s: 'el proyecto en una mirada', u: '', g: 'casa' },
    { k: 'lt', n: 'LT 220 kV Río Claro – Cerro Azul', s: 'avance, BIM 4D, fotos y reportes', u: 'tablero.html', g: 'torre' },
    { k: 'sri', n: 'SE Río Claro', s: 'inicio · ampliación en 4D', u: 'se-rio-claro/', g: 'se' },
    { k: 'scz', n: 'SE Cerro Azul', s: 'llegada · SE nueva en 3D', u: 'se-cerro-azul/', g: 'se' },
  ];
  const G = {
    casa: '<path d="M3 11l9-7 9 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/>',
    cubo: '<path d="M12 2.8l8.2 4.6v9.2L12 21.2l-8.2-4.6V7.4z"/><path d="M12 12l8.2-4.6M12 12v9.2M12 12L3.8 7.4"/>',
    torre: '<path d="M12 2.5L7 21.5M12 2.5l5 19M6 7h12M7.6 12h8.8M9 16.5h6M7 21.5l5-5 5 5"/>',
    se: '<circle cx="12" cy="12" r="8.2"/><circle cx="12" cy="12" r="3.2"/>',
  };
  const svg = (g) => `<svg viewBox="0 0 24 24" aria-hidden="true">${G[g]}</svg>`;
  // tablero actual por la ruta
  const rel = (() => { try { const p = new URL(location.href).pathname, b = new URL(BASE).pathname; return p.startsWith(b) ? p.slice(b.length) : p; } catch (e) { return ''; } })();
  const actual = rel.startsWith('se-rio-claro') ? 'sri' : rel.startsWith('se-cerro-azul') ? 'scz'
    : /^(tablero|visita)\.html/.test(rel) ? 'lt' : 'portada';

  const css = `
.ntb{position:relative;display:inline-flex;font:500 13px/1.2 "Inter",system-ui,sans-serif}
.ntb-btn{display:inline-flex;align-items:center;gap:6px;cursor:pointer;white-space:nowrap}
.ntb-btn svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.ntb-btn .ntb-v{font-size:10px;opacity:.8;transition:transform .15s}
.ntb.abierto .ntb-btn .ntb-v{transform:rotate(180deg)}
.ntb-btn:not(.iconbtn){border:1px solid #c9d6ea;background:#fff;color:#1e4fa3;border-radius:999px;padding:6px 12px}
.ntb-menu{position:fixed;top:0;left:0;z-index:10050;min-width:268px;background:#ffffff;color:#0b192f;border:1px solid #d6dfec;
  border-radius:12px;padding:6px;box-shadow:0 18px 40px -12px rgba(15,40,90,.28);opacity:0;transform:translateY(-4px);pointer-events:none;transition:opacity .14s,transform .14s}
.ntb-menu.abierto{opacity:1;transform:none;pointer-events:auto}
.ntb-menu::before{content:"";position:absolute;top:-9px;right:0;left:0;height:9px}
.ntb-menu a{display:grid;grid-template-columns:30px 1fr auto;align-items:center;gap:0 10px;padding:7px 9px;border-radius:8px;color:#0b192f;text-decoration:none}
.ntb-menu a svg{width:18px;height:18px;fill:none;stroke:#2563eb;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;justify-self:center}
.ntb-menu a b{display:block;font:600 13.5px/1.2 "Manrope","Inter",sans-serif;letter-spacing:.005em}
.ntb-menu a small{display:block;font-size:11px;color:#5e769d;margin-top:1px}
.ntb-menu a:hover,.ntb-menu a:focus-visible{background:#eef4ff;outline:none}
.ntb-menu a.aqui{background:#f3f6fb;cursor:default}
.ntb-menu a.aqui::after{content:"aquí";font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#fff;background:#2563eb;border-radius:999px;padding:2px 7px}
.ntb-menu hr{border:0;border-top:1px solid #e3e9f3;margin:5px 4px}
.ntb-fijo{position:fixed;top:12px;right:14px;z-index:10050}
@media (max-width:560px){.ntb-btn .ntb-t{display:none}.ntb-menu{min-width:244px}}
@media print{.ntb{display:none}}`;

  function montar() {
    if (document.querySelector('.ntb')) return;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const cont = document.createElement('div'); cont.className = 'ntb';
    const items = T.map((t, i) => `${i === 1 ? '<hr>' : ''}<a role="menuitem" href="${t.k === actual ? '#' : BASE + t.u}" class="${t.k === actual ? 'aqui' : ''}"${t.k === actual ? ' aria-current="page"' : ''}>${svg(t.g)}<span><b>${t.n}</b><small>${t.s}</small></span></a>`).join('');
    cont.innerHTML = `<button type="button" class="ntb-btn" aria-haspopup="true" aria-expanded="false" title="Ir a la portada o a otro tablero">${svg('casa')}<span class="ntb-t">Tableros</span><span class="ntb-v">▾</span></button><nav class="ntb-menu" role="menu" aria-label="Tableros del proyecto">${items}</nav>`;
    const btn = cont.querySelector('.ntb-btn'), menu = cont.querySelector('.ntb-menu');
    document.body.appendChild(menu);   // fuera de la cabecera: ni su overflow ni su contexto de apilamiento lo tapan
    const lugar = document.querySelector('[data-nav-tableros]'), portada = !lugar && document.querySelector('a.iconbtn[href="../"]');
    if (lugar) { lugar.appendChild(cont); if (lugar.dataset.navTableros === 'iconbtn') btn.classList.add('iconbtn'); }
    else if (portada) { btn.className = portada.className + ' ntb-btn'; portada.replaceWith(cont); }
    else { cont.classList.add('ntb-fijo'); document.body.appendChild(cont); }
    let tm = 0;
    // el menú va en posición fija bajo el botón: así no lo recorta una cabecera con overflow oculto
    const ubicar = () => { const r = btn.getBoundingClientRect(), w = menu.offsetWidth || 268;
      menu.style.top = Math.round(r.bottom + 8) + 'px'; menu.style.left = Math.round(Math.max(8, Math.min(innerWidth - w - 8, r.right - w))) + 'px'; };
    const abierto = () => menu.classList.contains('abierto');
    const abrir = (v) => { clearTimeout(tm); if (v) ubicar(); cont.classList.toggle('abierto', v); menu.classList.toggle('abierto', v); btn.setAttribute('aria-expanded', String(v)); };
    addEventListener('resize', () => abrir(false)); addEventListener('scroll', () => { if (abierto()) ubicar(); }, true);
    btn.addEventListener('click', (e) => { e.stopPropagation(); abrir(!abierto()); if (abierto()) { const a = menu.querySelector('a:not(.aqui)'); if (a && e.detail === 0) a.focus(); } });
    // con el ratón se abre al pasar el puntero (sin clic) y se cierra al salir; en pantallas táctiles, con el toque
    [cont, menu].forEach((el) => {
      el.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { clearTimeout(tm); if (!abierto()) tm = setTimeout(() => abrir(true), 120); } });
      el.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { clearTimeout(tm); tm = setTimeout(() => abrir(false), 280); } });
    });
    document.addEventListener('click', (e) => { if (!cont.contains(e.target) && !menu.contains(e.target)) abrir(false); });
    document.addEventListener('keydown', (e) => {
      if (!abierto()) return;
      if (e.key === 'Escape') { abrir(false); btn.focus(); e.stopPropagation(); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { const as = [...menu.querySelectorAll('a')], i = as.indexOf(document.activeElement); as[(i + (e.key === 'ArrowDown' ? 1 : as.length - 1)) % as.length].focus(); e.preventDefault(); e.stopPropagation(); }
    }, true);
    menu.addEventListener('click', (e) => { const a = e.target.closest('a'); if (a && a.classList.contains('aqui')) { e.preventDefault(); abrir(false); } });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar); else montar();
})();
