// Cronograma 4D enlazado (demo): el 3D de la SE arriba, el cronograma abajo y un panel con el avance a la fecha.
// Una barra del cronograma ilumina sus piezas en el 3D; una pieza del 3D lleva a su actividad. Deslizador de fechas con
// reproducción y velocidad, y «Comparar dos fechas» (qué se terminó, qué empezó y cuánto avanzó cada área).
// Lo usan la SE Río Claro y la SE Cerro Azul con su propio adaptador del 3D (a3d).

const MES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'];
const DIA = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const fecha = (iso) => new Date(iso + 'T12:00:00');
export const fc = (iso) => { if (!iso) return '—'; const [y, m, d] = iso.split('-'); return `${d}-${MES[+m - 1]}-${y.slice(2)}`; };
const fcc = (iso) => { if (!iso) return '—'; const [, m, d] = iso.split('-'); return `${d}-${MES[+m - 1]}`; };
const fl = (iso) => `${DIA[fecha(iso).getDay()]} ${fc(iso)}`;
const ndias = (a, b) => Math.round((fecha(b) - fecha(a)) / 864e5);
export const pct = (v, d = 1) => (v == null || Number.isNaN(v) ? '—' : (Math.round(v * 100 * 10 ** d) / 10 ** d).toFixed(d).replace('.', ',') + ' %');
const pp = (v) => (v == null ? '—' : (v >= 0 ? '+' : '−') + Math.abs(Math.round(v * 1000) / 10).toFixed(1).replace('.', ',') + ' pp');
export const COL = { term: '#16a34a', curso: '#f59e0b', atras: '#dc2626', pend: '#94a3b8', cond: '#cbd5e1', antes: '#94a3b8', periodo: '#16a34a' };
export const TXT = { term: 'Terminada', curso: 'En curso', atras: 'Atrasada', pend: 'Por iniciar', cond: 'Sin fechas' };
const PLU = { term: ['terminada', 'terminadas'], curso: ['en curso', 'en curso'], atras: ['atrasada', 'atrasadas'], pend: ['por iniciar', 'por iniciar'] };

const ESTILO = `
#v-cro.c4d.view.on{display:grid!important;grid-template-columns:minmax(0,1fr) clamp(300px,26vw,390px);grid-template-rows:minmax(0,1.2fr) auto minmax(0,1fr);grid-template-areas:"m p" "t p" "g g";gap:8px;overflow:hidden;align-content:stretch}
.c4-mod{grid-area:m;position:relative;min-height:0;border:1px solid var(--line);border-radius:11px;overflow:hidden;background:#cfdde6;box-shadow:var(--shadow,none)}
.c4-mod>.bim-viewport,.c4-mod>#visor{position:absolute!important;inset:0!important;grid-column:auto!important;grid-row:auto!important;border:0!important;border-radius:0!important;height:auto!important;min-height:0!important;box-shadow:none!important;z-index:auto!important}
#v-cro #visor #rotulos,#v-cro #izq,#v-cro #der,#v-cro #movTabs,#v-cro #uni,#v-cro #bUni,#v-cro #pie,#v-cro #coord,#v-cro #mapa,#v-cro #barraEnc,#v-cro #mira,#v-cro #cine{display:none!important}
.c4-ley{position:absolute;left:10px;bottom:10px;z-index:30;display:flex;gap:4px 10px;flex-wrap:wrap;align-items:center;max-width:calc(100% - 20px);padding:6px 10px;border-radius:10px;background:rgba(255,255,255,.88);backdrop-filter:blur(6px);font:500 .66rem/1.3 "Inter",system-ui,sans-serif;color:#334155;box-shadow:0 4px 14px -6px rgba(15,40,90,.35)}
.c4-ley i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:4px;vertical-align:-1px}
.c4-ley i.fa{background:transparent!important;border:1.5px dashed #dc2626}
.c4-ley label{display:inline-flex;align-items:center;gap:4px;cursor:pointer;color:#1e3a8a;font-weight:600;margin-left:2px}
.c4-chip{position:absolute;left:10px;top:10px;z-index:30;display:none;align-items:center;gap:8px;max-width:calc(100% - 140px);padding:7px 8px 7px 12px;border-radius:10px;background:#1e3a8a;color:#fff;font:600 .72rem/1.3 "Inter",system-ui,sans-serif;box-shadow:0 8px 20px -8px rgba(15,40,90,.6)}
.c4-chip.on{display:flex}
.c4-chip span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.c4-chip small{opacity:.8;font-weight:500;margin-left:6px}
.c4-chip button{border:0;background:rgba(255,255,255,.18);color:#fff;border-radius:6px;width:24px;height:24px;cursor:pointer;flex:none}
.c4-time{grid-area:t;display:flex;align-items:center;gap:8px 12px;flex-wrap:wrap;padding:8px 12px;border:1px solid var(--line);border-radius:11px;background:var(--panel)}
.c4-time .tl{flex:1 1 260px;display:flex;align-items:center;gap:8px;min-width:0}
.c4-time input[type=range]{flex:1;min-width:120px;accent-color:#2563eb}
.c4-time .f{font:700 .78rem/1.15 "Manrope",system-ui,sans-serif;color:var(--ink);min-width:118px;text-align:center}
.c4-time .f small{display:block;font:500 .6rem "Inter",system-ui,sans-serif;color:var(--ink-mut)}
.c4-b{border:1px solid var(--line);background:var(--panel-2,#f1f5f9);color:var(--ink);border-radius:8px;padding:5px 9px;font:600 .7rem "Inter",system-ui,sans-serif;cursor:pointer;line-height:1.2}
.c4-b:hover{border-color:#93c5fd}
.c4-b.on{background:#2563eb;border-color:#2563eb;color:#fff}
.c4-play{width:34px;height:30px;padding:0;font-size:.85rem}
.c4-seg{display:inline-flex;gap:3px;align-items:center}
.c4-seg>span{font:600 .62rem "Inter",system-ui,sans-serif;color:var(--ink-mut);text-transform:uppercase;letter-spacing:.4px;margin-right:3px}
.c4-pan{grid-area:p;min-height:0;overflow:auto;padding:12px 14px;border:1px solid var(--line);border-radius:11px;background:var(--panel);display:flex;flex-direction:column;gap:12px}
.c4-h{font:700 .62rem "Inter",system-ui,sans-serif;text-transform:uppercase;letter-spacing:.6px;color:var(--ink-mut);margin:0 0 6px}
.c4-fh{font:700 .95rem/1.2 "Manrope",system-ui,sans-serif;color:var(--ink)}
.c4-fh small{display:block;font:500 .66rem "Inter",system-ui,sans-serif;color:var(--ink-mut);margin-top:2px}
.c4-kp{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.c4-kp>div{border:1px solid var(--line);border-radius:9px;padding:7px 8px;background:var(--panel-2,#f8fafc)}
.c4-kp b{display:block;font:800 1.05rem/1.1 "Manrope",system-ui,sans-serif;color:var(--ink)}
.c4-kp span{font:500 .6rem "Inter",system-ui,sans-serif;color:var(--ink-mut)}
.c4-kp .bad b{color:#dc2626}.c4-kp .ok b{color:#16a34a}
.c4-cn{display:flex;flex-wrap:wrap;gap:4px}
.c4-cn span{font:600 .64rem "Inter",system-ui,sans-serif;padding:3px 7px;border-radius:20px;background:var(--panel-2,#f1f5f9);color:var(--ink-2)}
.c4-cn i{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:4px}
.c4-cmp{border:1px solid #bbf7d0;background:#f0fdf4;border-radius:10px;padding:9px 10px}
.c4-cmp .c4-kp>div{background:#fff}
.c4-ar{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 8px;align-items:center;font:500 .7rem/1.25 "Inter",system-ui,sans-serif;color:var(--ink-2);margin-bottom:6px}
.c4-ar .br{grid-column:1/-1;position:relative;height:7px;border-radius:4px;background:#e2e8f0;overflow:hidden}
.c4-ar .br i{position:absolute;top:0;bottom:0;left:0;border-radius:4px}
.c4-ar .br em{position:absolute;top:-2px;bottom:-2px;width:2px;background:#0f172a;opacity:.55}
.c4-ar b{font:700 .68rem "JetBrains Mono",monospace;text-align:right;color:var(--ink)}
.c4-ar .d{color:#15803d}
.c4-det{border-top:1px solid var(--line);padding-top:10px}
.c4-det:empty,#c4Extra:empty{display:none}
.c4-det h4{margin:0 0 4px;font:700 .86rem/1.25 "Manrope",system-ui,sans-serif;color:var(--ink)}
.c4-det .g{font:500 .66rem "Inter",system-ui,sans-serif;color:var(--ink-mut);margin-bottom:6px}
.c4-det table{width:100%;border-collapse:collapse;font:500 .7rem/1.3 "Inter",system-ui,sans-serif}
.c4-det td{padding:3px 0;border-bottom:1px dashed var(--line);color:var(--ink-2)}
.c4-det td:last-child{text-align:right;font-weight:600;color:var(--ink)}
.c4-det .cau{margin-top:7px;padding:7px 9px;border-radius:8px;background:#fef2f2;color:#991b1b;font:500 .68rem/1.35 "Inter",system-ui,sans-serif}
.c4-st{display:inline-block;padding:2px 7px;border-radius:12px;font:700 .6rem "Inter",system-ui,sans-serif;color:#fff}
.c4-gan{grid-area:g;min-height:0;display:flex;flex-direction:column;border:1px solid var(--line);border-radius:11px;background:var(--panel);overflow:hidden}
.c4-gh{display:flex;align-items:center;gap:6px 14px;flex-wrap:wrap;padding:8px 12px;border-bottom:1px solid var(--line)}
.c4-gh h3{margin:0;font:700 .82rem "Manrope",system-ui,sans-serif;color:var(--ink)}
.c4-gh .nt{font:500 .64rem/1.35 "Inter",system-ui,sans-serif;color:var(--ink-mut);flex:1 1 260px}
.c4-g{flex:1;min-height:0;overflow:auto;position:relative;font:500 .7rem/1.25 "Inter",system-ui,sans-serif}
.c4-r{display:grid;grid-template-columns:2.6em minmax(170px,1.25fr) 4.6em 4.6em 3.6em minmax(0,3fr);align-items:center;min-height:25px;border-bottom:1px solid color-mix(in srgb,var(--line) 60%,transparent);cursor:pointer}
.c4-r:hover{background:var(--panel-2,#f8fafc)}
.c4-r.sel{background:#dbeafe}
.c4-r.cab{position:sticky;top:0;z-index:4;background:var(--panel);cursor:default;min-height:28px;border-bottom:1px solid var(--line);font:600 .6rem "Inter",system-ui,sans-serif;color:var(--ink-mut);text-transform:uppercase;letter-spacing:.3px}
.c4-r.cab:hover{background:var(--panel)}
.c4-r.gr{cursor:default;background:color-mix(in srgb,var(--panel-2,#f1f5f9) 70%,transparent);font-weight:700;color:var(--ink-2)}
.c4-r.gr:hover{background:color-mix(in srgb,var(--panel-2,#f1f5f9) 70%,transparent)}
.c4-r>div{padding:3px 6px;min-width:0}
.c4-r .n{font:600 .64rem "JetBrains Mono",monospace;color:var(--ink-mut);text-align:right}
.c4-r .nm{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;color:var(--ink)}
.c4-r.gr .nm{font:700 .64rem "Inter",system-ui,sans-serif;text-transform:uppercase;letter-spacing:.4px;color:var(--ink-2)}
.c4-r .fe{font:500 .64rem "JetBrains Mono",monospace;color:var(--ink-2);white-space:nowrap}
.c4-r .pc{font:700 .66rem "JetBrains Mono",monospace;text-align:right;white-space:nowrap}
.c4-r .pc.fut{color:var(--ink-mut);font-weight:500;font-style:italic}
.c4-r .tg{display:inline-block;margin-left:5px;padding:0 5px;border-radius:9px;font:700 .56rem/14px "Inter",system-ui,sans-serif;color:#fff;vertical-align:1px}
.c4-t{position:relative;align-self:stretch;min-height:25px;padding:0!important;background-image:var(--gr)}
.c4-t i{position:absolute;display:block}
.c4-t .pl{top:calc(50% - 7px);height:14px;border:1px solid #cbd5e1;background:#f1f5f9;border-radius:4px;box-sizing:border-box}
.c4-t .ex{top:calc(50% - 7px);height:14px;border-radius:4px}
.c4-t .fu{top:calc(50% - 7px);height:14px;border-radius:4px;opacity:.55;background:repeating-linear-gradient(135deg,var(--c) 0 3px,transparent 3px 6px)}
.c4-t .pm{top:calc(50% - 9px);height:18px;width:2px;background:#0f172a;opacity:.6}
.c4-t .rl{top:calc(50% + 8px);height:2px;background:#475569;border-radius:2px;opacity:.75}
.c4-t .hd{top:calc(50% - 6px);width:12px;height:12px;margin-left:-6px;transform:rotate(45deg);border:2px solid #475569;background:#fff;border-radius:2px;box-sizing:border-box}
.c4-t .gs{top:calc(50% - 3px);height:6px;border-radius:3px;background:#64748b;opacity:.55}
.c4-t .ln{top:0;bottom:0;width:2px;margin-left:-1px;background:#2563eb;z-index:2}
.c4-t .co{top:0;bottom:0;width:0;border-left:2px dashed #dc2626;z-index:2;opacity:.8}
.c4-t .cb{top:0;bottom:0;background:rgba(22,163,74,.12);border-left:1px solid rgba(22,163,74,.45);z-index:1}
.c4-r.cab .c4-t span{position:absolute;top:calc(50% - 8px);line-height:16px;font:600 .6rem "JetBrains Mono",monospace;color:var(--ink-2);white-space:nowrap;cursor:pointer;padding-left:3px;text-transform:none;letter-spacing:0}
.c4-r.cab .c4-t span.d{transform:translateX(-50%);padding-left:0}
.c4-r.cab .c4-t span.on{color:#fff;background:#2563eb;border-radius:3px;padding:0 4px}
.c4-r.cab .c4-t{cursor:pointer}
.c4-pie{padding:6px 12px;border-top:1px solid var(--line);font:500 .62rem/1.4 "Inter",system-ui,sans-serif;color:var(--ink-mut)}
@media (max-width:900px){
  #v-cro.c4d.view.on{grid-template-columns:minmax(0,1fr);grid-template-rows:54vh auto auto auto;grid-template-areas:"m" "t" "p" "g";overflow:auto;align-content:start}
  .c4-pan,.c4-gan,.c4-time{min-height:auto!important}
  .c4-pan{overflow:visible}
  .c4-gan{overflow:visible}.c4-g{overflow:visible;flex:none}
  .c4-r{grid-template-columns:2.2em minmax(120px,1fr) 3.4em minmax(0,1.25fr)}
  .c4-r .fe{display:none}
  .c4-r.cab{position:static}
  .c4-chip{max-width:calc(100% - 80px)}
  .c4-time .f{min-width:96px}
}
`;

export function crono4D(cfg) {
  const { raiz, D, a3d } = cfg;
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const F = D.fechas, N = F.length, IC = Math.max(0, F.indexOf(D.corte) >= 0 ? F.indexOf(D.corte) : N - 1);
  const ACTS = D.acts, LARGO = N > 45;
  const st = document.createElement('style'); st.textContent = ESTILO; document.head.appendChild(st);
  raiz.classList.add('c4d');
  raiz.innerHTML = `
    <div class="c4-mod" id="c4Mod"><div class="c4-chip" id="c4Chip"><span id="c4ChipT"></span><button id="c4ChipX" aria-label="Quitar la selección">✕</button></div><div class="c4-ley" id="c4Ley"></div></div>
    <aside class="c4-pan" id="c4Pan"><div id="c4Av"></div><div id="c4Cmp"></div><div id="c4Det"></div><div id="c4Extra"></div><div id="c4Ar"></div></aside>
    <div class="c4-time" id="c4Time">
      <div class="tl"><button class="c4-b c4-play" id="c4Play" title="Reproducir">▶</button><input type="range" id="c4Rng" min="0" max="${N - 1}" step="1" value="${IC}" aria-label="Fecha"><div class="f" id="c4F"></div><button class="c4-b" id="c4Hoy" title="Ir a la fecha del corte">Corte</button></div>
      <div class="c4-seg" id="c4Vel"><span>Velocidad</span>${(LARGO ? [[2, '×1'], [5, '×2'], [10, '×4']] : [[1, '×1'], [2, '×2'], [4, '×4']]).map(([v, t], i) => `<button class="c4-b${i === 0 ? ' on' : ''}" data-v="${v}">${t}</button>`).join('')}</div>
      <div class="c4-seg" id="c4CmpSel"><span>Comparar</span>${[[7, '1 semana'], [14, '2 semanas'], [30, '1 mes']].filter(([d]) => d < N).map(([d, t]) => `<button class="c4-b" data-d="${d}">${t}</button>`).join('')}</div>
    </div>
    <div class="c4-gan"><div class="c4-gh"><h3 id="c4Tit"></h3><span class="nt" id="c4Nt"></span><span id="c4GSel"></span></div><div class="c4-g" id="c4G"></div><div class="c4-pie" id="c4Pie"></div></div>`;
  const $ = (s) => raiz.querySelector(s);
  let k = IC, sel = null, cmp = 0, play = null, vel = LARGO ? 2 : 1, fantasma = false, areaSel = null;

  // ---------------------------------------------------------------- valores
  const v = (a, x) => (x <= IC ? a.ejec[x] : a.prev ? a.prev[x] : null);
  const fut = (x) => x > IC;
  function estado(a, x) {
    if (!a.ini) return 'cond';
    const p = a.prog[x] ?? 0, e = v(a, x);
    if (e == null) return p >= 0.999 ? 'term' : p > 0 ? 'curso' : 'pend';
    if (e >= 0.999) return 'term';
    if (p - e > 0.005) return 'atras';
    return e > 0 ? 'curso' : 'pend';
  }
  function avance(as, x) {
    const fe = as.filter((a) => a.ini && !a.hito); if (!fe.length) return { p: null, e: null };
    const sp = fe.reduce((s, a) => s + (a.peso || 0), 0); const w = (a) => (sp > 0 ? (a.peso || 0) / sp : 1 / fe.length);
    const p = fe.reduce((s, a) => s + w(a) * (a.prog[x] ?? 0), 0);
    const ev = fe.map((a) => v(a, x)); const e = ev.some((q) => q == null) ? null : fe.reduce((s, a, i) => s + w(a) * ev[i], 0);
    return { p, e };
  }
  const tot = (x) => ({ p: D.total.prog[x], e: x <= IC ? D.total.ejec[x] : D.total.prev ? D.total.prev[x] : null });
  const A_ = () => (cmp ? Math.max(0, k - cmp) : null);
  const AREAS = D.areas || [];

  // ---------------------------------------------------------------- 3D
  function al3D(volar = false) { a3d.fijar(k, { cmpA: A_(), sel, fantasma, v, estado, IC, area: areaSel }); if (volar) a3d.resaltar(sel, true); }

  // ---------------------------------------------------------------- barra de tiempo
  const rng = $('#c4Rng');
  rng.style.background = '';
  function pintarTiempo() {
    rng.value = k;
    $('#c4F').innerHTML = `${fl(F[k])}<small>${k === IC ? 'corte' : fut(k) ? 'programado y pronóstico' : `día ${k + 1} de ${N}`}</small>`;
    $('#c4Hoy').classList.toggle('on', k === IC);
    $('#c4CmpSel').querySelectorAll('button').forEach((b) => b.classList.toggle('on', +b.dataset.d === cmp));
  }
  rng.oninput = () => { parar(); fijar(+rng.value); };
  $('#c4Hoy').onclick = () => { parar(); fijar(IC); };
  $('#c4Vel').onclick = (e) => { const b = e.target.closest('button[data-v]'); if (!b) return; vel = +b.dataset.v; $('#c4Vel').querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b)); };
  $('#c4CmpSel').onclick = (e) => { const b = e.target.closest('button[data-d]'); if (!b) return; cmp = cmp === +b.dataset.d ? 0 : +b.dataset.d; fijar(k); };
  function parar() { if (play) { clearInterval(play); play = null; $('#c4Play').textContent = '▶'; a3d.fin && a3d.fin(); } }
  $('#c4Play').onclick = () => {
    if (play) { parar(); return; }
    if (k >= N - 1) k = 0;
    $('#c4Play').textContent = '⏸';
    play = setInterval(() => { if (k >= N - 1) { parar(); fijar(N - 1); return; } fijar(Math.min(N - 1, k + vel), true); }, LARGO ? 260 : 900);
  };

  // ---------------------------------------------------------------- panel
  function pintarPanel() {
    const t = tot(k), spi = t.e != null && t.p ? t.e / t.p : null;
    const fe = ACTS.filter((a) => a.ini && !a.hito); const cuenta = { term: 0, curso: 0, atras: 0, pend: 0 };
    fe.forEach((a) => { const s = estado(a, k); if (cuenta[s] != null) cuenta[s]++; });
    const lbE = fut(k) ? 'Pronóstico' : 'Ejecutado';
    $('#c4Av').innerHTML = `<div class="c4-h">Avance a la fecha</div><div class="c4-fh">${fl(F[k])}<small>${k === IC ? 'fecha del corte' : fut(k) ? 'después del corte: programado y pronóstico' : 'antes del corte'} · ${esc(D.titulo)}</small></div>
      <div class="c4-kp" style="margin-top:8px"><div><b>${pct(t.p)}</b><span>Programado</span></div><div class="${t.e != null && t.p - t.e > 0.005 ? 'bad' : 'ok'}"><b>${pct(t.e)}</b><span>${lbE}</span></div><div class="${spi != null && spi < 0.95 ? 'bad' : 'ok'}"><b>${spi == null ? '—' : spi.toFixed(2).replace('.', ',')}</b><span>SPI</span></div></div>
      <div class="c4-cn" style="margin-top:7px">${['term', 'curso', 'atras', 'pend'].map((s) => `<span><i style="background:${COL[s]}"></i>${cuenta[s]} ${PLU[s][cuenta[s] === 1 ? 0 : 1]}</span>`).join('')}</div>`;
    // comparación de dos fechas
    const a0 = A_();
    if (a0 == null) $('#c4Cmp').innerHTML = '';
    else {
      const t0 = tot(a0), t1 = tot(k);
      const hechas = fe.filter((a) => (v(a, a0) ?? 0) < 0.999 && (v(a, k) ?? 0) >= 0.999), empez = fe.filter((a) => (v(a, a0) ?? 0) <= 0 && (v(a, k) ?? 0) > 0);
      $('#c4Cmp').innerHTML = `<div class="c4-cmp"><div class="c4-h" style="color:#15803d">Comparar · del ${fcc(F[a0])} al ${fc(F[k])} (${k - a0} días)</div>
        <div class="c4-kp"><div class="ok"><b>${t0.e != null && t1.e != null ? pp(t1.e - t0.e) : '—'}</b><span>${fut(k) ? 'pronóstico' : 'ejecutado'} en el período</span></div><div><b>${pp(t1.p - t0.p)}</b><span>programado en el período</span></div><div><b>${hechas.length} · ${empez.length}</b><span>terminadas · iniciadas</span></div></div>
        ${hechas.length ? `<div style="margin-top:6px;font:500 .66rem/1.35 Inter,system-ui,sans-serif;color:#166534">✓ ${hechas.map((a) => esc(a.n + ' ' + a.nombre)).join(' · ')}</div>` : ''}</div>`;
    }
    // por área (o zona)
    $('#c4Ar').innerHTML = AREAS.length ? `<div class="c4-h">${esc(D.areasTit || 'Por área')}${a0 != null ? ' · ganado en el período' : ''}</div>` + AREAS.map((ar) => {
      const as = ar.acts; const r1 = avance(as, k); if (r1.p == null) return '';
      const r0 = a0 != null ? avance(as, a0) : null;
      const e1 = r1.e ?? 0, e0 = r0 ? r0.e ?? 0 : 0;
      const col = r1.e == null ? COL.pend : e1 >= 0.999 ? COL.term : r1.p - e1 > 0.005 ? COL.atras : e1 > 0 ? COL.curso : COL.pend;
      const barra = r0 ? `<i style="width:${e0 * 100}%;background:#94a3b8"></i><i style="left:${e0 * 100}%;width:${Math.max(0, e1 - e0) * 100}%;background:${COL.periodo}"></i>` : `<i style="width:${e1 * 100}%;background:${col}"></i>`;
      return `<div class="c4-ar" data-area="${esc(ar.k)}" style="cursor:pointer${areaSel === ar.k ? ';outline:2px solid #93c5fd;border-radius:6px' : ''}" title="Clic: ver esta área en el 3D"><span>${esc(ar.nombre)}</span><b class="${r0 ? 'd' : ''}">${r0 ? pp(e1 - e0) : pct(r1.e, 0)}</b><div class="br">${barra}<em style="left:${(r1.p ?? 0) * 100}%" title="programado ${pct(r1.p)}"></em></div></div>`;
    }).join('') : '';
    $('#c4Ar').querySelectorAll('[data-area]').forEach((el) => (el.onclick = () => { areaSel = areaSel === el.dataset.area ? null : el.dataset.area; seleccionar(null, false); a3d.verArea && a3d.verArea(areaSel); pintarPanel(); al3D(); }));
    // detalle de la actividad elegida
    if (!sel) { $('#c4Det').innerHTML = cfg.detalle === false ? '' : `<div class="c4-det"><div class="c4-h">Actividad</div><div style="font:500 .7rem/1.4 Inter,system-ui,sans-serif;color:var(--ink-mut)">Toque una barra del cronograma o una pieza del 3D para ver aquí su avance.</div></div>`; }
    else if (cfg.detalle !== false) {
      const a = sel, s = estado(a, k), e = v(a, k), p = a.prog[k];
      const filas = [['Programado', a.hito ? fc(a.fin) : `${fc(a.ini)} → ${fc(a.fin)}${a.dur ? ` · ${a.dur} d` : ''}`]];
      if (a.ini_real) filas.push([a.hito ? 'Real' : 'Inicio real', fc(a.ini_real)]); else if (a.ini_prev && a.ini_prev !== a.ini) filas.push([a.hito ? 'Previsto' : 'Inicio previsto', fc(a.ini_prev)]);
      if (!a.hito && a.fin_prev && a.fin_prev !== a.fin) filas.push(['Fin previsto', fc(a.fin_prev)]);
      if (!a.hito) filas.push([`Avance al ${fcc(F[k])}`, `${pct(e, 0)} ${fut(k) ? 'previsto' : 'ejecutado'} · ${pct(p, 0)} programado`]);
      if (a.peso) filas.push(['Peso en la obra', pct(a.peso)]);
      const np = a3d.piezas ? a3d.piezas(a) : null; if (np != null) filas.push(['Piezas en el 3D', np ? String(np) : 'sin piezas propias']);
      $('#c4Det').innerHTML = `<div class="c4-det"><div class="c4-h">Actividad ${esc(a.n)}</div><h4>${esc(a.nombre)}</h4><div class="g">${esc(a.grupo || '')} · <span class="c4-st" style="background:${COL[s]}">${TXT[s]}</span></div>
        <table>${filas.map(([x, y]) => `<tr><td>${esc(x)}</td><td>${esc(y)}</td></tr>`).join('')}</table>${a.causa && (s === 'atras' || (a.fin_prev && a.fin_prev > a.fin)) ? `<div class="cau">Causa del atraso: ${esc(a.causa)}</div>` : ''}</div>`;
    }
    if (cfg.alPanel) cfg.alPanel(sel, k);
  }

  // ---------------------------------------------------------------- cronograma (Gantt)
  $('#c4Tit').textContent = `Cronograma · ${ACTS.filter((a) => !a.hito).length} actividades${ACTS.some((a) => a.hito) ? ` y ${ACTS.filter((a) => a.hito).length} hitos` : ''}`;
  $('#c4Nt').textContent = D.nota || '';
  const X = (iso) => (Math.max(0, Math.min(N, ndias(F[0], iso))) / N) * 100;
  const Xk = (x) => (x / N) * 100;
  const semana = (7 / N) * 100;
  const fondo = LARGO ? `repeating-linear-gradient(90deg,transparent 0,transparent calc(${semana}% - 1px),color-mix(in srgb,var(--line) 70%,transparent) calc(${semana}% - 1px),color-mix(in srgb,var(--line) 70%,transparent) ${semana}%)`
    : `repeating-linear-gradient(90deg,transparent 0,transparent calc(${100 / N}% - 1px),color-mix(in srgb,var(--line) 70%,transparent) calc(${100 / N}% - 1px),color-mix(in srgb,var(--line) 70%,transparent) ${100 / N}%)`;
  function cabecera() {
    let m = '';
    if (LARGO) {
      const d0 = fecha(F[0]);
      for (let d = new Date(d0.getFullYear(), d0.getMonth(), 1); d <= fecha(F[N - 1]); d.setMonth(d.getMonth() + 1)) {
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`; const x = Math.max(0, X(iso));
        if (x < 99) m += `<span style="left:${x}%;border-left:1px solid var(--line-2,#cbd5e1)">${MES[d.getMonth()]}${d.getMonth() === 0 ? ' ' + String(d.getFullYear()).slice(2) : ''}</span>`;
      }
    } else F.forEach((f, i) => { m += `<span class="d${i === k ? ' on' : ''}" style="left:${Xk(i + 0.5)}%" data-k="${i}">${+f.slice(8)}</span>`; });
    return m;
  }
  function lineas() {
    const a0 = A_();
    return (a0 != null ? `<i class="cb" style="left:${Xk(a0 + 0.5)}%;width:${Xk(k - a0)}%"></i>` : '') + `<i class="co" style="left:${Xk(IC + 0.5)}%"></i><i class="ln" style="left:${Xk(k + 0.5)}%"></i>`;
  }
  function barra(a) {
    if (!a.ini) return `<span style="position:absolute;left:6px;top:calc(50% - 8px);font-size:.62rem;color:var(--ink-mut)">${esc(a.estado || 'Sin fechas')}</span>`;
    const s = estado(a, k), L = X(a.ini), W = Math.max(0.5, X(a.fin) + 100 / N - L);
    if (a.hito) {
      const hecho = (v(a, k) ?? 0) >= 1, tarde = a.ini_real ? a.ini_real > a.fin : a.ini_prev > a.fin;
      const c = hecho ? (a.ini_real > a.fin ? COL.atras : COL.term) : (a.prog[k] >= 1 ? COL.atras : '#475569');
      let h = `<i class="hd" style="left:${X(a.fin) + 50 / N}%;border-color:${c};${hecho && !tarde ? `background:${c}` : ''}"></i>`;
      const r = a.ini_real || a.ini_prev; if (r && r !== a.fin) h += `<i class="rl" style="left:${X(a.fin) + 50 / N}%;width:${Math.max(0, X(r) - X(a.fin))}%"></i><i class="hd" style="left:${X(r) + 50 / N}%;border-color:${c};background:${hecho ? c : '#fff'};opacity:${hecho ? 1 : 0.6}"></i>`;
      return h;
    }
    let h = `<i class="pl" style="left:${L}%;width:${W}%"></i>`;
    const e = v(a, Math.min(k, IC)) ?? 0, p = a.prog[k] ?? 0;
    const cE = e >= 0.999 ? COL.term : (a.prog[Math.min(k, IC)] - e > 0.005 ? COL.atras : COL.curso);
    if (e > 0) h += `<i class="ex" style="left:${L}%;width:${W * Math.min(1, e)}%;background:${cE}"></i>`;
    if (fut(k)) { const f = v(a, k) ?? 0; if (f > e) h += `<i class="fu" style="--c:${f >= 0.999 ? COL.term : COL.curso};left:${L + W * e}%;width:${W * (f - e)}%"></i>`; }
    else if (Math.abs(p - e) > 0.005 && p > 0) h += `<i class="pm" style="left:${L + W * Math.min(1, p)}%"></i>`;
    const r0 = a.ini_real || a.ini_prev, r1 = a.fin_prev;
    if (r0 && r1 && (r0 !== a.ini || r1 !== a.fin)) h += `<i class="rl" style="left:${X(r0)}%;width:${Math.max(0.4, X(r1) + 100 / N - X(r0))}%" title="real / pronóstico"></i>`;
    void s; return h;
  }
  function pcTxt(a) {
    if (!a.ini || a.hito) { if (a.hito) { const h = (v(a, k) ?? 0) >= 1; return `<span style="color:${h ? COL.term : a.prog[k] >= 1 ? COL.atras : 'var(--ink-mut)'}">${h ? '✓' : a.prog[k] >= 1 ? '!' : '·'}</span>`; } return '—'; }
    const e = v(a, k), s = estado(a, k);
    return `<span class="${fut(k) ? 'fut' : ''}" style="color:${fut(k) ? '' : COL[s] === COL.pend ? 'var(--ink-mut)' : COL[s]}">${pct(e, 0)}</span>`;
  }
  function tags(a) {
    const a0 = A_(); if (a0 == null || !a.ini) return '';
    const e0 = v(a, a0) ?? 0, e1 = v(a, k) ?? 0;
    if (e0 < 0.999 && e1 >= 0.999) return `<span class="tg" style="background:${COL.periodo}">✓ terminó</span>`;
    if (e0 <= 0 && e1 > 0) return `<span class="tg" style="background:${COL.curso}">▶ empezó</span>`;
    if (e1 > e0) return `<span class="tg" style="background:#64748b">+${Math.round((e1 - e0) * 100)} %</span>`;
    return '';
  }
  function gantt() {
    const g = $('#c4G'), y = g.scrollTop;
    let h = `<div class="c4-r cab"><div class="n">N.º</div><div>Actividad</div><div class="fe">Inicio</div><div class="fe">Fin</div><div class="pc" style="text-align:right">%</div><div class="c4-t" style="--gr:none">${cabecera()}${lineas()}</div></div>`;
    const grupos = D.grupos || [...new Set(ACTS.map((a) => a.grupo))];
    for (const gn of grupos) {
      const as = ACTS.filter((a) => a.grupo === gn); if (!as.length) continue;
      const fe = as.filter((a) => a.ini); const r = avance(as, k);
      const g0 = fe.length ? fe.reduce((m, a) => (a.ini < m ? a.ini : m), '9999') : null, g1 = fe.length ? fe.reduce((m, a) => (a.fin > m ? a.fin : m), '0000') : null;
      h += `<div class="c4-r gr"><div class="n"></div><div class="nm">${esc(gn)}</div><div class="fe">${g0 ? fcc(g0) : ''}</div><div class="fe">${g1 ? fcc(g1) : ''}</div><div class="pc">${r.e != null ? pct(r.e, 0) : ''}</div><div class="c4-t" style="--gr:${fondo}">${g0 ? `<i class="gs" style="left:${X(g0)}%;width:${Math.max(0.5, X(g1) + 100 / N - X(g0))}%"></i>` : ''}${lineas()}</div></div>`;
      for (const a of as) {
        const tip = `${a.n} · ${a.nombre}\n${a.ini ? `Programado ${fc(a.ini)} → ${fc(a.fin)}` : 'Sin fechas'}${a.ini_real ? `\nInicio real ${fc(a.ini_real)}` : ''}${a.fin_prev && a.fin_prev !== a.fin && !a.hito ? `\nFin previsto ${fc(a.fin_prev)}` : ''}${a.ini && !a.hito ? `\nAl ${fc(F[k])}: programado ${pct(a.prog[k], 0)} · ${fut(k) ? 'previsto' : 'ejecutado'} ${pct(v(a, k), 0)} · ${TXT[estado(a, k)]}` : ''}`;
        h += `<div class="c4-r${sel === a ? ' sel' : ''}" data-a="${esc(a.n)}" title="${esc(tip)}"><div class="n">${esc(a.n)}</div><div><span class="nm">${esc(a.nombre)}${tags(a)}</span></div><div class="fe">${a.ini ? fcc(a.ini) : ''}</div><div class="fe">${a.fin && !a.hito ? fcc(a.fin) : ''}</div><div class="pc">${pcTxt(a)}</div><div class="c4-t" style="--gr:${fondo}">${barra(a)}${lineas()}</div></div>`;
      }
    }
    g.innerHTML = h; g.scrollTop = y;
    $('#c4Pie').innerHTML = `Barra gris: ventana programada · relleno: ${fut(k) ? 'ejecutado al corte y, rayado, el pronóstico' : 'ejecutado'} (verde terminada, ámbar en curso, rojo atrasada) · trazo negro: programado a la fecha · línea fina: inicio real o previsto → fin previsto · ◆ hito · línea azul: fecha elegida · línea roja punteada: corte (${fc(D.corte)})${cmp ? ' · banda verde: período comparado' : ''}. Fuente: ${esc(D.fuente || '')}.`;
  }
  $('#c4G').onclick = (ev) => {
    const c = ev.target.closest('.c4-r.cab .c4-t');
    if (c) { const s = ev.target.closest('span[data-k]'); const r = c.getBoundingClientRect(); const x = s ? +s.dataset.k : Math.floor(((ev.clientX - r.left) / r.width) * N); parar(); fijar(Math.max(0, Math.min(N - 1, x))); return; }
    const r = ev.target.closest('.c4-r[data-a]'); if (!r) return;
    const a = ACTS.find((q) => String(q.n) === r.dataset.a); seleccionar(sel === a ? null : a, true);
  };
  $('#c4ChipX').onclick = () => seleccionar(null, false);

  // ---------------------------------------------------------------- leyenda del 3D
  function leyenda() {
    const items = A_() != null ? [['antes', 'Antes del período'], ['periodo', 'Terminado en el período'], ['curso', 'En curso']] : (a3d.leyenda || [['term', 'Terminado'], ['curso', 'En curso'], ['atras', 'Atrasado'], ['fa', 'Debía empezar']]);
    $('#c4Ley').innerHTML = items.map(([c, t]) => `<span><i${c === 'fa' ? ' class="fa"' : ` style="background:${COL[c] || c}"`}></i>${t}</span>`).join('') +
      (a3d.fantasma ? `<label title="Mostrar en transparente lo que aún no se construye"><input type="checkbox" id="c4Fa"${fantasma ? ' checked' : ''}> Ver lo que falta</label>` : '');
    const f = $('#c4Fa'); if (f) f.onchange = () => { fantasma = f.checked; al3D(); };
  }

  // ---------------------------------------------------------------- estado
  function fijar(nk, rapido = false) {
    k = Math.max(0, Math.min(N - 1, nk));
    pintarTiempo(); pintarPanel(); gantt(); leyenda(); chip();
    a3d.fijar(k, { cmpA: A_(), sel, fantasma, v, estado, IC, rapido, area: areaSel });
    if (cfg.alFecha) cfg.alFecha(k);
  }
  function chip() {
    const c = $('#c4Chip');
    if (!sel) { c.classList.remove('on'); return; }
    const s = estado(sel, k);
    $('#c4ChipT').innerHTML = `<span>${esc(sel.n)} · ${esc(sel.nombre)}</span><small>${sel.hito ? TXT[s] : `${pct(v(sel, k), 0)} · ${TXT[s].toLowerCase()}`}</small>`;
    c.classList.add('on');
  }
  function seleccionar(a, volar = true, desde3D = false) {
    sel = a; if (a) areaSel = null;
    pintarPanel(); gantt(); chip();
    a3d.fijar(k, { cmpA: A_(), sel, fantasma, v, estado, IC, area: areaSel });
    a3d.resaltar(sel, volar && !desde3D);
    if (a) { const r = $('#c4G').querySelector(`.c4-r[data-a="${CSS.escape(String(a.n))}"]`); if (r && desde3D) r.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    if (cfg.alSel) cfg.alSel(a);
  }
  // clic en el 3D → su actividad
  if (a3d.alClic) a3d.alClic((acts) => {
    if (!acts || !acts.length) { seleccionar(null, false); return; }
    const a = acts.find((q) => estado(q, k) === 'curso' || estado(q, k) === 'atras') || acts[0];
    seleccionar(a, false, true);
  });

  fijar(k);
  return {
    get k() { return k; }, fijar, seleccionar, parar, acts: ACTS, estado, v, IC, N,
    montar() { a3d.montar($('#c4Mod')); fijar(a3d.fechaExterna ? a3d.fechaExterna() ?? k : k); },
    desmontar() { parar(); a3d.desmontar(); },
  };
}
