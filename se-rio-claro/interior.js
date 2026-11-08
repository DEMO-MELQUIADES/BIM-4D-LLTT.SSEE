

import * as THREE from 'three';
import * as P from './lib.js';
const { V, M } = P;

const _tex = new Map();
function lienzo(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function texturaDe(c) { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
function ajusta(g, txt, max) { let s = txt; while (s.length > 3 && g.measureText(s).width > max) s = s.slice(0, -2); return s === txt ? txt : s.slice(0, -1) + '…'; }
function lineas(g, txt, max, n = 3) {
  const out = []; let l = '';
  for (const w of String(txt).split(' ')) { const p = l ? l + ' ' + w : w; if (g.measureText(p).width > max && l) { out.push(l); l = w; } else l = p; }
  if (l) out.push(l); return out.slice(0, n);
}
const RES = typeof matchMedia !== 'undefined' && matchMedia('(max-width: 820px)').matches ? 288 : 416;
function placa(g, W, px, num, cod, nombre, nuevo) {
  const x0 = px(0.07), py = px(0.09), pw = W - px(0.14), ph = px(0.27);
  g.fillStyle = '#fbfbf8'; g.fillRect(x0, py, pw, ph); g.strokeStyle = '#3a4048'; g.lineWidth = Math.max(2, W / 160); g.strokeRect(x0, py, pw, ph);
  if (nuevo) { g.fillStyle = '#2f6fe4'; g.fillRect(x0, py, pw, px(0.025)); }
  g.fillStyle = '#121a24'; g.textAlign = 'left'; g.textBaseline = 'middle';
  g.font = `700 ${Math.round(px(0.12))}px Inter, sans-serif`;
  const sn = String(num); g.fillText(sn, x0 + px(0.03), py + ph * 0.42);
  const xt = x0 + px(0.06) + g.measureText(sn).width, ancho = x0 + pw - xt - px(0.02);
  if (cod) { g.font = `600 ${Math.round(px(0.042))}px JetBrains Mono, monospace`; g.fillText(ajusta(g, cod, ancho), xt, py + px(0.06)); }
  g.font = `${Math.round(px(0.034))}px Inter, sans-serif`;
  lineas(g, nombre, ancho, cod ? 3 : 4).forEach((l, i) => g.fillText(l, xt, py + (cod ? px(0.11) : px(0.06)) + i * px(0.045)));
  return py + ph;
}
export function frenteTablero({ num, nombre, cod = '', tipo = 'ctrl', w = 0.8, h = 2.2, nuevo = false, leds = 4, visor = [] }) {
  const k = [num, nombre, cod, tipo, w, h, nuevo, visor.join('/')].join('|'); if (_tex.has(k)) return _tex.get(k);
  const W = RES, H = Math.round((h / w) * RES); const [c, g] = lienzo(W, H);
  const px = (m) => (m / w) * W;
  g.fillStyle = nuevo ? '#dfe3dc' : '#d6d9d3'; g.fillRect(0, 0, W, H);
  g.strokeStyle = '#aeb3ad'; g.lineWidth = 3; g.strokeRect(px(0.03), px(0.03), W - px(0.06), H - px(0.06));
  g.fillStyle = '#9ea39d'; for (const y of [0.3, h / 2, h - 0.3]) g.fillRect(px(0.012), px(y) - 10, 8, 20);
  const yPl = placa(g, W, px, num, cod, nombre, nuevo);
  let y = yPl + px(0.07);
  if (tipo === 'prot' || tipo === 'ctrl' || tipo === 'reg') {
    const cols = ['#2ecc71', '#2ecc71', '#e74c3c', '#f1c40f', '#2ecc71', '#2ecc71'];
    for (let i = 0; i < leds; i++) { g.fillStyle = cols[i % cols.length]; g.beginPath(); g.arc(px(0.14) + i * px(0.09), y, px(0.018), 0, 6.283); g.fill(); g.strokeStyle = '#555'; g.lineWidth = 1; g.stroke(); }
    y += px(0.08);
    const nV = tipo === 'prot' ? 2 : 1;
    for (let r = 0; r < nV; r++) {
      g.fillStyle = '#2a2f36'; g.fillRect(px(0.12), y, W - px(0.24), px(0.26));
      g.fillStyle = '#1b1f24'; g.fillRect(px(0.15), y + px(0.03), W * 0.45, px(0.16));
      g.fillStyle = '#7ddc8a'; g.font = `${Math.round(px(0.03))}px JetBrains Mono, monospace`;
      const t = [visor[r] || ''];
      t.forEach((s, i) => g.fillText(s, px(0.17), y + px(0.07) + i * px(0.05)));
      for (let i = 0; i < 4; i++) { g.fillStyle = '#5a6069'; g.fillRect(W * 0.68 + (i % 2) * px(0.08), y + px(0.06) + Math.floor(i / 2) * px(0.08), px(0.06), px(0.05)); }
      y += px(0.34);
    }
    if (tipo === 'reg') { 
      for (const x of [0.16, 0.44]) { g.fillStyle = '#1b1f24'; g.fillRect(px(x), y, px(0.2), px(0.1)); g.fillStyle = '#ff5c3a'; g.font = `bold ${Math.round(px(0.055))}px JetBrains Mono, monospace`; g.fillText('- - -', px(x + 0.02), y + px(0.055)); }
      g.fillStyle = '#c0392b'; g.beginPath(); g.arc(px(0.7), y + px(0.05), px(0.035), 0, 6.283); g.fill();
      y += px(0.16);
      for (let i = 0; i < 3; i++) { g.fillStyle = '#2f3540'; g.beginPath(); g.arc(px(0.2) + i * px(0.2), y + px(0.05), px(0.035), 0, 6.283); g.fill(); g.strokeStyle = '#ccc'; g.lineWidth = 2; g.beginPath(); g.moveTo(px(0.2) + i * px(0.2), y + px(0.05)); g.lineTo(px(0.2) + i * px(0.2) + px(0.028), y + px(0.03)); g.stroke(); }
      y += px(0.14);
      for (let i = 0; i < 2; i++) { g.fillStyle = i ? '#27ae60' : '#2c3e50'; g.beginPath(); g.arc(px(0.33) + i * px(0.14), y + px(0.04), px(0.03), 0, 6.283); g.fill(); }
      y += px(0.14);
      g.fillStyle = '#f1c40f'; g.beginPath(); g.moveTo(W / 2, y); g.lineTo(W / 2 + px(0.09), y + px(0.16)); g.lineTo(W / 2 - px(0.09), y + px(0.16)); g.closePath(); g.fill();
      g.fillStyle = '#111'; g.font = `bold ${Math.round(px(0.08))}px sans-serif`; g.textAlign = 'center'; g.fillText('⚡', W / 2, y + px(0.11)); g.textAlign = 'left';
    }
  } else if (tipo === 'aux') {
    for (let r = 0; r < 3; r++) { for (let i = 0; i < 4; i++) { g.fillStyle = '#2d3238'; g.fillRect(px(0.12) + i * px(0.15), y + r * px(0.14), px(0.11), px(0.09)); g.fillStyle = i % 3 ? '#2ecc71' : '#e74c3c'; g.fillRect(px(0.14) + i * px(0.15), y + r * px(0.14) + px(0.03), px(0.03), px(0.03)); } }
    y += px(0.45);
    g.fillStyle = '#1b1f24'; g.fillRect(px(0.15), y, W - px(0.3), px(0.12)); g.fillStyle = '#7ddc8a'; g.font = `bold ${Math.round(px(0.05))}px JetBrains Mono, monospace`; g.fillText('- - -  Vcc', px(0.17), y + px(0.065));
  } else if (tipo === 'com') {
    for (let r = 0; r < 5; r++) { g.fillStyle = '#2d3238'; g.fillRect(px(0.1), y + r * px(0.1), W - px(0.2), px(0.08)); for (let i = 0; i < 8; i++) { g.fillStyle = (i * 7 + r) % 3 ? '#2ecc71' : '#f1c40f'; g.fillRect(px(0.14) + i * px(0.07), y + r * px(0.1) + px(0.03), px(0.02), px(0.02)); } }
  }
  g.fillStyle = '#b9bdb7'; for (let i = 0; i < 9; i++) g.fillRect(px(0.15), H - px(0.4) + i * px(0.03), W - px(0.3), px(0.012));
  g.fillStyle = '#3a3f45'; g.fillRect(W - px(0.14), px(h * 0.5), px(0.03), px(0.16));
  const t = texturaDe(c); _tex.set(k, t); return t;
}

export function frenteCelda({ num, nombre, cod = '', nuevo = false, w = 0.6, h = 2.3, rele = '' }) {
  const k = ['celda', num, nombre, cod, nuevo, w, h, rele].join('|'); if (_tex.has(k)) return _tex.get(k);
  const W = RES, H = Math.round((h / w) * RES); const [c, g] = lienzo(W, H); const px = (m) => (m / w) * W;
  g.fillStyle = nuevo ? '#d9ddd7' : '#cfd3cd'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#e8ebe6'; g.fillRect(px(0.03), px(0.04), W - px(0.06), px(0.62)); g.strokeStyle = '#9ea39d'; g.lineWidth = 2; g.strokeRect(px(0.03), px(0.04), W - px(0.06), px(0.62));
  placa(g, W, px, num, cod, nombre, nuevo);
  g.fillStyle = '#2a2f36'; g.fillRect(px(0.1), px(0.42), W - px(0.2), px(0.18)); g.fillStyle = '#7ddc8a'; g.font = `${Math.round(px(0.03))}px JetBrains Mono, monospace`; g.textBaseline = 'middle'; g.fillText(rele, px(0.13), px(0.51));
  const y0 = px(0.75);
  g.strokeStyle = '#1b2430'; g.lineWidth = 4; g.beginPath(); g.moveTo(px(0.1), y0); g.lineTo(W - px(0.1), y0); g.stroke();
  g.beginPath(); g.moveTo(W / 2, y0); g.lineTo(W / 2, y0 + px(0.25)); g.stroke();
  g.strokeStyle = '#1b2430'; g.lineWidth = 3; g.beginPath(); g.moveTo(W / 2, y0 + px(0.25)); g.lineTo(W / 2 + px(0.09), y0 + px(0.42)); g.stroke();
  g.beginPath(); g.moveTo(W / 2, y0 + px(0.45)); g.lineTo(W / 2, y0 + px(0.6)); g.stroke();
  g.strokeStyle = '#1b2430'; g.lineWidth = 3; g.strokeRect(W / 2 - px(0.07), y0 + px(0.6), px(0.14), px(0.14)); g.fillStyle = '#e74c3c'; g.fillRect(W / 2 - px(0.05), y0 + px(0.62), px(0.1), px(0.1));
  g.beginPath(); g.moveTo(W / 2, y0 + px(0.74)); g.lineTo(W / 2, y0 + px(0.95)); g.stroke();
  g.fillStyle = '#1b2430'; g.beginPath(); g.moveTo(W / 2 - px(0.06), y0 + px(0.95)); g.lineTo(W / 2 + px(0.06), y0 + px(0.95)); g.lineTo(W / 2, y0 + px(1.03)); g.closePath(); g.fill();
  for (let i = 0; i < 3; i++) { g.fillStyle = '#e74c3c'; g.beginPath(); g.arc(px(0.14) + i * px(0.07), y0 + px(1.15), px(0.02), 0, 6.283); g.fill(); }
  g.fillStyle = '#3a3f45'; g.fillRect(W - px(0.12), y0 + px(0.3), px(0.03), px(0.14));
  g.strokeStyle = '#9ea39d'; g.lineWidth = 2; g.strokeRect(px(0.04), H - px(0.6), W - px(0.08), px(0.55));
  g.fillStyle = '#b9bdb7'; for (let i = 0; i < 7; i++) g.fillRect(px(0.12), H - px(0.5) + i * px(0.04), W - px(0.24), px(0.012));
  const t = texturaDe(c); _tex.set(k, t); return t;
}

export function gabinete({ w, h, d, tex, mat = M.tablero, zocalo = 0.1, X, Y, rot = 0, piso = 0.12 }) {
  const g = new THREE.Group();
  const lados = mat; const frente = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: 0.12 });
  const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [lados, lados, lados, lados, frente, lados]);
  cuerpo.position.y = piso + zocalo + h / 2; cuerpo.castShadow = true; cuerpo.receiveShadow = true; g.add(cuerpo);
  if (zocalo > 0) g.add(P.caja(w, zocalo, d, M.negro, 0, piso + zocalo / 2, 0));
  g.add(P.caja(0.03, 0.16, 0.025, M.aceroOsc, w / 2 - 0.1, piso + zocalo + h * 0.5, d / 2 + 0.012));
  g.position.set(X, 0, -Y); g.rotation.y = (rot * Math.PI) / 180;
  g.userData.obstaculo = true;
  return g;
}

const COL_OBRA = { nuevo: 0x2f6fe4, interv: 0xe07b1f, rel: 0xc9a227, integ: 0x8e44ad };
const _rayas = new Map();
function texRayas(col) {
  if (_rayas.has(col)) return _rayas.get(col);
  const [c, g] = lienzo(64, 64); g.clearRect(0, 0, 64, 64); g.strokeStyle = '#' + col.toString(16).padStart(6, '0'); g.lineWidth = 14;
  for (let i = -64; i <= 128; i += 32) { g.beginPath(); g.moveTo(i, 64); g.lineTo(i + 64, 0); g.stroke(); }
  const t = texturaDe(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; _rayas.set(col, t); return t;
}
export function zonaObra(e) {
  const col = COL_OBRA[e.obra]; const g = new THREE.Group(); g.userData.zona = e.key;
  const mat = new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 1, depthWrite: true });
  const z0 = e.zocalo ?? 0.1, y0 = e.yPiso + 0.01, y1 = e.yPiso + z0 + e.h + 0.04, zf = e.d / 2 + 0.025, t = 0.035;
  const bar = (w, h, x, y) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.02), mat); m.position.set(x, y, zf); g.add(m); };
  bar(e.w + 0.08, t, 0, y1); bar(e.w + 0.08, t, 0, y0 + t / 2); bar(t, y1 - y0, -e.w / 2 - 0.04, (y0 + y1) / 2); bar(t, y1 - y0, e.w / 2 + 0.04, (y0 + y1) / 2);
  const prof = 0.7, tex = texRayas(col).clone(); tex.needsUpdate = true; tex.repeat.set((e.w + 0.3) / 0.35, prof / 0.35);
  const piso = new THREE.Mesh(new THREE.PlaneGeometry(e.w + 0.3, prof), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.6, depthWrite: false }));
  piso.rotation.x = -Math.PI / 2; piso.position.set(0, e.yPiso + 0.035, e.d / 2 + prof / 2 + 0.03); g.add(piso);
  g.traverse((m) => { if (m.isMesh) m.raycast = () => {}; });
  g.position.set(e.X, 0, -e.Y); g.rotation.y = (e.rot * Math.PI) / 180;
  return g;
}



export const TABLEROS = [
  { n: 1, nombre: 'Tablero de telecomunicaciones', sigla: 'TCC', tipo: 'com', X: 26.03, Y: -3.42, rot: 180, w: 0.82, d: 0.64 },
  { n: 2, nombre: 'Tablero SCADA', sigla: 'TAS', tipo: 'com', X: 26.88, Y: -3.42, rot: 180, w: 0.82, d: 0.64, datos: { Función: 'Adquisición y supervisión; concentra los IED de la subestación' } },
  { n: 3, nombre: 'Mando y supervisión: llegada 220 kV y salida 33 kV Mina Sur e Mina Norte', sigla: 'TSM', tipo: 'ctrl', X: 27.79, Y: -3.42, rot: 180, w: 0.82, d: 0.64 },
  { n: 4, nombre: 'Mando y supervisión: llegada 220 kV y salida 10 kV Río Claro', sigla: 'TSM', tipo: 'ctrl', X: 28.79, Y: -3.42, rot: 180, w: 1.05, d: 0.64 },
  { n: 5, nombre: 'Protección y medida Río Claro 220/10 kV', sigla: 'TPM', tipo: 'prot', X: 29.94, Y: -3.42, rot: 180, w: 0.82, d: 0.64, visor: ['50/51'], fun: ['=B00.TT-382'], obra: 'rel',
    obraTxt: 'Entrega la señal de tensión de barra del TT-382 al tablero 18 (cables existentes WGCP0150001 y WGCP0150002; en el diagrama de bloques figura como «TPM. Cliente B00.TT.382 señal de barra»).',
    datos: { Relés: 'R51 (50/51) · lado 10 kV TP-384', Medición: 'TC 1050–1300/5 A cl. 3,0' } },
  { n: 6, nombre: 'SS.AA. 220/48 V Río Claro', sigla: 'TSA', tipo: 'aux', X: 30.8, Y: -3.42, rot: 180, w: 0.82, d: 0.64 },
  { n: 7, nombre: 'Automatización SAS', sigla: 'SAS', cod: '=E1.A01.CS01', tipo: 'ctrl', X: 31.65, Y: -3.42, rot: 180, w: 0.82, d: 0.64, visor: ['SAS'], obra: 'rel',
    obraTxt: 'Cables existentes con el 17 (CP02), el 18 (CP01) y SS.AA.; sin cables nuevos.' },
  { n: 8, nombre: 'Rectificadores 48 Vcc de Mina Norte y Río Claro', tipo: 'aux', X: 32.52, Y: -3.42, rot: 180, w: 0.82, d: 0.64 },
  { n: 9, nombre: 'Protección llegada 220 kV y salida 33 kV Mina Norte y Mina Sur', sigla: 'TP', tipo: 'prot', X: 32.6, Y: -2.68, rot: -90, w: 0.82, d: 0.7, visor: ['50/51', '87T'],
    datos: { 'TP-383 AT': 'R22 (50/51 · 50N/51N) · R21 (87T) · R23 86 bloqueo', 'TP-383 BT': 'R41 (50/51 · 50N/51N)', 'TP-384': 'R32 (50/51 · 50N/51N · 27/59) · R31 (87T) · R33 86', 'Salidas 33 kV': 'IN-330 · R51' } },
  { n: 10, nombre: 'Medición de Mina Norte, Mina Sur y Río Claro', sigla: 'TM', tipo: 'ctrl', X: 32.6, Y: -1.85, rot: -90, w: 0.82, d: 0.7, visor: ['kWh'], datos: { Medidores: 'medidor de energía · medidor de tensión de barra' } },
  { n: 11, nombre: 'SS.AA. 220/48 V Mina Norte', sigla: 'TSA', tipo: 'aux', X: 32.6, Y: -1.0, rot: -90, w: 0.82, d: 0.7 },
  { n: 12, nombre: 'Regulación del transformador TP-384', tipo: 'reg', X: 34.7, Y: -1.23, rot: 90, w: 0.8, d: 0.8 },
  { n: 13, nombre: 'Regulación del transformador TP-383', tipo: 'reg', X: 34.7, Y: -2.06, rot: 90, w: 0.8, d: 0.8 },
  { n: 14, nombre: 'Protección de línea 220 kV L-2201', tipo: 'prot', X: 34.7, Y: -2.91, rot: 90, w: 0.8, d: 0.8, visor: ['21/21N', '27'],
    datos: { Relés: 'R11 (21/21N · 79) · R13 (27) · R12 (67N)', Registrador: 'registrador de fallas (DFR)', 'Transformadores de medida': 'TC-380 400/1/1/1 A · TT-380 220/√3 / 0,1/√3 kV', Interruptor: 'IN-380 3 150 A · 245 kV · 40 kA' } },
  { n: 15, nombre: 'Rectificador 220 Vca / 110–48 Vcc', sigla: 'PMI', tipo: 'aux', X: 34.7, Y: -3.69, rot: 90, w: 0.8, d: 0.8 },
  { n: 16, nombre: 'Servicios auxiliares 220 Vca / 110 Vcc / 48 Vcc', sigla: 'SS.AA.', cod: '=E1.A01.SSAA', tipo: 'aux', X: 36.55, Y: -3.69, rot: -90, w: 0.8, d: 0.8, obra: 'interv',
    obraTxt: 'Circuitos nuevos para el TP-385 (alimentación del registrador de fallas, mando y motor del CBC, ventiladores, 220 V ininterrumpida) y para el tablero 22; reconexión de la alimentación del IN-383.',
    datos: { 'Montaje nuevo (metrado)': 'ITM 3×50 A 220–240 Vca 20 kA · 2×32 A 250 Vcc · 2 × 2×10 A 250 Vcc para el TP-385', Borneras: 'XDC1 (110 Vcc) · XAC1 / XAC2 (220 Vca) · X30' } },
  { n: 17, nombre: 'Protección diferencial de barra 220 kV', sigla: 'CP-02', cod: '=E1.A01.CP02', tipo: 'prot', X: 36.55, Y: -2.88, rot: -90, w: 0.8, d: 0.8, visor: ['87B', '50BF'], obra: 'interv',
    obraTxt: 'Reconexión de los disparos al IN-383 y a los IN-380/381/382 (cables reubicados por obras civiles) e intercambio de corrientes y disparos con el CP01 del TP-385.',
    datos: { Relé: 'relé diferencial de barras (87B · 50BF)', Zonas: 'Línea L-2201 · TP-383 · TP-384 · TP-385 (bahía IN-383: TC 170–200/1/1/1 A, 15 VA, 5P20)' } },
  { n: 18, nombre: 'Protección y control del transformador TP-385', sigla: 'CP01', cod: '=E1.A01.CP01', tipo: 'prot', X: 36.55, Y: -2.02, rot: -90, w: 0.8, d: 0.8, visor: ['87T', '50/51'], obra: 'interv',
    obraTxt: 'Tablero existente, actualizado para el ingreso del TP-385: cables nuevos a los TC y al gabinete del TP-385, reconexión de los cables del IN-383; mantiene los existentes a SB-383, K03, K01, TT-382, CP02, CS01 y SS.AA.',
    datos: { 'Protección principal': 'relé — 87T · 50/51 · 50N/51N (relé -FP1)', 'Protección de respaldo': 'relé — 50/51 · 50N/51N · 27/59 (relé -FP2)', Bloqueo: '86T relé de disparo y bloqueo', Medición: 'medidor de energía (-P11) · tensión de barra desde el TT-382', Comunicaciones: 'Switch AFS670 (-TJ1 / -TJ2)', 'TC AT': '170–200/1/1/1 A · 15 VA cl. 0,2 / 5P20 / 5P20', 'TC neutro 22,9 kV': '900–1 100/1/1/1 A', 'TC 10 kV': '2 100–2 500/1/1/1 A', Mandos: 'Cierre y disparo (bobinas 1 y 2) del IN-383 · apertura y cierre del SB-383 · disparo y cierre del IN-10' } },
  { n: 19, nombre: 'Registrador de fallas', sigla: 'TLRF-01', tipo: 'prot', X: 36.55, Y: -1.17, rot: -90, w: 0.8, d: 0.8 },
  { n: 20, nombre: 'Comunicaciones Telecom Demo', tipo: 'com', X: 24.2, Y: 0.15, rot: 0, w: 0.6, d: 0.45 },
  { n: 21, nombre: 'Gabinete de comunicaciones Cliente Demo', tipo: 'com', X: 25.2, Y: 0.2, rot: 0, w: 0.5, d: 0.4, h: 1.2 },
];
export const CELDAS_C = ['Celda de llegada 10 kV', 'Celda de seccionador 10 kV', 'Celda de salida 10 kV a casa fuerza', 'Celda de salida a planta concentradora', 'Celda de salida 10 kV a Mina Centro'];
export const CELDAS_K = ['Celda de enlace 10 kV (con celdas del TP-384)', 'Celda de salida a planta concentradora 1', 'Celda de llegada del transformador TP-385', 'Celda de salida a planta concentradora 2', 'Celda de reserva 10 kV'];

export const K_IN = ['IN-117', 'IN-118', 'IN-116', 'IN-119', 'IN-120'];
export const K_TC = ['TC-106', 'TC-107', 'TC-105', 'TC-108', 'TC-109'];
export const K_Y = [-1.13, -1.75, -2.37, -3.03, -3.65];
export const EQUIPOS = [];

export function construirInterior(ctx) {
  const { reg, NUMS, L, en } = ctx; const s = L.sala; const piso = 0.12; const y2 = ctx.y2;
  const zonas = new THREE.Group(); zonas.userData.noObst = true; zonas.userData.zonas = true; ctx.zonas = zonas;
  const fichaTab = (t) => ({ id: t.n >= 22 ? 'Tablero 22 (T1)' : `Tablero ${t.n}`, nombre: t.nombre, estado: t.nuevo ? 'P' : 'E', cod: t.cod ? [t.cod, ...(t.fun || [])] : t.fun, obra: t.obra, obraTxt: t.obraTxt,
    datos: Object.assign({ Código: t.cod ? `${t.cod}${t.sigla ? ' (' + t.sigla + ')' : ''}` : t.sigla || '—', Ubicación: t.n >= 22 ? 'Sala de control, segundo piso' : 'Sala de control, primer piso', Dimensiones: `${Math.round(t.w * 1000)} × ${Math.round(t.d * 1000)} × ${Math.round((t.h || 2.2) * 1000)} mm` }, t.datos || {}),
    planos: t.cod ? ['', '', ''] : t.n === 14 || t.n === 9 ? ['', ''] : [''], lista: !!t.nuevo || !!t.obra });
  const equipo = (e) => {
    EQUIPOS.push(e); e.info.eqKey = e.key;
    NUMS.push({ obj: e.obj, txt: String(e.n), cod: e.cod || e.sigla || '', X: e.X, Y: e.Y, h: e.yPiso + (e.zocalo ?? 0.1) + e.h + 0.28, nuevo: e.obra === 'nuevo', obra: e.obra, piso: e.piso, key: e.key });
    if (e.obra) zonas.add(zonaObra(e));
  };
  for (const t of TABLEROS) {
    const h = t.h || 2.2;
    const g = gabinete({ w: t.w, h, d: t.d, tex: frenteTablero({ num: t.n, nombre: t.nombre, cod: t.cod || t.sigla || '', tipo: t.tipo, w: t.w, h, nuevo: !!t.nuevo, visor: t.visor || [] }), X: t.X, Y: t.Y, rot: t.rot, mat: t.nuevo ? M.tableroNuevo : M.tablero, piso });
    const info = fichaTab(t); reg(g, 'sala', info);
    equipo({ key: 'T' + t.n, n: t.n, tipo: 'tablero', cod: t.cod, sigla: t.sigla, nombre: t.nombre, X: t.X, Y: t.Y, rot: t.rot, w: t.w, d: t.d, h, yPiso: piso, piso: 1, obj: g, info, obra: t.obra });
  }
  CELDAS_C.forEach((nombre, k) => {
    const X = 19.7 + k * 1.12, num = `C0${k + 1}`;
    const g = gabinete({ w: 1.08, h: 2.3, d: 2.0, tex: frenteCelda({ num, nombre, w: 1.08 }), X, Y: -2.6, rot: 180, mat: M.celda, piso });
    const info = { id: num, nombre: `${nombre} (bahía TP-384)`, estado: 'E', datos: { Ubicación: 'Sala de control, primer piso' }, planos: [], lista: false };
    reg(g, 'sala', info);
    equipo({ key: num, n: num, tipo: 'celda', nombre, X, Y: -2.6, rot: 180, w: 1.08, d: 2.0, h: 2.3, yPiso: piso, piso: 1, obj: g, info });
  });
  K_Y.forEach((Y, k) => {
    const num = `K0${k + 1}`, esK03 = k === 2;
    const g = gabinete({ w: 0.6, h: 2.3, d: 1.3, tex: frenteCelda({ num, nombre: CELDAS_K[k], cod: K_IN[k], w: 0.6, rele: '50/51' }), X: 41.25, Y, rot: -90, mat: M.celda, piso });
    const info = esK03 ? ctx.F.K03 : { id: num, nombre: `${CELDAS_K[k]}`, estado: 'E', cod: k === 0 ? '=K01+K01' : undefined, obra: k === 0 ? 'rel' : undefined,
      obraTxt: k === 0 ? 'Celda de enlace con cable existente WGCP0190004 al tablero 18 (CP01).' : undefined,
      datos: { Ubicación: 'Sala de control, primer piso', Celda: '24 kV, aislada en gas', 'Interruptor': `${K_IN[k]} · ${K_TC[k]}${k ? ' 600/1/1 A' : ''} · relé de protección` }, planos: [], lista: k === 0 };
    reg(g, 'sala', info);
    equipo({ key: num, n: num, tipo: 'celda', cod: K_IN[k], nombre: CELDAS_K[k], X: 41.25, Y, rot: -90, w: 0.6, d: 1.3, h: 2.3, yPiso: piso, piso: 1, obj: g, info, obra: esK03 ? 'interv' : k === 0 ? 'rel' : undefined });
  });
  
  const t22 = gabinete({ w: 0.8, h: 1.9, d: 0.6, tex: frenteTablero({ num: 22, nombre: 'Regulación del transformador TP-385 (nuevo)', cod: '=A1.C01.REGT', tipo: 'reg', w: 0.8, h: 1.9, nuevo: true, leds: 6, visor: ['AVR'] }), X: 38.6, Y: -4.55, rot: 180, mat: M.tableroNuevo, piso: y2, zocalo: 0.2 });
  for (let i = -1; i <= 1; i++) t22.add(P.cil(0.027, 0.027, 0.45, M.pvcGris, 10, i * 0.15, y2 + 0.2 + 1.9 + 0.225, 0.05));
  const info22 = Object.assign({}, ctx.F.T1, { cod: ['=Panel reg. TP-385'], datos: Object.assign({}, ctx.F.T1.datos, { Instrumentos: 'U90 regulador automático · B34 voltímetro · B65 amperímetro', Mandos: 'S34 conmutador voltimétrico · S43 M-O-A · S45.1 L-R · S42 subir/bajar · S45.2 parada de emergencia', Lámparas: 'H58 roja · H55 amarillas · H53/H72/H73 verdes', Entrada: ': 3 conduits EMT Ø2" por la tapa superior desde la bandeja 100×300 mm a pared · el plano del fabricante indica entrada inferior: confirmar en obra', Base: 'Zócalo de 200 mm anclado con 4 pernos de anclaje Ø3/8"' }) });
  reg(t22, 'sala', info22);
  equipo({ key: 'T22', n: 22, tipo: 'tablero', cod: '=A1.C01.REGT', nombre: 'Regulación del transformador TP-385', X: 38.6, Y: -4.55, rot: 180, w: 0.8, d: 0.6, h: 1.9, zocalo: 0.2, yPiso: y2, piso: 2, obj: t22, info: info22, obra: 'nuevo' });
  ctx.t22 = t22;
  const t19 = TABLEROS.find((t) => t.n === 19);
  const cpm = gabinete({ w: t19.w, h: 2.2, d: t19.d, tex: frenteTablero({ num: 'CPM', nombre: 'Protección y control de la L-2201 (nuevo · Integrador Demo)', cod: '=E01+WR01', tipo: 'prot', w: t19.w, h: 2.2, nuevo: true, visor: ['L-2201', ''] }), X: t19.X, Y: t19.Y, rot: t19.rot, mat: M.tableroNuevo, piso });
  const infoCPM = { id: 'CPM L-2201', nombre: 'Tablero de protección y control de la L-2201 (=E01+WR01) · nuevo, lo instala Integrador Demo', estado: 'P', obra: 'integ', integ: 'CPM L-2201',
    obraTxt: 'Ubicación supuesta: en el lugar del tablero 19 (registrador de fallas), que Integrador Demo retiró al almacén el 17–20-Set; el nuevo tablero se montó el 20-Set. Ningún plano disponible lo ubica: confirmar en campo.',
    datos: { Código: '=E01+WR01 (control diario de Integrador Demo)', Contratista: 'Integrador Demo · DEMO-OS · OS demo', Proyecto: 'LT 220 kV Río Claro – Cerro Azul (L-2201)', Ubicación: 'Sala de control, primer piso · supuesta (ver nota)' },
    planos: [], lista: true };
  reg(cpm, 'sala', infoCPM);
  equipo({ key: 'CPM', n: 'CPM', tipo: 'tablero', cod: '=E01+WR01', nombre: 'Protección y control de la L-2201 (nuevo · Integrador Demo)', X: t19.X, Y: t19.Y, rot: t19.rot, w: t19.w, d: t19.d, h: 2.2, yPiso: piso, piso: 1, obj: cpm, info: infoCPM, obra: 'integ', reemplaza: 'T19' });
  ctx.cpm = cpm;
  ctx.sala.add(zonas);

  const PI = new THREE.Group(); PI.userData.pisoSala = true;
  const huecos = [[38.8, -4.1, 40.45, -0.48], [19.2, -1.52, 28.3, -1.13], [19.2, -4.71, 33.8, -3.94]];
  huecos.forEach((h) => ctx.HUECOS.push([h[0] - 0.15, h[1] - 0.15, h[2] + 0.15, h[3] + 0.15]));
  const forma = new THREE.Shape([new THREE.Vector2(s.x0, s.y0), new THREE.Vector2(s.x1, s.y0), new THREE.Vector2(s.x1, s.y1), new THREE.Vector2(s.x0, s.y1)]);
  for (const [x0, y0, x1, y1] of huecos) { const hp = new THREE.Path([new THREE.Vector2(x0, y0), new THREE.Vector2(x1, y0), new THREE.Vector2(x1, y1), new THREE.Vector2(x0, y1)]); forma.holes.push(hp); }
  const geoP = new THREE.ExtrudeGeometry(forma, { depth: 0.17, bevelEnabled: false }); geoP.rotateX(-Math.PI / 2); geoP.translate(0, -0.05, 0);
  const losa = new THREE.Mesh(geoP, M.piso); losa.receiveShadow = true; PI.add(losa);
  for (const [x0, y0, x1, y1] of huecos) {
    const w = x1 - x0, d = y1 - y0, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, prof = 0.62;
    PI.add(P.caja(w + 0.3, 0.1, d + 0.3, M.concreto, cx, piso - prof - 0.05, -cy));
    const aLoLargo = w > d;
    if (aLoLargo) { PI.add(P.caja(w, prof, 0.08, M.concreto, cx, piso - prof / 2, -(y0 - 0.04))); PI.add(P.caja(w, prof, 0.08, M.concreto, cx, piso - prof / 2, -(y1 + 0.04))); }
    else { PI.add(P.caja(0.08, prof, d, M.concreto, x0 - 0.04, piso - prof / 2, -cy)); PI.add(P.caja(0.08, prof, d, M.concreto, x1 + 0.04, piso - prof / 2, -cy)); }
    const L_ = aLoLargo ? w : d; const n = Math.floor(L_ / 1.0);
    for (let k = 0; k <= n; k++) {
      const t = -L_ / 2 + (k * L_) / Math.max(1, n);
      for (let lv = 0; lv < 4; lv++) {
        const y = piso - 0.12 - lv * 0.14;
        PI.add(aLoLargo ? P.caja(0.04, 0.025, d * 0.6, M.acero, cx + t, y, -(y0 + d * 0.32)) : P.caja(w * 0.6, 0.025, 0.04, M.acero, x0 + w * 0.32, y, -(cy + t)));
      }
      PI.add(aLoLargo ? P.caja(0.04, prof - 0.05, 0.04, M.acero, cx + t, piso - prof / 2, -(y0 + 0.03)) : P.caja(0.04, prof - 0.05, 0.04, M.acero, x0 + 0.03, piso - prof / 2, -(cy + t)));
    }
    const rej = P.losa([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], piso, piso + 0.02, M.rejilla); rej.userData.rejilla = true; PI.add(rej);
  }
  reg(PI, 'sala', { id: 'Piso de la sala', nombre: 'Piso de la sala de control con foso y canaletas interiores', estado: 'E', datos: { Foso: 'Entre los tableros 16–19 y las celdas K01–K05, con rejilla', Canaletas: 'Dos trincheras bajo rejilla detrás de los tableros 1–8 y frente a 20/21', Soportes: 'Metálicos de 4 niveles: control trafo · control interruptor · fuerza AC/DC · comunicaciones (detalle D4)' }, planos: [], aprox: true, lista: false });

  const bq = new THREE.Group();
  bq.add(en(P.caja(1.0, 0.05, 0.005, M.cobre), 39.6, s.y1 - 0.16, piso + 0.35));
  for (const dx of [-0.42, 0, 0.42]) bq.add(en(P.cil(0.02, 0.025, 0.06, M.porcelana, 8), 39.6 + dx, s.y1 - 0.13, piso + 0.35));
  reg(bq, 'tierra', { id: 'Barra equipotencial', nombre: 'Barra de tierra equipotencial de la sala', estado: 'P', datos: { Platina: 'Cobre 50 × 5 × 1 000 mm sobre 3 aisladores (metrado ítem 7)', Conexiones: 'Pantallas de los cables 10 kV, cubas de celdas y tableros con Cu 25 / 70 mm² verde-amarillo' }, planos: [] });

  
  const BI = new THREE.Group();
  const bandeja = (a, b, w = 0.3, h = 0.1, tapa = true) => {
    const g = new THREE.Group(); const v = new THREE.Vector3().subVectors(b, a); const L_ = v.length();
    const m = new THREE.Group(); m.position.copy(a).add(b).multiplyScalar(0.5); m.lookAt(b);
    m.add(P.caja(0.03, h, L_, M.acero, -w / 2, 0, 0), P.caja(0.03, h, L_, M.acero, w / 2, 0, 0));
    const n = Math.max(1, Math.round(L_ / 0.3)); for (let i = 0; i <= n; i++) m.add(P.caja(w - 0.03, 0.02, 0.025, M.acero, 0, -h / 2 + 0.02, -L_ / 2 + (i * L_) / n));
    if (tapa) { const t = P.caja(w + 0.04, 0.012, L_, M.aceroOsc, 0, h / 2 + 0.006, 0); t.userData.tapa = true; m.add(t); }
    g.add(m); return g;
  };
  const p3 = (X, Y, h) => V(X, h, -Y);
  const hB = y2 + 2.45;
  const trazoB = [p3(40.6, -4.9, y2 + 0.5), p3(40.6, -4.9, hB), p3(38.6, -4.9, hB)];
  BI.add(bandeja(trazoB[0], trazoB[1], 0.1, 0.3), bandeja(trazoB[1], trazoB[2], 0.3, 0.1));
  for (const X of [40.6, 39.9, 39.2, 38.6]) BI.add(en(P.caja(0.04, 0.04, 0.4, M.acero), X, -4.95, hB - 0.07));
  const trazo1 = [p3(40.0, -0.3, piso + 2.6), p3(40.0, -0.6, piso + 2.6), p3(40.6, -4.6, piso + 2.6), p3(40.6, -4.9, piso + 2.75)];
  for (let i = 0; i < trazo1.length - 1; i++) BI.add(bandeja(trazo1[i], trazo1[i + 1]));
  reg(BI, 'cables', Object.assign({}, ctx.F.BANDEJA, { id: 'Bandeja interior', nombre: 'Bandejas interiores de la sala de control', datos: { 'Primer piso': 'Escalera 300×100 mm con tapa (5 tramos, curva vertical externa e interna, 2 desniveles de 115 mm, ménsulas a muro)', 'Segundo piso': 'Bandeja 100×300 mm a pared con soporte, hasta la tapa superior del tablero 22 (detalle 1)', Sube: 'Por el agujero junto a la escalera interior' } }));

  const LZ = new THREE.Group();
  const lum = (X, Y, h) => { const l = new THREE.PointLight(0xfff4e0, 10, 9, 2); l.position.set(X, h, -Y); LZ.add(l); LZ.add(en(P.caja(1.2, 0.06, 0.2, M.gabinete), X, Y, h + 0.03)); };
  for (const X of [23, 30, 37.5]) lum(X, -2.3, piso + s.h1 - 0.1);
  lum(44.2, -2.6, piso + s.h1 - 0.1); lum(40.5, -2.4, y2 + s.h2 - 0.1);
  LZ.userData.luces = true; reg(LZ, 'sala', null); ctx.luces = LZ;

  const PU = new THREE.Group();
  const hoja = (X, Y, ancho, alto, rotDeg, yBase = piso) => { const h = P.caja(ancho, alto, 0.05, M.puerta, ancho / 2, alto / 2, 0); const g = new THREE.Group(); g.add(h); g.position.set(X, yBase, -Y); g.rotation.y = (rotDeg * Math.PI) / 180; return g; };
  PU.add(hoja(38.5, s.y0, 1.05, 2.6, 90), hoja(40.65, s.y0, 1.05, 2.6, 90));
  PU.add(hoja(s.x0, 0.0, 0.9, 2.2, 0));
  PU.add(hoja(41.0, s.y1, 1.0, 2.1, -90, y2));
  PU.add(hoja(42.3, -3.9, 0.9, 2.2, 90), hoja(43.5, -1.25, 0.9, 2.2, 0));
  reg(PU, 'sala', null);
}

export function construirCables(ctx) {
  const { reg, L, F } = ctx; const b = L.b385; const s = L.sala; const piso = 0.12; const y2 = ctx.y2;
  const p3 = (X, Y, h) => V(X, h, -Y);
  const haz = (pts, n, r, mat, sep = 0.03, seg = 60) => { const g = new THREE.Group(); for (let k = 0; k < n; k++) { const dx = (k - (n - 1) / 2) * sep; g.add(P.tubo(pts.map((p) => V(p.x + dx, p.y + (k % 2) * sep * 0.6, p.z + ((k * 7) % 3) * sep * 0.4)), r, mat, seg)); } return g; };
  const mCtrl = new THREE.MeshStandardMaterial({ color: 0x2b2f33, roughness: 0.65 });
  const mFza = new THREE.MeshStandardMaterial({ color: 0x1f4fa3, roughness: 0.6 });
  const mCom = new THREE.MeshStandardMaterial({ color: 0xe0861f, roughness: 0.6 });
  const mTierra = M.tierraNueva;
  const yC1 = -0.3;
  const yG = b.yIn - 0.42;
  const rutaCtrl = [p3(40.6, yG, 1.6), p3(40.6, yG, 1.0), p3(40.55, yG - 0.35, -0.05), p3(40.5, 15.6, yC1), p3(43.3, 15.5, yC1), p3(43.85, 15.3, -0.35), p3(44.15, 14.4, -0.4), p3(44.15, 3.0, -0.4), p3(44.15, 1.3, -0.45), p3(43.6, 0.4, -0.5), p3(40.9, -0.2, -0.45), p3(40.3, -0.6, piso - 0.2), p3(39.6, -1.9, piso - 0.2), p3(36.7, -2.02, piso - 0.2), p3(36.7, -2.02, piso + 0.5)];
  const C = new THREE.Group();
  C.add(haz(rutaCtrl, 5, 0.009, mCtrl, 0.012, 90));
  C.add(haz([p3(40.8, yG, 1.6), p3(40.8, yG, 1.0), p3(40.75, yG - 0.35, -0.05), p3(40.7, 15.6, yC1 - 0.1), p3(43.3, 15.5, yC1 - 0.1), p3(43.9, 15.25, -0.45), p3(44.15, 14.3, -0.55), p3(44.15, 3.0, -0.55), p3(44.15, 1.3, -0.6), p3(43.6, 0.4, -0.62), p3(40.9, -0.2, -0.6), p3(40.3, -0.6, piso - 0.34), p3(39.6, -3.0, piso - 0.34), p3(36.7, -3.69, piso - 0.34), p3(36.7, -3.69, piso + 0.5)], 3, 0.01, mFza, 0.014, 90));
  reg(C, 'cables', { id: 'Cables de control', nombre: 'Cables de control y fuerza del IN-383 y del TP-385', estado: 'P',
    datos: { Control: 'N2XSY 0,6/1 kV 4×4 mm² (700 m) · 7×2,5 mm² (200 m) · 12×2,5 mm² (600 m) · apantallado 3×1,5 mm² (posición CBC)', Fuerza: 'N2XSY 2×4 mm² (100 m) · N2XOH 3×10 mm² (100 m)', Recorrido: 'Gabinete central del interruptor → 4 ductos PVC SAP Ø2" → canaleta C1 (0,70 × 0,70) → curva de bandeja → canaleta existente → sala de control → foso → tablero 18 (protección y control) y tablero 16 (SS.AA.); regulación al tablero 22 por bandeja', Soporte: 'En la sala, soporte metálico de 4 niveles: control trafo · control interruptor · fuerza AC/DC · comunicaciones (detalle D4)' }, planos: [] });
  const R = new THREE.Group();
  const rutaReg = [p3(36.7, -2.02, piso + 0.5), p3(36.7, -2.02, piso - 0.2), p3(39.0, -1.5, piso - 0.2), p3(40.0, -0.6, piso + 1.0), p3(40.0, -0.55, piso + 2.62), p3(40.6, -4.6, piso + 2.62), p3(40.6, -4.9, y2 + 0.5), p3(40.6, -4.9, y2 + 2.45), p3(38.6, -4.9, y2 + 2.45), p3(38.6, -4.75, y2 + 2.25), p3(38.6, -4.6, y2 + 2.05)];
  R.add(haz(rutaReg, 3, 0.009, mCtrl, 0.025, 110));
  reg(R, 'cables', { id: 'Señales al tablero 22', nombre: 'Cables de control del tablero 18 al tablero de regulación 22 (2.º piso)', estado: 'P', datos: { Cables: 'N2XSY 7×2,5 y 12×2,5 mm² (posición del OLTC, mando subir/bajar, tensión y corriente)', Recorrido: 'Foso → bandeja escalera 300×100 del 1.er piso → agujero junto a la escalera → bandeja 100×300 a pared → 3 conduits EMT Ø2" por la tapa superior del tablero 22' }, planos: [] });
  const CO = new THREE.Group();
  CO.add(haz([p3(36.7, -2.4, piso + 0.4), p3(36.7, -2.4, piso - 0.46), p3(39.0, -2.6, piso - 0.46), p3(39.6, -4.0, piso - 0.46), p3(36.5, -4.3, piso - 0.46), p3(33.8, -4.3, piso - 0.46), p3(31.65, -4.3, piso - 0.46), p3(31.65, -3.5, piso - 0.46), p3(31.65, -3.5, piso + 0.4)], 2, 0.006, mCom, 0.02, 80));
  reg(CO, 'cables', { id: 'Comunicaciones', nombre: 'Enlaces de comunicación del tablero 18 al SAS (7) y SCADA (2)', estado: 'P', datos: { Medio: 'Fibra óptica / IEC 61850 por la canaleta interior (nivel de comunicaciones)', Nota: 'Trazado referencial; los planos funcionales por tablero aún no están emitidos' }, planos: [], aprox: true });
  const MT = new THREE.Group();
  const rutaMT = [p3(37.1, 11.2, 1.0), p3(37.0, 10.5, 0.3), p3(38.3, 9.4, -0.3), p3(38.55, 8.0, -0.55), p3(38.55, 4.2, -0.55), p3(37.4, 3.95, -0.55), p3(36.2, 3.9, -0.55), p3(35.85, 3.4, -0.5), p3(35.8, 1.4, -0.5), p3(36.4, 1.0, -0.55), p3(38.5, 1.0, -0.55), p3(38.7, 0.3, -0.5), p3(39.0, -0.5, piso - 0.5), p3(39.4, -2.0, piso - 0.5), p3(40.5, -2.37, piso - 0.4), p3(41.1, -2.37, piso + 0.5)];
  for (let k = 0; k < 3; k++) { const d = (k - 1) * 0.07; MT.add(P.tubo(rutaMT.map((p) => V(p.x + d, p.y + Math.abs(d) * 0.4, p.z + (k === 1 ? 0.06 : 0))), 0.023, M.cableMT, 120)); }
  for (const Y of [7.5, 6.0, 4.5]) { MT.add(P.caja(0.26, 0.05, 0.08, M.negro, 38.55, -0.5, -Y)); MT.add(P.caja(0.3, 0.025, 0.04, M.acero, 38.55, -0.56, -Y)); }
  reg(MT, 'cables', Object.assign({}, F.CAB10, { datos: Object.assign({}, F.CAB10.datos, { Soportes: 'Rieles Unistrut con abrazaderas tipo trébol Ø38–51 mm cada 1,5 m (detalles D3–D5); conector PAT de 1 vía por soporte', Llegada: 'A la celda K03 por el compartimiento de cables, con terminaciones termocontraíbles 24 kV' }) }));
  const T = new THREE.Group();
  T.add(P.tubo([p3(36.7, -2.02, piso + 0.3), p3(36.7, -2.02, piso - 0.55), p3(38.9, -1.5, piso - 0.55), p3(39.6, -0.5, piso - 0.55), p3(39.6, 0.4, piso + 0.35)], 0.006, mTierra, 30));
  T.add(P.tubo([p3(41.0, -2.37, piso + 0.3), p3(40.3, -1.5, piso - 0.55), p3(39.7, -0.5, piso - 0.55), p3(39.65, 0.4, piso + 0.35)], 0.006, mTierra, 30));
  T.add(P.tubo([p3(38.6, -4.55, y2 + 0.3), p3(40.6, -4.9, y2 + 0.3), p3(40.6, -4.9, piso + 0.5), p3(40.0, -0.5, piso - 0.55), p3(39.55, 0.4, piso + 0.35)], 0.006, mTierra, 40));
  reg(T, 'tierra', { id: 'Tierra de tableros', nombre: 'Conductores de puesta a tierra de los tableros nuevos y la celda K03', estado: 'P', datos: { Conductor: 'Cu verde-amarillo 1×25 mm² (tableros) y 1×4 / 2,5 mm² (gabinetes)', Llegan: 'A la barra equipotencial 50×5×1 000 mm de la sala' }, planos: [] });
  const G = new THREE.Group(); const zG = -yG;
  const puerta = P.caja(0.78, 1.08, 0.02, M.gabinete, 0.39, 0, 0); const pg = new THREE.Group(); pg.add(puerta);
  pg.position.set(b.xIn[1] - 0.39, 2.45 - 0.75, zG + 0.26); pg.userData.puerta = { cerrada: 0, abierta: -1.9 }; G.add(pg);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 12; i++) G.add(P.caja(0.03, 0.05, 0.04, i % 4 === 3 ? M.rojo : M.gabinete, b.xIn[1] - 0.3 + i * 0.05, 2.45 - 0.45 - r * 0.28, zG + 0.1));
  for (let r = 0; r < 3; r++) G.add(P.caja(0.7, 0.02, 0.035, M.acero, b.xIn[1], 2.45 - 0.49 - r * 0.28, zG + 0.1));
  G.add(P.caja(0.12, 0.2, 0.05, M.negro, b.xIn[1] + 0.25, 2.45 - 0.3, zG + 0.1));
  reg(G, 'patio138', { id: 'Gabinete IN-383', nombre: 'Gabinete central de mando del interruptor IN-383', estado: 'E', cod: '=IN-383', obra: 'interv', obraTxt: 'Se reconectan en sus borneras (-X1) los cables reubicados durante las obras civiles: control y disparo desde los tableros 18 y 17, alimentación 110 Vcc y motor desde SS.AA.', lista: false, datos: { Contenido: 'Borneras de control, relés auxiliares, calefactor, interruptores termomagnéticos', Entrada: '4 ductos PVC SAP Ø2" por el fondo hasta la canaleta C1', Nota: 'Se abre con «Destapar»' }, planos: [] });
  ctx.puertas = [pg];
}
