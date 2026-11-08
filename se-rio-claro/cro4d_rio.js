import { crono4D, COL } from './cro4d.js?v=81e3f81e';

const listo = () => new Promise((ok) => { const t = () => (window.__se && window.__se.m4dDe && window.__se.m4dDe() && window.__se.U4D ? ok(window.__se) : setTimeout(t, 120)); t(); });
const S = await listo();
const m4d = S.m4dDe(), U4D = S.U4D, M = m4d.M;
const raiz = document.getElementById('v-cro');
const croDet = document.getElementById('croDet');
const ORDEN = ['general', 'almacen', 'patio', 'cpm', 'ssaa', 'scada', 't19'];
const NOM = { general: 'General · movilización y cierre' };
const areas = ORDEN.filter((k) => k === 'general' || S.ZONAS4D[k]).map((k) => ({ k, nombre: NOM[k] || S.ZONAS4D[k].nombre || S.ZONAS4D[k].corto, acts: M.actsZona(k) }));
const D = {
  titulo: U4D.titulo, nota: `Control diario del integrador (${U4D.acts.length} actividades). Las barras son las ventanas del control; el relleno, lo ejecutado día por día.`,
  fuente: U4D.fuente, corte: U4D.corte, fechas: U4D.fechas, acts: U4D.acts, total: U4D.total,
  grupos: [...new Set(U4D.acts.map((a) => a.grupo))], areas, areasTit: 'Por zona de trabajo',
};

let activo = false, vuelta = null, zonas0 = true, cmp = null;
const recolor = () => {
  if (!activo) return;
  for (const z of Object.values(m4d.ZON)) {
    if (!z.g.visible && !cmp) continue;
    let c;
    if (cmp) {
      const as = M.actsZona(z.k).filter((a) => a.ini); if (!as.length) { z.g.visible = false; continue; }
      const r0 = M.avance(as, cmp.a0), r1 = M.avance(as, cmp.k);
      const e0 = r0.ejec ?? 0, e1 = r1.ejec ?? 0;
      c = e0 >= 0.999 ? COL.antes : e1 >= 0.999 ? COL.periodo : e1 > 0 ? COL.curso : null;
      z.g.visible = !!c && m4d.zonasOn; if (!c) continue;
    } else { const s = m4d.estadoZona(z.k, m4d.i); c = COL[s] || COL.pend; }
    z.fill.color.set(c); z.edge.color.set(c);
  }
  S.pedir();
};
let alClicCb = null, abajo = null;
S.renderer.domElement.addEventListener('pointerdown', (e) => { abajo = activo && e.button === 0 ? [e.clientX, e.clientY] : null; });
S.renderer.domElement.addEventListener('pointerup', (e) => {
  const a = abajo; abajo = null; if (!a || !activo || Math.hypot(e.clientX - a[0], e.clientY - a[1]) > 5) return;
  const x = e.clientX, y = e.clientY;
  setTimeout(() => {
    sinRecorrido();
    const hs = S.raycastPx(x, y); let zk = null;
    for (const h of hs) { let o = h.object; while (o && !zk) { for (const z of Object.values(m4d.ZON)) if (z.obj === o) { zk = z.k; break; } o = o.parent; } if (zk) break; }
    if (alClicCb) alClicCb(zk ? M.actsZona(zk).filter((q) => q.ini) : []);
  }, e.pointerType === 'touch' ? 400 : 40);
});
function sinRecorrido() { try { if (S.encDe && S.encDe()) S.salirEncuadre(false); const r = S.recDe && S.recDe(); if (r && r.activo) S.salirInspeccion(); } catch (_) {} }

const a3d = {
  leyenda: [['term', 'Terminado'], ['curso', 'En curso'], ['atras', 'Atrasado'], ['pend', 'Por iniciar']],
  fijar(k, o) { cmp = o.cmpA != null ? { a0: o.cmpA, k } : null; if (m4d.i !== k) m4d.fijar(k); else m4d.pintarZonas(); recolor(); },
  resaltar(a, volar) { m4d.seleccionarAct(a || null, !!volar); recolor(); },
  alClic: (cb) => { alClicCb = cb; },
  fechaExterna: () => m4d.i,
  montar(slot) {
    const v = document.getElementById('visorBIM');
    if (!vuelta) vuelta = { p: v.parentNode, s: v.nextSibling };
    slot.appendChild(v); activo = true; zonas0 = m4d.zonasOn; if (!zonas0) m4d.verZonas(true); sinRecorrido();
    requestAnimationFrame(() => { window.dispatchEvent(new Event('resize')); S.pedir(); });
  },
  desmontar() {
    if (!activo) return; activo = false; cmp = null;
    const v = document.getElementById('visorBIM'); if (vuelta) vuelta.p.insertBefore(v, vuelta.s);
    if (!zonas0) m4d.verZonas(false); else m4d.pintarZonas();
    requestAnimationFrame(() => window.dispatchEvent(new Event('resize')));
  },
};
const api = crono4D({ raiz, D, a3d, detalle: false, alSel: () => recolor() });
if (croDet) { croDet.classList.remove('card'); croDet.style.cssText = 'border-top:1px solid var(--line);padding-top:10px'; raiz.querySelector('#c4Extra').appendChild(croDet); }
window.__c4d = api;
const vigilar = () => { const on = raiz.classList.contains('on'); if (on && !activo) api.montar(); else if (!on && activo) api.desmontar(); };
new MutationObserver(vigilar).observe(raiz, { attributes: true, attributeFilter: ['class'] });
vigilar();
