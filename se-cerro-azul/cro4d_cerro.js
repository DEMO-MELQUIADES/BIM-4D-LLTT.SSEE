import { crono4D, COL } from './cro4d.js?v=81e3f81e';
import { CRONO } from './crono4d.js?v=61af4bde';

const listo = () => new Promise((ok) => { const t = () => (window.__se && window.__listo ? ok(window.__se) : setTimeout(t, 120)); t(); });
const S = await listo();
const { THREE, scene, camera, controls, renderer, REG, pedir, sombra, volar, visibilidad, aplicarColor, fijarSubsuelo, CTX, selBox, tocar } = S;
const raiz = document.getElementById('v-cro');
const ACTS = CRONO.acts;

const DUENO = new Map(), UNID = new Map(), VER = new Map();
for (const { obj, info } of REG) {
  const key = info && info.key; if (!key) continue;
  for (const a of ACTS) {
    const s = a.sel; if (!s || !s.k || !s.k.includes(key)) continue;
    if (s.x && !(obj.position.x >= s.x[0] && obj.position.x < s.x[1])) continue;
    DUENO.set(obj, a); break;
  }
}
for (const a of ACTS) {
  const objs = REG.filter((r) => DUENO.get(r.obj) === a).map((r) => r.obj);
  const u = [];
  for (const o of objs) { if (a.sel && a.sel.partes && o.children.length >= 4) u.push(...o.children); else u.push(o); }
  UNID.set(a, u);
  if (a.sel && a.sel.ver) VER.set(a, REG.filter((r) => r.info && a.sel.ver.includes(r.info.key)).map((r) => r.obj));
}
const RAIZ = new Set(REG.map((r) => r.obj));
const CTXSET = new Set([...(CTX.subsuelo || []), ...(CTX.tapas || [])]);
scene.traverse((m) => { if (m.isMesh && m.userData.cs0 == null) m.userData.cs0 = m.castShadow; });

const mat = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.55, metalness: 0.08, ...o });
const fant = (c, op) => new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: op, depthWrite: false });
const MAT = { curso: mat(0xf59e0b, { emissive: 0x7c2d12, emissiveIntensity: 0.18 }), atras: mat(0xdc2626, { emissive: 0x450a0a, emissiveIntensity: 0.22 }),
  periodo: mat(0x22c55e, { emissive: 0x052e16, emissiveIntensity: 0.15 }), antes: mat(0xcbd5e1, { roughness: 0.75 }),
  fa: fant(0xdc2626, 0.24), falta: fant(0x64748b, 0.13), selF: fant(0x2563eb, 0.32) };
const FANT = new Set(['fa', 'falta', 'selF']);

let activo = false, subPorMi = false;
const tocados = new Set();
function pintar(u, modo) {
  if (modo === 'nada') { u.visible = false; tocados.add(u); return; }
  if (!RAIZ.has(u)) { u.visible = CTXSET.has(u) ? u.visible : true; tocados.add(u); }
  const m = modo === 'hecho' ? null : MAT[modo];
  u.traverse((x) => { if (!x.isMesh) return; x.material = m || x.userData.mat0 || x.material; x.castShadow = FANT.has(modo) ? false : !!x.userData.cs0; });
}
function aplicar(k, o) {
  if (!activo) return;
  visibilidad();
  const a0 = o.cmpA;
  for (const a of ACTS) {
    const U = UNID.get(a); if (!U || !U.length) continue;
    const n = U.length, e = Math.max(0, o.v(a, k) ?? 0), s = o.estado(a, k);
    const nh = e >= 0.999 ? n : Math.floor(e * n + 1e-9);
    const n0 = a0 != null ? (o.v(a, a0) >= 0.999 ? n : Math.floor(Math.max(0, o.v(a, a0) ?? 0) * n + 1e-9)) : 0;
    const enCurso = e > 0 && e < 0.999 && nh < n ? nh : -1;
    const esSel = o.sel === a;
    U.forEach((u, i) => {
      let modo;
      if (i < nh) modo = a0 != null ? (i < n0 ? 'antes' : 'periodo') : 'hecho';
      else if (i === enCurso) modo = a0 == null && s === 'atras' ? 'atras' : 'curso';
      else if (esSel) modo = 'selF';
      else if (a0 == null && e <= 0 && s === 'atras') modo = 'fa';
      else modo = o.fantasma ? 'falta' : 'nada';
      if (a.sel.suave && (modo === 'curso' || modo === 'atras')) modo = 'hecho';
      pintar(u, modo);
    });
  }
  if (!o.rapido) sombra(); else pedir();
  marco(o.sel);
}

const caja = new THREE.Box3Helper(new THREE.Box3(), new THREE.Color(0x2563eb)); caja.visible = false; caja.material.depthTest = false; caja.renderOrder = 5; scene.add(caja);
function objsDe(a) { return a ? (UNID.get(a) || []).concat(VER.get(a) || []) : []; }
function marco(a) {
  const os = objsDe(a); if (!os.length) { caja.visible = false; pedir(); return null; }
  const b = new THREE.Box3(); os.forEach((x) => b.expandByObject(x)); if (b.isEmpty()) { caja.visible = false; return null; }
  caja.box.copy(b.expandByScalar(0.3)); caja.visible = true; pedir(); return b;
}
function resaltar(a, irA) {
  const b = marco(a);
  const bajo = !!(b && b.getCenter(new THREE.Vector3()).y < -0.2);
  if (bajo && !S.subsueloDe()) { fijarSubsuelo(true); subPorMi = true; }
  else if (!bajo && subPorMi) { fijarSubsuelo(false); subPorMi = false; }
  if (bajo || subPorMi) api && api.fijar(api.k);
  if (!irA || !b) return;
  const c = b.getCenter(new THREE.Vector3()); const r = Math.max(2.5, b.getSize(new THREE.Vector3()).length() * 0.62);
  const dir = camera.position.clone().sub(controls.target).normalize(); if (dir.y < 0.32) { dir.y = 0.45; dir.normalize(); }
  volar(c.clone().addScaledVector(dir, Math.max(r * 1.7, 9)), c);
}

let alClicCb = null, abajo = null;
renderer.domElement.addEventListener('pointerdown', (e) => { abajo = activo && e.button === 0 ? [e.clientX, e.clientY] : null; });
renderer.domElement.addEventListener('pointerup', (e) => {
  const a = abajo; abajo = null; if (!a || !activo || Math.hypot(e.clientX - a[0], e.clientY - a[1]) > 5) return;
  setTimeout(() => {
    S.seleccionar(null);
    const h = tocar(e); let o = h && h.object;
    while (o && !RAIZ.has(o)) o = o.parent;
    const act = o ? DUENO.get(o) : null;
    if (alClicCb) alClicCb(act ? [act] : []);
  }, e.pointerType === 'touch' ? 340 : 0);
});

let vuelta = null;
const a3d = {
  leyenda: [['#a8a29e', 'Construido (color real)'], ['curso', 'En curso'], ['atras', 'Atrasado'], ['fa', 'Debía empezar']],
  fantasma: true,
  fijar: (k, o) => { estado = o; aplicar(k, o); },
  fin: () => sombra(),
  resaltar,
  piezas: (a) => (UNID.get(a) || []).length,
  alClic: (cb) => { alClicCb = cb; },
  montar(slot) {
    const v = document.getElementById('visor');
    if (!vuelta) vuelta = { p: v.parentNode, s: v.nextSibling };
    slot.appendChild(v); activo = true;
    selBox.material.visible = false; S.seleccionar(null);
    REG.forEach(({ obj }) => obj.traverse((m) => { if (m.isMesh && m.userData.mat0) m.material = m.userData.mat0; }));
    requestAnimationFrame(() => { window.dispatchEvent(new Event('resize')); pedir(); });
  },
  desmontar() {
    if (!activo) return; activo = false;
    tocados.forEach((u) => { if (!RAIZ.has(u)) u.visible = true; }); tocados.clear();
    scene.traverse((m) => { if (m.isMesh && m.userData.cs0 != null) m.castShadow = m.userData.cs0; });
    if (subPorMi) { fijarSubsuelo(false); subPorMi = false; }
    visibilidad(); aplicarColor(); caja.visible = false; selBox.material.visible = true;
    const v = document.getElementById('visor'); if (vuelta) vuelta.p.insertBefore(v, vuelta.s); pedir();
  },
};
let estado = null;
const areas = Object.entries(CRONO.areas).map(([k, nombre]) => ({ k, nombre, acts: ACTS.filter((a) => a.area === k) }));
a3d.verArea = (k) => { const as = k ? areas.find((x) => x.k === k).acts : []; const b = new THREE.Box3(); as.forEach((a) => objsDe(a).forEach((o) => b.expandByObject(o)));
  if (b.isEmpty()) { caja.visible = false; pedir(); return; } caja.box.copy(b.expandByScalar(0.3)); caja.visible = true;
  const c = b.getCenter(new THREE.Vector3()); const r = Math.max(4, b.getSize(new THREE.Vector3()).length() * 0.6); const dir = camera.position.clone().sub(controls.target).normalize(); if (dir.y < 0.32) { dir.y = 0.45; dir.normalize(); }
  volar(c.clone().addScaledVector(dir, Math.max(r * 1.6, 12)), c); };
const api = crono4D({ raiz, D: { ...CRONO, areas, areasTit: 'Por área de la obra' }, a3d });
window.__c4d = api;
const vigilar = () => { const on = raiz.classList.contains('on'); if (on && !activo) api.montar(); else if (!on && activo) api.desmontar(); };
new MutationObserver(vigilar).observe(raiz, { attributes: true, attributeFilter: ['class'] });
vigilar();
void COL; void tocados;
