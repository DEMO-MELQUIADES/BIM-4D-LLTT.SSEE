
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { M, crearMateriales, caja, cil, barra, barraGeo, angularGeo, fusion, V, aislador, aisladorGeo, vigaCelosia, columnaCelosia, catenaria, tubo, cadena, losa } from './lib.js';
export { M };


export const COTA0 = 4340.45;
const S1 = [260628.939, 8242542.564], UX = [0.53127288, -0.84720076], UY = [0.8472018, 0.53127122];
export const aUTM = (X, Y) => [S1[0] + X * UX[0] + Y * UY[0], S1[1] + X * UX[1] + Y * UY[1]];
export const p3 = (X, Y, h = 0) => new THREE.Vector3(X, h, -Y);
export const deP3 = (v) => ({ X: v.x, Y: -v.z, h: v.y });
export const ESPEJO = 67;
export const esp = (X) => ESPEJO - X;

export const NORTE = new THREE.Vector3(-0.8472, 0, -0.5313).normalize();
export function en(o, X, Y, h = 0, rotDeg = 0) { o.position.set(X, h, -Y); o.rotation.y = (rotDeg * Math.PI) / 180; return o; }

export const EJE = { 1: 0, 2: 8, 3: 22, 4: 36, 5: 50, 6: 67 };
export const FILA = { A: 0, B: 13.5, C: 29.5, D: 35.0, E: 56 };
const FASES = [['R', 4], ['S', 7], ['T', 10]];            
const BARRA_Y = { R: 17.5, S: 21.5, T: 25.5 };            
export const BAHIAS = [
  { k: 'b1', x0: 8, nombre: 'Bahía de transformador', dest: 'A transformador TP-390', tipo: 'trafo' },
  { k: 'b2', x0: 36, nombre: 'Bahía de línea L-2202', dest: 'Llegada L-2202 desde SE Río Claro', tipo: 'linea' },
  { k: 'b3', x0: 22, nombre: 'Bahía de línea L-2201', dest: 'Llegada L-2201 desde SE Río Claro', tipo: 'linea' },
];
export const T19 = { X: 59.09, Y: -22.26 };
export const AJUSTE_T19 = { z: null };
export const L_ANCLAJE = 2.5;

export const REG = [];
export const CAPAS = {};
export const ROT = [];
export const ETQ = [];   
export const HUECOS = [];
export const CTX = { puertas: [], tapas: [], subsuelo: [] };
export function reg(obj, capa, info) {
  obj.userData.capa = capa; if (info) obj.userData.info = info;
  REG.push({ obj, capa, info }); (CAPAS[capa] = CAPAS[capa] || []).push(obj);
  if (info) (info.objs = info.objs || []).push(obj);
  return obj;
}
export const NOMBRES_CAPA = {
  patio138: 'Patio 220 kV · equipos', portico: 'Pórtico 220 kV', barras: 'Barras y conductores', linea: 'Llegada de la LT (T19)',
  trafo: 'Transformador de potencia', mt10: 'Salas eléctricas y 10 kV', ssaa: 'Servicios auxiliares', obraCivil: 'Obra civil (bases, canaletas, vía)',
  tierra: 'Red de tierra', edif: 'Edificaciones', cerco: 'Cerco perimétrico', terreno: 'Terreno y explanación',
};
export const ORIGEN = { D: 'Dibujado desde planos', F: 'Plano de fabricante aprobado', R: 'Referencial' };
export const SISTEMAS = { at: '220 kV', mt: '10 kV', ssaa: 'Servicios auxiliares', ctrl: 'Control y protección', est: 'Estructuras', civ: 'Obra civil', lin: 'Línea de transmisión', ter: 'Terreno' };

export const PLANOS = {};
const P = (...k) => k.map((x) => PLANOS[x] || x);


const fi = (o) => ({ planos: [], datos: [], ...o });
export const F = {
  trafo: fi({ key: 'trafo', item: 1, nombre: 'Transformador de potencia trifásico 220/10 kV', origen: 'R', sistema: 'at',
    datos: [['Tensiones', '220 ± 2 / −14 × 1,25 % / 10 kV', ''], ['Potencia', '10 MVA ONAN · 12,5 MVA ONAF', ''],
      ['Grupo de conexión', 'YNd5', ''], ['Cantidad', '1', ''], ['Huella en planta', '6,48 × 3,65 m (con radiadores), centro X 51,90 · Y 35,38', ''],
      ['Bahía', 'Eje 4–5 «A transformador TP-390»', '']],
    planos: P('', '', ''),
    nota: 'Posición y huella según la ingeniería; la forma (tanque, radiadores, conservador, bushings) es referencial. El transformador de potencia está preparado para ser instalado en la SE Río Claro. La base tiene vía de rodadura hacia el este y el norte.' }),
  pr: fi({ key: 'pr', item: 2, nombre: 'Pararrayos de óxido metálico 220 kV', origen: 'D', sistema: 'at',
    datos: [['Ur / Uc', '198 kV / 156 kV', ''], ['Corriente nominal de descarga', '20 kA', ''],
      ['Cantidad', '9 (3 por bahía)', ''], ['Altura del equipo', '1,905 m', ''], ['Soporte', 'celosía de 3,20 m', '']],
    planos: P('', '', '', '', ''), nota: 'Silueta del pararrayos referencial (alto y soporte del plano).' }),
  tt: fi({ key: 'tt', item: 3, nombre: 'Transformador de tensión capacitivo 220 kV', origen: 'D', sistema: 'at',
    datos: [['Relación', '220/√3 / 0,1/√3 / 0,1/√3 / 0,1/√3 kV', ''], ['Devanados', '2 × 20 VA-3P; 1 × 20 VA-CL 0,2', ''],
      ['BIL', '1050 kVp', ''], ['Cantidad', '9 (3 por línea y 3 en barra)', ''], ['Peso / altura', '415 kg · 2,411 m', ''], ['Soporte', 'celosía 0,55 × 0,55 × 2,50 m', '']],
    planos: P('', '', '', '', '') }),
  sl: fi({ key: 'sl', item: 4, nombre: 'Seccionador de línea tripolar con cuchilla de puesta a tierra', origen: 'D', sistema: 'at',
    datos: [['In / Un', '1250 A · 245 kV', ''], ['Icc', '31,5 kA / 1 s', ''], ['BIL', '1050 kVp', ''],
      ['Cantidad', '2 (bahías de línea)', ''], ['Estructura', '2,50 m', ''], ['Base', '7,50 × 4,30 m', '']],
    planos: P('', '', ''), nota: 'Apertura central giratoria (3 columnas por polo) dibujada en posición cerrada; columnas y brazos referenciales.' }),
  tc: fi({ key: 'tc', item: 5, nombre: 'Transformador de corriente 220 kV', origen: 'D', sistema: 'at',
    datos: [['Relación', '400-200 / 1-1-1-1 A', ''], ['Núcleos', '1 × 20 VA-CL 0,2S; 3 × 20 VA-5P20', ''],
      ['BIL', '1050 kVp', ''], ['Cantidad', '6 (bahías de línea)', ''], ['Peso / altura', '370 kg · 2,648 m', ''], ['Soporte', 'celosía 0,55 × 0,55 × 3,20 m (L4×4×1/4")', '']],
    planos: P('', '', '', '', '') }),
  int: fi({ key: 'int', item: 6, nombre: 'Interruptor de potencia de mando unipolar 220 kV', origen: 'D', sistema: 'at',
    datos: [['In', '2000 A', ''], ['Un (placa del plano)', '245 kV', ''], ['Icc', '40 kA', ''],
      ['BIL', '1050 kVp', ''], ['Cantidad', '3 (uno por bahía, polos independientes)', ''], ['Altura', 'soporte 2,64 m · total 7,08 m', ''], ['Base por polo', '1,90 × 1,90 m', '']],
    planos: P('', '', ''), nota: 'Columna y cámara del polo referenciales; las alturas (2,64 m y 7,08 m) son las de la ingeniería.' }),
  sb: fi({ key: 'sb', item: 7, nombre: 'Seccionador de barra tripolar', origen: 'D', sistema: 'at',
    datos: [['In / Un', '1250 A · 245 kV', ''], ['Icc', '31,5 kA / 1 s', ''], ['BIL', '1050 kVp', ''],
      ['Cantidad', '3 (uno por bahía)', ''], ['Estructura / polo', '2,50 m + 1,99 m', ''], ['Base', '8,48 × 4,30 m', '']],
    planos: P('', '', '') }),
  as: fi({ key: 'as', item: 8, nombre: 'Aislador soporte 220 kV', origen: 'D', sistema: 'at',
    datos: [['Un / Icc', '245 kV · 31,5 kA / 1 s', ''], ['BIL', '1050 kVp', ''],
      ['Cantidad', '6 (bahía de transformador)', ''], ['Altura', '1,70 m sobre soporte de 3,20 m', '']],
    planos: P('', '', '', '', ''), nota: 'La sección A-A marca además el ítem 10 «aislador soporte, 31,5 kA/1 s, 450 kVp» (3 u.) junto a esta fila; su ubicación exacta queda por confirmar.' }),
  sala: fi({ key: 'sala', item: 9, nombre: 'Sala eléctrica prefabricada (shelter)', origen: 'F', sistema: 'mt',
    datos: [['Exterior', '12,00 × 3,00 m · 3,612 m desde la base a la cumbrera', ''], ['Interior', '2,80 m de ancho · 3,00 m de alto libre', ''],
      ['Cantidad', '2: Sala 2 (ER2, celdas 10 kV, este) y Sala 1 (ER1, tableros, oeste)', ''], ['Apoyo', '8 pilotes de 0,50 × 0,50 × 1,60 m por sala (16 bases BSE)', ''],
      ['Posición', 'Sala 2 X 20,66–32,66 · Sala 1 X 6,06–18,06 · Y 46,55–49,55', ''], ['ER2', '3 celdas 22 kV (futuro) + 7 celdas 10 kV de 1,225 m de fondo y 2,25 m de alto; cargador y baterías', ''],
      ['ER1', '10 tableros de 0,80 × 0,80 contra el muro norte; baterías y cargador', ''], ['Peso Sala 1 sin equipos', '18 348,5 kg', '']],
    planos: P('', '', '', '', ''), nota: 'Posición de las salas según la ingeniería vigente. Alto de puertas y equipos interiores sin cota: referenciales.' }),
  plataforma: fi({ key: 'plataforma', nombre: 'Plataforma de servicio y escaleras de las salas', origen: 'F', sistema: 'mt',
    datos: [['Plataforma', '2,60 × 4,00 m entre las salas · piso a 1,903 m', ''], ['Escaleras', '2 de 2,234 × 1,14 m (huella 1,025) hacia el oeste y el este', ''], ['Posición', 'X 18,06–20,66 · Y 45,05–49,05', '']], planos: P('', ''), nota: 'Barandas referenciales.' }),
  portico10: fi({ key: 'portico10', nombre: 'Pórtico de salidas 10 kV', origen: 'D', sistema: 'mt',
    datos: [['Columnas', '4 de celosía de 0,50 × 0,50 m · 9,00 m', ''], ['Vigas', '6 de celosía de 0,50 m: 4,75–5,25 m y 6,75–7,25 m', ''], ['Vanos', '3 de 4,50 m: MINA 3 (este), MINA 2, MINA 1 (oeste)', ''],
      ['Ejes', 'X 6,00 / 10,50 / 15,00 / 19,50 · Y 52,70', ''], ['Perfiles', 'L50×50×6, L40×40×4', '']], planos: P('', '', '', ''), nota: 'La leyenda dice «3 columnas, 6 vigas»; los dibujos muestran 4 columnas, que es lo modelado.' }),
  basePortico10: fi({ key: 'basePortico10', nombre: 'Base de pórtico 10 kV (BP2)', origen: 'D', sistema: 'civ', datos: [['Pedestal', '0,90 × 0,90 m · 0,20 m sobre la grava', ''], ['Zapata', '3,00 × 3,00 × 0,50 m + solado 0,10 m', ''], ['Cotas', 'tope 4 340,53 · fondo 4 338,23 m s.n.m.', ''], ['Pernos', 'Ø 1" × 0,80 m', '']], planos: P('') }),
  salida10: fi({ key: 'salida10', nombre: 'Salida 10 kV (MINA 1, 2 y 3)', origen: 'D', sistema: 'mt',
    datos: [['Por vano', '3 pararrayos 15 kV (viga superior) y 1 seccionador 24 kV de mando manual (viga inferior)', ''], ['Cable', 'N2XSOH 240 mm² desde las celdas por la canaleta C-4, sube en tubo Ø4" a terminales exteriores', ''],
      ['Salida aérea', 'amarre a 7,20 m; la conexión la hace la empresa de distribución', ''], ['Celdas', 'IN-131 Mina 1 · IN-132 Mina 2 · IN-133 Mina 3', '']], planos: P('', ''), nota: 'Silueta de pararrayos, seccionador y terminales referencial; el tramo aéreo se dibuja solo hasta 14 m del pórtico.' }),
  ductos: fi({ key: 'ductos', nombre: 'Ductos PVC SAP enterrados', origen: 'D', sistema: 'civ', datos: [['Bz-1 → Bz-2', '9 × Ø4"', ''], ['C-90 → SS.AA.', '6 × Ø4" (X 3,2–3,9)', ''], ['SS.AA. → Sala 1', '4 × Ø4" (X 5,3–5,6)', ''], ['A cada salida 10 kV', '3 × Ø4"', '']], planos: P(''), nota: 'Profundidad de los ductos referencial (0,70 m).' }),
  recintoSA: fi({ key: 'recintoSA', nombre: 'Recinto de servicios auxiliares', origen: 'D', sistema: 'ssaa', datos: [['Losa', '6,40 × 8,90 m (X 1,17–7,57 · Y 31,80–40,70)', ''], ['Cerco', '4,70 × 8,50 m en 2 celdas: trafo 3,00 m (norte) y grupo 5,50 m (sur), portones al este', ''], ['Alto del cerco', 'no indicado (2,40 m referencial)', '']],
    planos: P('', '', ''), nota: 'Recinto según la ingeniería vigente.' }),
  tierra: fi({ key: 'tierra', nombre: 'Red de tierra profunda', origen: 'D', sistema: 'civ',
    datos: [['Conductor', 'Cu desnudo 120 mm² en zanja de 0,30 × 0,80 m (mín.), a 0,70 m (mín.) bajo la plataforma', ''], ['Cuadrícula', '8 × 8 m (IEEE-80) · 65,0 × 53,0 m', ''],
      ['Pozos', '15 con caja de registro 0,4 × 0,4 × 0,5 m y varilla Cu 5/8" × 2,4 m', ''], ['Conexiones', '31 en cruz y 58 en T (soldadura exotérmica)', ''], ['Cruce de canaletas', 'profundizar a 1,50 m', '']],
    planos: P(''), nota: 'Ejes de la malla con las cotas del plano; la ubicación de los 15 pozos es aproximada (± 0,5 m). La red superficial de 70 mm² no está modelada.' }),
  caseta: fi({ key: 'caseta', nombre: 'Caseta de vigilancia y oficina', origen: 'D', sistema: 'civ', datos: [['Muros', 'X 50,00–54,35 · Y 50,00–54,90 · e = 0,15 m', ''], ['Vereda', '5,35 × 5,90 m', ''], ['Ambientes', 'caseta (NE), baño (NO), oficina (S)', ''], ['Vanos', '2 puertas al este (0,90 y ≈ 1,10) y 2 ventanas de 1,30', '']],
    planos: P(''), nota: 'Alturas referenciales.' }),
  almacen: fi({ key: 'almacen', nombre: 'Almacén general', origen: 'D', sistema: 'civ', datos: [['Huella', '11,426 × 4,575 m (X 0,98–5,55 · Y 0,57–12,00)', ''], ['Estructura', 'columnas de tubo galvanizado Ø3" sobre sobrecimiento de 0,45 m', ''], ['Cerramiento', 'malla metálica 2" × 2" Nº 10 en marcos L1"', ''],
      ['Techo', 'a un agua, plancha TR4 de 0,50 mm · 3,783 / 3,196 m', ''], ['Puertas', 'doble de malla 2,697 × 2,30 m al este y una al cuarto de materiales peligrosos (sur)', '']], planos: P('', ''), nota: 'No se pudo determinar en el plano qué lado es el alto del techo: se dibujó alto al este.' }),
  residuos: fi({ key: 'residuos', nombre: 'Almacén intermedio de residuos sólidos', origen: 'R', sistema: 'civ', datos: [['Huella', '1,32 × 7,29 m (X 65,54–66,86 · Y 45,53–52,82)', '']], planos: P('', ''), nota: 'Solo la huella está en el plano; estructura y alto referenciales.' }),
  cisterna: fi({ key: 'cisterna', nombre: 'Cisterna de agua 2800 L y caseta de bombeo', origen: 'D', sistema: 'civ', datos: [['Tanque', 'prefabricado enterrado, según fabricante', ''], ['Posición', 'centro (15,93 ; 48,07) · registro Ø1,19 m', ''], ['Caseta de bombeo', '1,00 × 1,00 m · 1,80 m + losa 0,10 m (hidroneumático)', '']], planos: P('', ''), nota: 'Dimensiones del tanque referenciales.' }),
  septico: fi({ key: 'septico', nombre: 'Sistema séptico', origen: 'D', sistema: 'civ', datos: [['Tanques', 'séptico Rotoplas 1300 L (22,61 ; 51,62) y recolector 1300 L (22,61 ; 46,22)', ''], ['Instalación', 'enterrados · Ø1,15 m · excavación 1,55 m · fondo a 2,08 m', '']], planos: P('', '') }),
  cerco: fi({ key: 'cerco', nombre: 'Cerco perimétrico prefabricado', origen: 'D', sistema: 'civ', datos: [['Tipo', 'columnas y placas de concreto prefabricado', ''], ['Columnas', '0,14 × 0,14 × 3,90 m, empotradas 0,70 m · cada 2,13 m', ''], ['Placas', '5 por paño de 2,05 × 0,50 × 0,04 m (2,50 m de alto)', ''],
      ['Remate', 'concertina Ø18" · altura nominal 3,00 m', ''], ['Perímetro', '67,00 × 56,00 m (límites S1–S4)', '']], planos: P('', ''), nota: 'El espesor de placa figura como 0,04 y 0,05 m en distintos planos.' }),
  porton: fi({ key: 'porton', nombre: 'Portón principal y puerta peatonal', origen: 'D', sistema: 'civ', datos: [['Portón', '5,00 m entre ejes · 2 hojas de 2,30 m (útil 4,60) × 2,45 m que abren hacia adentro', ''], ['Columnas', 'de concreto 0,40 × 0,40 m de 2,70 m', ''], ['Puerta peatonal', '1,00 m (1,30 entre columnas)', ''], ['Posición', 'cerco norte (fila E): portón X 58,30–63,30 · peatonal X 55,70–57,00', '']], planos: P('', '') }),
  trafoSA: fi({ key: 'trafoSA', item: 10, nombre: 'Transformador de distribución (servicios auxiliares)', origen: 'D', sistema: 'ssaa',
    datos: [['Potencia', '100 kVA', ''], ['Tensiones', '10 / 0,4 kV · Dyn5', ''], ['Cantidad', '1', ''],
      ['Tipo', 'seco encapsulado en resina, envolvente metálica IP-45 RAL 7035, sobre 4 ruedas', ''], ['Envolvente', '1,60 × 1,26 × 1,65 m · 1,819 m con ruedas', ''], ['Posición', 'X 3,00–4,26 · Y 38,19–39,79', '']],
    planos: P('', '', '') }),
  grupo: fi({ key: 'grupo', item: 11, nombre: 'Grupo electrógeno cabinado', origen: 'R', sistema: 'ssaa',
    datos: [['Potencia', '100 kVA · 380-220 V · 60 Hz', ''], ['Cantidad', '1', ''], ['Huella', '1,10 × 2,29 m (X 3,08–4,18 · Y 33,06–35,35)', ''],
      ['Base / contenedor de derrames', '1,40 × 2,70 m · 1,80 × 3,10 m', '']],
    planos: P('', '', ''), nota: 'Alto del grupo no indicado (1,55 m referencial). El grupo es solo para las cargas de la subestación.' }),
  tabTC: fi({ key: 'tabTC', item: 12, nombre: 'Tablero de agrupamiento de transformadores de corriente', origen: 'R', sistema: 'ctrl',
    datos: [['Cantidad', '2 (bahías de línea)', '']], planos: P(''), nota: 'Ubicación del plano; dimensiones del gabinete referenciales.' }),
  tabTT: fi({ key: 'tabTT', item: 13, nombre: 'Tablero de agrupamiento de transformadores de tensión', origen: 'R', sistema: 'ctrl',
    datos: [['Cantidad', '3 (2 de línea y 1 de barra)', '']], planos: P(''), nota: 'Ubicación del plano; dimensiones del gabinete referenciales.' }),
  armario: fi({ key: 'armario', item: 14, nombre: 'Armario de centralización de circuitos del interruptor', origen: 'R', sistema: 'ctrl',
    datos: [['Cantidad', '3 (uno por interruptor)', '']], planos: P('', ''), nota: 'Ubicación del plano (entre los polos S y T); dimensiones referenciales.' }),
  tabTransf: fi({ key: 'tabTransf', item: 15, nombre: 'Tablero de transferencia automática', origen: 'R', sistema: 'ssaa',
    datos: [['Características', '380-220 V · 400 A · 60 Hz', ''], ['Cantidad', '1', ''], ['Huella', '0,80 × 0,80 m (X 4,39–5,19 · Y 36,47–37,27)', '']], planos: P('', ''), nota: 'Alto no indicado (1,80 m referencial).' }),
  portico: fi({ key: 'portico', nombre: 'Pórtico 220 kV P-19 m', origen: 'F', sistema: 'est',
    datos: [['Fabricante', 'Fabricante Demo', ''], ['Columnas', '8 (C1, C2, C3) · 4 ejes × 2 filas', ''], ['Altura total', '19,00 m (castillete de cable de guarda)', ''],
      ['Separación', '14,00 m (frontal) · 16,00 m (lateral)', ''], ['Viga V1 (frontal)', 'de 15,50 a 16,50 m · luz libre 13,00 m', ''], ['Viga V2 (lateral)', 'de 11,50 a 12,50 m · luz libre 15,00 m', ''],
      ['Sección de columna', '1,00 × 1,00 m · plancha base con pernos a 1,718 m', ''], ['Acero', 'perfil A572 Gr. 50, planchas A36, galvanizado en caliente', '']],
    planos: P('', '', '', '', ''), nota: 'Columnas, vigas y castilletes con sus medidas; el despiece de la celosía (barras y diagonales) es simplificado.' }),
  barras: fi({ key: 'barras', nombre: 'Barras 220 kV (simple barra)', origen: 'D', sistema: 'at',
    datos: [['Conductor', 'ACAR 557 mm² (1100 MCM) · Ø 30,65 mm · 1,537 kg/m', ''], ['Carga de rotura', '10 204 kg', ''], ['Fases', 'R, S, T a 4, 8 y 12 m de la fila B (Y = 17,5 / 21,5 / 25,5 m)', ''],
      ['Altura', '≈ 12,3 m, tendidas entre las vigas V2 de los ejes 2 a 5', ''], ['Templado', '1 % de la carga de rotura', '']],
    planos: P('', '', ''), nota: 'Flechas y puentes alrededor de las columnas dibujados como en las secciones; los herrajes y conectores son referenciales.' }),
  conductores: fi({ key: 'conductores', nombre: 'Conductores de bahía y bajadas', origen: 'D', sistema: 'at',
    datos: [['Conductor', 'ACAR 557 mm²', ''], ['Tendido de bahía', 'entre vigas V1 a 16,0 m (fila B ↔ fila C)', ''], ['Fases de bahía', 'R, S, T a 4, 7 y 10 m del eje', '']],
    planos: P('', ''), nota: 'Recorridos de las bajadas y conexiones entre equipos según las secciones A-A y B-B; las curvas son referenciales.' }),
  guarda: fi({ key: 'guarda', nombre: 'Cable de guarda EHS 40 mm²', origen: 'D', sistema: 'est',
    datos: [['Cable', 'EHS 40 mm²', ''], ['Altura', '19,00 m (castilletes del pórtico)', '']], planos: P('', '', '') }),
  linea: fi({ key: 'linea', nombre: 'Llegada de la LT 220 kV (circuitos L-2202 y L-2201)', origen: 'D', sistema: 'lin',
    datos: [['Conductor', 'AAAC 253 mm²', ''], ['Amarre en el pórtico', '16,00 m (viga V1 sur, fila B)', ''], ['Torre T19 → pórtico', '50,69 m (distancia horizontal en la sección)', ''],
      ['Amarres en T19', 'S a 16,30 m, T y R encima (≈ 5,4 m entre fases)', ''], ['Circuitos', 'L-2202 → bahía eje 2–3 · L-2201 → bahía eje 3–4', '']],
    planos: P('', '', 'LT'), nota: 'La posición de la T19 sale del tablero de la LT; su cota de terreno es la de la superficie de diseño.' }),
  t23: fi({ key: 't23', nombre: 'Torre T19 (terminal de la LT)', origen: 'R', sistema: 'lin',
    datos: [['Ubicación', 'UTM 260 641,47 E · 8 242 480,68 N (WGS-84 19S)', ''], ['Cota en el tablero de la LT', '4 344,2 m s.n.m.', ''], ['Altura de amarres', 'fase más baja 16,30 m', '']],
    planos: P('LT', ''), nota: 'Torre dibujada como silueta referencial: su modelo detallado está en el tablero de la LT. Las salidas van a la T19 junto a la esquina A-6.' }),
  basePortico: fi({ key: 'basePortico', nombre: 'Base de pórtico 220 kV (BP1)', origen: 'D', sistema: 'civ', datos: [['Cantidad', '8', ''], ['Huella', '3,21 × 3,19 m', '']], planos: P('', '') }),
  baseEq: fi({ key: 'baseEq', nombre: 'Bases de equipos 220 kV', origen: 'D', sistema: 'civ',
    datos: [['Interruptor (BIP)', '9 polos · 1,90 × 1,90 m', ''], ['Seccionador de barra (BSB)', '3 · 8,48 × 4,30 m', ''], ['Seccionador de línea (BSL)', '2 · 7,50 × 4,30 m', ''],
      ['Transformador de corriente (BTC)', '6 · 2,10 × 2,10 m', ''], ['Transformador de tensión (BTT)', '9 · 1,80 × 1,80 m', ''], ['Pararrayos (BPR)', '9 · 1,60 × 1,60 m', ''], ['Aislador soporte (BAS)', '6 · 1,60 × 1,60 m', '']],
    planos: P('', ''), nota: 'Huellas del plano. Pedestal y zapata con sus medidas cuando el plano las trae; las bases de interruptor y seccionadores son referenciales.' }),
  baseTrafo: fi({ key: 'baseTrafo', nombre: 'Base del transformador de potencia (BTP) y vía de rodadura', origen: 'D', sistema: 'civ',
    datos: [['Base', '≈ 6,1 × 4,6 m con poza', ''], ['Vía de rodadura', 'rieles a 1,5 m hacia el este (fila D) y hacia el norte', '']], planos: P(''),
    nota: 'Medidas tomadas del dibujo en planta; altura y profundidad referenciales.' }),
  canaleta: fi({ key: 'canaleta', nombre: 'Canaletas de cables', origen: 'D', sistema: 'civ',
    datos: [['Tipos', 'C1 0,70 × 0,70 · C2 0,50 × 0,60 · C3 0,30 × 0,30 m', ''], ['Canaleta troncal C1', 'E-O a lo largo de la fila C (Y ≈ 31,9 m), del eje 5 a la sala', ''],
      ['Ramales C2 / C3', 'en cada bahía, frente a TT, TC e interruptores', ''], ['Tramo a salas', 'N-S de 0,70 m en X 18,75–19,45', ''],
      ['Media tensión', 'C-90×110 al norte de las salas (X 3,0–31,7) · C-80×110 bajo la Sala 2 · C-70×70 bajo la plataforma', '']], planos: P('', ''),
    nota: 'Trazos, tipos y medidas del plano. Las ménsulas y tapas son referenciales.' }),
  buzon: fi({ key: 'buzon', nombre: 'Buzones de cables de media tensión (Bz)', origen: 'D', sistema: 'civ',
    datos: [['Cantidad en la leyenda', '6 (Bz-1 … 6)', ''], ['Huella', '2,52 × 2,52 m', ''], ['Ducto', '3 ductos de concreto de 4 vías entre Bz-1 y Bz-2', '']], planos: P('') }),
  via: fi({ key: 'via', nombre: 'Vía de acceso interno', origen: 'D', sistema: 'civ', datos: [['Ancho', '4,00 m (anillo alrededor del patio)', ''], ['Sardinel', '0,15 m', '']], planos: P('', '') }),
  grava: fi({ key: 'grava', nombre: 'Patio de llaves (acabado de grava)', origen: 'R', sistema: 'civ', datos: [['Área de la SE', '67,00 × 56,00 m', ''], ['Pendiente de drenaje', '0,5 %', '']], planos: P('', ''), nota: 'El patio se muestra horizontal a la cota 4 340,45 m (las cotas de los vértices van de 4 340,12 a 4 340,77 m).' }),
  drenaje: fi({ key: 'drenaje', nombre: 'Canaleta de drenaje pluvial', origen: 'D', sistema: 'civ', datos: [['Ubicación', 'exterior al cerco, lados A, eje 6 y E', '']], planos: P('') }),
  terreno: fi({ key: 'terreno', nombre: 'Terreno y explanación', origen: 'D', sistema: 'ter',
    datos: [['Plataforma', '71,16 × 59,16 m (P1–P4)', ''], ['Cotas de la plataforma', '4 340,10 a 4 340,79 m s.n.m.', ''], ['Superficie', 'curvas de la superficie de diseño cada 1 m', '']],
    planos: P('', '', '') }),
};

const _up = new THREE.Vector3(0, 1, 0);
function marca(o, sombra = true) { o.traverse((m) => { if (m.isMesh) { m.castShadow = sombra; m.receiveShadow = true; } }); return o; }

function columnaPortico({ b0 = 1.62, b1 = 1.0, hT = 11.5, hC = 16.5, punta = 2.5, panel = 1.0, ala = 0.1, diag = 0.05 }) {
  const geos = [];
  const half = (y) => (y <= hT ? b0 / 2 + (b1 / 2 - b0 / 2) * (y / hT) : b1 / 2);
  const esq = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  const pt = (k, y) => V(esq[k][0] * half(y), y, esq[k][1] * half(y));
  const niveles = [];
  for (let y = 0; y < hT - 0.01; y += hT / Math.round(hT / panel)) niveles.push(y);
  for (let y = hT; y < hC - 0.01; y += (hC - hT) / Math.round((hC - hT) / panel)) niveles.push(y);
  niveles.push(hC);
  for (let k = 0; k < 4; k++) for (let i = 0; i + 1 < niveles.length; i++) geos.push(angularGeo(pt(k, niveles[i]), pt(k, niveles[i + 1]), ala, 0.009));
  for (let i = 0; i + 1 < niveles.length; i++) {
    const y0 = niveles[i], y1 = niveles[i + 1];
    for (let k = 0; k < 4; k++) {
      const k2 = (k + 1) % 4;
      geos.push(barraGeo(pt(k, y0), pt(k2, y1), diag / 2));
      geos.push(barraGeo(pt(k2, y0), pt(k, y1), diag / 2));
      geos.push(barraGeo(pt(k, y1), pt(k2, y1), diag / 2));
    }
  }
  for (let k = 0; k < 4; k++) geos.push(angularGeo(pt(k, hC), V(0, hC + punta, 0), ala * 0.8, 0.008));
  for (let i = 1; i < 3; i++) {
    const f = 1 - i / 3, y = hC + punta * (i / 3);
    for (let k = 0; k < 4; k++) { const a = pt(k, hC), b = pt((k + 1) % 4, hC); geos.push(barraGeo(V(a.x * f, y, a.z * f), V(b.x * f, y, b.z * f), diag / 2)); }
  }
  geos.push(new THREE.CylinderGeometry(0.035, 0.035, 0.4, 8).translate(0, hC + punta + 0.2, 0));
  geos.push(new THREE.BoxGeometry(b0 + 0.25, 0.04, b0 + 0.25).translate(0, 0.02, 0));
  return mergeGeometries(geos);
}

const _cacheSop = new Map();
function soporteGeo(h, a) {
  const k = h + '|' + a; if (_cacheSop.has(k)) return _cacheSop.get(k);
  const g = columnaCelosia(a, a, h - 0.02, Math.min(0.6, h / 5), 0.07, 0.035, 0);
  const geo = mergeGeometries([g, new THREE.BoxGeometry(a + 0.1, 0.02, a + 0.1).translate(0, h - 0.01, 0), new THREE.BoxGeometry(a + 0.1, 0.02, a + 0.1).translate(0, 0.01, 0)]);
  _cacheSop.set(k, geo); return geo;
}
function soporte(h, a) { const m = new THREE.Mesh(soporteGeo(h, a), M.acero); m.castShadow = true; m.receiveShadow = true; return m; }


function dado(w, d, hSob = 0.2, zap = null, hPed = 1.1, hZap = 0.4) {
  const g = new THREE.Group();
  g.add(caja(w, hSob + 0.12, d, M.concretoNuevo, 0, (hSob - 0.12) / 2, 0));
  const enterrado = (o) => { o.userData.subsuelo = true; CTX.subsuelo.push(o); g.add(o); return o; };
  enterrado(caja(w, hPed - 0.12, d, M.concreto, 0, -0.12 - (hPed - 0.12) / 2, 0));
  if (zap) { enterrado(caja(zap[0], hZap, zap[1], M.concreto, 0, -hPed - hZap / 2, 0)); enterrado(caja(zap[0] + 0.1, 0.1, zap[1] + 0.1, M.excav, 0, -hPed - hZap - 0.05, 0)); }
  return g;
}

const H_SOP = 0.20; 
function pararrayosEq() {
  const g = new THREE.Group();
  g.add(soporte(3.2, 0.41)); 
  const y0 = 3.2;
  g.add(cil(0.14, 0.14, 0.06, M.acero, 14, 0, y0 + 0.03, 0));
  const a = aislador(1.62, M.polimero, 0.07, 0.15, 0.045, false); a.position.y = y0 + 0.06; g.add(a);
  const t = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.02, 8, 30), M.aluminio); t.rotation.x = Math.PI / 2; t.position.y = y0 + 1.72; g.add(t);
  for (let k = 0; k < 3; k++) g.add(barra(V(0, y0 + 1.8, 0), V(0.3 * Math.cos(k * 2.094), y0 + 1.72, 0.3 * Math.sin(k * 2.094)), 0.01, M.aluminio));
  g.add(cil(0.06, 0.06, 0.12, M.aluminio, 10, 0, y0 + 1.845, 0));
  g.add(caja(0.14, 0.18, 0.08, M.gabinete, 0, 1.55, 0.3));
  g.add(barra(V(0, y0, 0.2), V(0, 1.64, 0.3), 0.008, M.cobre, true));
  g.userData.term = 3.2 + 1.905;
  return marca(g);
}
function ttEq() {
  const g = new THREE.Group();
  g.add(soporte(2.5, 0.55)); 
  const y0 = 2.5;
  g.add(caja(0.62, 0.55, 0.62, M.pintura, 0, y0 + 0.275, 0));
  g.add(caja(0.36, 0.3, 0.14, M.gabinete, 0, y0 + 0.25, 0.38));
  const a = aislador(1.65, M.aisladorGris, 0.12, 0.21, 0.055); a.position.y = y0 + 0.55; g.add(a);
  g.add(cil(0.17, 0.2, 0.17, M.aluminio, 18, 0, y0 + 2.3, 0));
  g.add(cil(0.04, 0.04, 0.1, M.aluminio, 8, 0, y0 + 2.44, 0));
  g.userData.term = 2.5 + 2.411;
  return marca(g);
}
function tcEq() {
  const g = new THREE.Group();
  g.add(soporte(3.2, 0.55)); 
  const y0 = 3.2;
  g.add(caja(0.56, 0.42, 0.56, M.pintura, 0, y0 + 0.21, 0));
  g.add(caja(0.34, 0.26, 0.12, M.gabinete, 0, y0 + 0.2, 0.34));
  const a = aislador(1.62, M.aisladorGris, 0.12, 0.2, 0.055); a.position.y = y0 + 0.42; g.add(a);
  const cab = cil(0.3, 0.3, 0.62, M.aluminio, 22, 0, y0 + 2.3, 0); cab.rotation.x = Math.PI / 2; g.add(cab);
  g.add(cil(0.05, 0.05, 0.14, M.aluminio, 8, 0, y0 + 2.6, 0));
  g.userData.term = 3.2 + 2.648;
  return marca(g);
}
function aisladorSop() {
  const g = new THREE.Group();
  g.add(soporte(3.2, 0.41)); 
  const a = aislador(1.62, M.aisladorGris, 0.085, 0.17, 0.055); a.position.y = 3.2; g.add(a);
  g.add(caja(0.22, 0.05, 0.3, M.aluminio, 0, 3.2 + 1.675, 0));
  g.userData.term = 3.2 + 1.7;
  return marca(g);
}

function poloInterruptor() {
  const g = new THREE.Group();
  g.add(caja(0.34, 2.6, 0.34, M.acero, 0, 1.3, 0));
  for (const s of [-1, 1]) g.add(barra(V(s * 0.6, 0.02, 0), V(s * 0.12, 1.5, 0), 0.03, M.acero));
  g.add(caja(1.3, 0.04, 0.5, M.acero, 0, 0.02, 0));
  g.add(caja(0.62, 0.82, 0.42, M.gabinete, 0, 1.55, 0.36));
  g.add(caja(0.6, 0.14, 0.6, M.acero, 0, 2.64 - 0.07, 0));
  const yb = 2.64;
  g.add(cil(0.2, 0.2, 0.28, M.aluminio, 18, 0, yb + 0.14, 0));
  const a1 = aislador(2.1, M.aisladorGris, 0.13, 0.24, 0.055); a1.position.y = yb + 0.28; g.add(a1);
  g.add(cil(0.23, 0.23, 0.32, M.aluminio, 18, 0, yb + 2.54, 0));
  const a2 = aislador(1.36, M.aisladorGris, 0.15, 0.25, 0.05); a2.position.y = yb + 2.7; g.add(a2);
  g.add(cil(0.22, 0.22, 0.34, M.aluminio, 18, 0, yb + 4.27, 0));
  g.add(caja(0.16, 0.04, 0.34, M.aluminio, 0, yb + 4.38, 0.25)); g.add(caja(0.16, 0.04, 0.34, M.aluminio, 0, yb + 2.54, 0.25));
  g.userData.tSup = yb + 4.44; g.userData.tInf = yb + 2.54;
  return marca(g);
}
function seccionador({ pat = false, largo = 2.5 }) {
  const g = new THREE.Group(); const h = 2.5;
  const L = 7.0;
  for (const x of [-3.55, 3.55]) { const c = new THREE.Mesh(soporteGeo(h - 0.4, 0.5), M.acero); c.position.x = x; c.castShadow = true; g.add(c); }
  const v = new THREE.Mesh(vigaCelosia(L + 0.6, 0.4, 0.45, 0.6), M.acero); v.position.y = h - 0.2; v.castShadow = true; g.add(v);
  for (const [, dx] of FASES) {
    const x = dx - 7; const f = new THREE.Group(); f.position.set(x, h, 0);
    f.add(caja(0.24, 0.16, largo + 0.3, M.acero, 0, 0.08, 0));
    for (const zz of [-largo / 2, 0, largo / 2]) {
      f.add(cil(0.13, 0.13, 0.14, M.aluminio, 12, 0, 0.23, zz));
      const a = aislador(1.55, M.aisladorGris, 0.085, 0.17, 0.058); a.position.set(0, 0.3, zz); f.add(a);
      f.add(caja(0.18, 0.12, 0.18, M.aluminio, 0, 1.91, zz));
    }
    f.add(caja(0.08, 0.07, largo + 0.1, M.aluminio, 0, 1.99, 0));
    if (pat) { const c = caja(0.05, 1.5, 0.05, M.acero, 0.28, 1.0, largo / 2 + 0.25); c.rotation.x = 0.2; f.add(c); f.add(caja(0.12, 0.1, 0.12, M.acero, 0.28, 0.25, largo / 2 + 0.2)); }
    g.add(f);
  }
  g.add(caja(2 * 3 + 0.2, 0.05, 0.05, M.acero, 0, h + 0.16, -0.32));
  g.add(cil(0.025, 0.025, h - 1.3, M.acero, 8, 3.2, (h - 1.3) / 2 + 1.3, 0.3));
  g.add(caja(0.55, 0.72, 0.38, M.gabinete, 3.2, 1.05, 0.45));
  if (pat) g.add(caja(0.5, 0.65, 0.34, M.gabinete, -3.2, 1.0, 0.45));
  g.userData.term = h + 1.99;
  return marca(g);
}
function gabinete(w = 0.8, h = 1.4, d = 0.45) {
  const g = new THREE.Group();
  g.add(caja(w + 0.1, 0.3, d + 0.1, M.concretoNuevo, 0, 0.0, 0));
  g.add(caja(w, h, d, M.gabinete, 0, 0.15 + h / 2, 0));
  g.add(caja(w + 0.08, 0.05, d + 0.12, M.pintura, 0, 0.15 + h + 0.025, 0));
  g.add(caja(0.03, 0.18, 0.03, M.aceroOsc, w * 0.36, 0.15 + h * 0.55, d / 2 + 0.02));
  return marca(g);
}

function transformador() {
  const g = new THREE.Group(); const pint = M.pintura;
  const L = 4.3, W = 2.1, H = 2.55, yb = 0.35;
  g.add(caja(L * 0.9, 0.3, W * 0.85, M.aceroOsc, 0, 0.2, 0));
  g.add(caja(L, H, W, pint, 0, yb + H / 2, 0));
  for (let i = 0; i <= 5; i++) g.add(caja(0.09, H * 0.9, W + 0.08, pint, -L / 2 + 0.25 + (i * (L - 0.5)) / 5, yb + H / 2, 0));
  g.add(caja(L + 0.14, 0.12, W + 0.14, pint, 0, yb + H, 0));
  const nR = 6, prof = 0.95, hR = H * 0.82;
  for (let i = 0; i < nR; i++) {
    const x = -L / 2 + 0.35 + (i * (L - 0.7)) / (nR - 1);
    const geos = [];
    for (let k = 0; k < 9; k++) geos.push(new THREE.BoxGeometry(0.012, hR, prof).translate(-0.19 + k * 0.048, 0, 0));
    geos.push(new THREE.BoxGeometry(0.48, 0.08, 0.1).translate(0, hR / 2, prof / 2 - 0.1), new THREE.BoxGeometry(0.48, 0.08, 0.1).translate(0, -hR / 2, prof / 2 - 0.1));
    const b = fusion(geos, pint); b.position.set(x, yb + H * 0.5, -(W / 2 + 0.2 + prof / 2)); g.add(b);
    g.add(cil(0.06, 0.06, 0.3, pint, 8, x, yb + H * 0.5 + hR / 2, -(W / 2 + 0.12)).rotateX(Math.PI / 2));
  }
  const cons = cil(0.36, 0.36, L * 0.62, pint, 22, -L * 0.12, yb + H + 0.95, W * 0.1); cons.rotation.z = Math.PI / 2; g.add(cons);
  for (const x of [-L * 0.35, L * 0.1]) g.add(caja(0.1, 0.95, 0.1, pint, x, yb + H + 0.45, W * 0.1));
  for (let i = -1; i <= 1; i++) {
    const b = new THREE.Group(); b.add(cil(0.2, 0.24, 0.3, pint, 16, 0, 0.15, 0));
    const a = aislador(1.55, M.aisladorGris, 0.09, 0.18, 0.055); a.position.y = 0.3; b.add(a);
    b.add(cil(0.07, 0.05, 0.2, M.aluminio, 10, 0, 1.95, 0));
    b.position.set(i * 1.2, yb + H, W * 0.32); b.rotation.x = 0.12; g.add(b);
  }
  const n = aislador(0.55, M.aisladorGris, 0.05, 0.1, 0.05); n.position.set(L * 0.38, yb + H, W * 0.3); g.add(n);
  g.add(caja(0.7, 1.4, 1.5, pint, L / 2 + 0.4, yb + H * 0.5, 0));
  g.add(caja(0.8, 1.5, 0.45, M.gabinete, -L * 0.3, yb + 0.95, W / 2 + 0.3));
  g.add(caja(0.45, 0.3, 0.02, M.aluminio, L * 0.15, yb + H * 0.62, W / 2 + 0.01));
  g.userData.tAT = yb + H + 2.0; g.userData.dzAT = W * 0.32 + 0.24;
  return marca(g);
}

const RCOND = 0.0153;
function curva(pts, r = RCOND, mat = M.aluminio, seg = 48) { return tubo(pts, r, mat, seg); }
function bajada(a, b, c = 0.6, r = RCOND) {
  const m = a.clone().lerp(b, 0.5); m.y -= c;
  const q1 = a.clone().lerp(m, 0.55); q1.y = Math.min(q1.y, a.y - c * 0.15);
  return tubo([a, q1, m, b], r, M.aluminio, 32);
}
function amarre(grp, a, dir, L = 1.9) {
  const b = a.clone().addScaledVector(dir.clone().normalize(), L);
  grp.add(cadena(a, b, M.aisladorGris)); return b;
}

export async function construir(escena, avisar = () => {}) {
  crearMateriales();
  M.prefab = new THREE.MeshStandardMaterial({ color: 0xcfcac0, roughness: 0.9 });
  M.shelter = new THREE.MeshStandardMaterial({ color: 0xdfe3e6, roughness: 0.55, metalness: 0.2 });
  M.techoZ = new THREE.MeshStandardMaterial({ color: 0x9aa5ad, roughness: 0.5, metalness: 0.5, side: THREE.DoubleSide });
  M.riel = new THREE.MeshStandardMaterial({ color: 0x5a5f63, roughness: 0.5, metalness: 0.7 });
  M.fantasma = new THREE.MeshStandardMaterial({ color: 0x9aa3ab, roughness: 0.7, metalness: 0.3, transparent: true, opacity: 0.55 });
  M.lineaAAAC = new THREE.MeshStandardMaterial({ color: 0xc9ced3, metalness: 0.8, roughness: 0.35 });
  avisar('Terreno…');
  const terreno = await terrenoYPatio(escena);
  const pat = new THREE.Group(); pat.name = 'patio (espejo)'; pat.scale.x = -1; pat.position.x = ESPEJO; escena.add(pat);
  const r0 = ROT.length, e0 = ETQ.length, h0 = HUECOS.length;
  avisar('Pórtico 220 kV…');
  portico(pat);
  avisar('Equipos 220 kV…');
  equipos(pat);
  avisar('Barras y conductores…');
  conductores(pat);
  avisar('Obra civil…');
  obraCivil(pat);
  avisar('Salas eléctricas y servicios auxiliares…');
  salasYMT(pat);
  edificaciones(pat);
  cercoPerimetrico(pat);
  redTierra(pat);
  for (let i = r0; i < ROT.length; i++) ROT[i].X = esp(ROT[i].X);
  for (let i = e0; i < ETQ.length; i++) ETQ[i].X = esp(ETQ[i].X);
  for (let i = h0; i < HUECOS.length; i++) { const [a, b, c, d] = HUECOS[i]; HUECOS[i] = [esp(c), b, esp(a), d]; }
  avisar('Llegada de la línea…');
  llegadaLinea(escena);
  return { terreno };
}


export let TER = null;
export function alturaTerreno(X, Y) {
  if (!TER) return 0;
  const { x0, y0, dx, nx, ny, h } = TER;
  const i = Math.max(0, Math.min(nx - 1.001, (X - x0) / dx)), j = Math.max(0, Math.min(ny - 1.001, (Y - y0) / dx));
  const i0 = Math.floor(i), j0 = Math.floor(j), fi_ = i - i0, fj = j - j0, k = j0 * nx + i0;
  return (h[k] * (1 - fi_) * (1 - fj) + h[k + 1] * fi_ * (1 - fj) + h[k + nx] * (1 - fi_) * fj + h[k + nx + 1] * fi_ * fj) / 100;
}
async function terrenoYPatio(escena) {
  const rt = await fetch(new URL('terreno.json', import.meta.url)); if (!rt.ok) throw new Error('terreno.json HTTP ' + rt.status); const d = await rt.json();
  TER = { x0: d.x0, y0: d.y0, dx: d.dx, nx: d.nx, ny: d.ny, h: Int16Array.from(d.h_cm) };
  const { x0, y0, dx, nx, ny } = TER;
  const pos = new Float32Array(nx * ny * 3), uv = new Float32Array(nx * ny * 2), col = new Float32Array(nx * ny * 3);
  const cBase = new THREE.Color(0x8f8a60), cTalud = new THREE.Color(0x9b8a6c), cPlat = new THREE.Color(0xa49a86);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const k = j * nx + i, X = x0 + i * dx, Y = y0 + j * dx, h = TER.h[k] / 100;
    pos.set([X, h - 0.02, -Y], k * 3); uv.set([X / 6, Y / 6], k * 2);
    const hx = TER.h[Math.min(k + 1, j * nx + nx - 1)] / 100 - h, hy = TER.h[Math.min(k + nx, nx * ny - 1)] / 100 - h;
    const pend = Math.min(1, Math.hypot(hx, hy) / dx / 0.6);
    const c = Math.abs(h) < 0.02 ? cPlat : cBase.clone().lerp(cTalud, pend);
    col.set([c.r, c.g, c.b], k * 3);
  }
  const idx = [];
  for (let j = 0; j + 1 < ny; j++) for (let i = 0; i + 1 < nx; i++) { const a = j * nx + i, b = a + 1, c = a + nx, e = c + 1; idx.push(a, b, c, b, e, c); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
  const mat = M.terreno.clone(); mat.vertexColors = true; mat.color.set(0xffffff);
  conHuecos(mat);
  const terreno = new THREE.Mesh(g, mat); terreno.receiveShadow = true;
  escena.add(reg(terreno, 'terreno', F.terreno));
  const grava = M.grava.clone(); grava.map = grava.map.clone(); grava.map.repeat.set(1, 1); grava.map.needsUpdate = true;
  const pg = new THREE.PlaneGeometry(67, 56, 1, 1); pg.rotateX(-Math.PI / 2); pg.translate(33.5, 0.005, -28);
  const uvp = pg.attributes.uv; for (let k = 0; k < uvp.count; k++) uvp.setXY(k, uvp.getX(k) * 67 / 3, uvp.getY(k) * 56 / 3);
  grava.polygonOffset = true; grava.polygonOffsetFactor = -1; grava.polygonOffsetUnits = -1; conHuecos(grava);
  const patio = new THREE.Mesh(pg, grava); patio.receiveShadow = true;
  escena.add(reg(patio, 'obraCivil', F.grava));
  ROT.push({ texto: 'SE Cerro Azul · patio 4 340,45 m s.n.m.', X: 33.5, Y: 58, h: 3.6, capa: 'terreno', lejos: true });
  return terreno;
}
function conHuecos(mat) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uHuecos = { value: HUECOS_TEX }; sh.uniforms.uN = { value: Math.min(64, HUECOS.length) }; mat.userData.sh = sh;
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vMundo;').replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvMundo = (modelMatrix * vec4(transformed,1.0)).xyz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vMundo;\nuniform vec4 uHuecos[64];\nuniform int uN;')
      .replace('#include <clipping_planes_fragment>', `#include <clipping_planes_fragment>
      for (int i = 0; i < 64; i++) { if (i >= uN) break; vec4 r = uHuecos[i]; if (vMundo.x > r.x && vMundo.x < r.z && -vMundo.z > r.y && -vMundo.z < r.w) discard; }`);
  };
}
const HUECOS_TEX = Array.from({ length: 64 }, () => new THREE.Vector4());
export function actualizarHuecos(escena) {
  const n = Math.min(64, HUECOS.length);
  for (let i = 0; i < n; i++) HUECOS_TEX[i].set(...HUECOS[i]);
  escena.traverse((o) => { const sh = o.material && o.material.userData && o.material.userData.sh; if (sh) sh.uniforms.uN.value = n; });
  return n;
}


const COL_X = [8, 22, 36, 50], COL_Y = [13.5, 29.5];
const H_V1 = [15.5, 16.5], H_V2 = [11.5, 12.5], H_PUNTA = 19.0;
function portico(escena) {
  const geoCol = columnaPortico({});
  const grp = new THREE.Group();
  for (const x of COL_X) for (const y of COL_Y) {
    const c = new THREE.Mesh(geoCol, M.acero); en(c, x, y, H_SOP); c.castShadow = true; c.receiveShadow = true; grp.add(c);
  }
  const v1 = vigaCelosia(13.0, 1.0, 1.0, 1.0);
  for (const y of COL_Y) for (let i = 0; i < 3; i++) {
    const m = new THREE.Mesh(v1, M.acero); en(m, (COL_X[i] + COL_X[i + 1]) / 2, y, H_SOP + (H_V1[0] + H_V1[1]) / 2); m.castShadow = true; grp.add(m);
  }
  const v2 = vigaCelosia(15.0, 1.0, 1.0, 1.0);
  for (const x of COL_X) { const m = new THREE.Mesh(v2, M.acero); en(m, x, (COL_Y[0] + COL_Y[1]) / 2, H_SOP + (H_V2[0] + H_V2[1]) / 2, 90); m.castShadow = true; grp.add(m); }
  escena.add(reg(grp, 'portico', F.portico));
  
  const cg = new THREE.Group();
  const top = (x, y) => p3(x, y, H_SOP + H_PUNTA - 0.05);
  for (const y of COL_Y) for (let i = 0; i < 3; i++) cg.add(catenaria(top(COL_X[i], y), top(COL_X[i + 1], y), 0.25, 0.0045, M.aceroOsc, 20));
  for (const x of COL_X) cg.add(catenaria(top(x, COL_Y[0]), top(x, COL_Y[1]), 0.3, 0.0045, M.aceroOsc, 20));
  escena.add(reg(cg, 'barras', F.guarda));
  
  const bases = new THREE.Group();
  for (const x of COL_X) for (const y of COL_Y) { const b = dado(2.0, 2.0, H_SOP, [3.21, 3.19], 1.8, 0.5); en(b, x, y); bases.add(b); }
  escena.add(reg(bases, 'obraCivil', F.basePortico));
  ROT.push({ texto: 'Pórtico 220 kV P-19 m', X: 29, Y: 13.5, h: 20.3, capa: 'portico' });
  ROT.push({ texto: 'Barras 220 kV', X: 6.2, Y: 21.5, h: 13.2, capa: 'barras', menor: true });
}

const POS = {};

export const COD = {
  b1: { sb: 'SB-4294', int: 'IN-4284', pr: 'PR-2804' },
  b2: { pr: 'PR-2802', tt: 'TT-2802', sl: 'SL-4292', tc: 'TC-2802', int: 'IN-4282', sb: 'SB-4292' },
  b3: { pr: 'PR-2800', tt: 'TT-2800', sl: 'SL-4290', tc: 'TC-2800', int: 'IN-4280', sb: 'SB-4290' },
  barra: { tt: 'TT-2804' }, trafo: 'TP-390 (transformador T1)',
};
function equipos(escena) {
  let cod = '';
  const add = (obj, capa, info, X, Y, h = H_SOP, rot = 0) => { en(obj, X, Y, h, rot); if (cod) obj.userData.cod = cod; escena.add(reg(obj, capa, info)); return obj; };
  const c = (b, k, ph) => (cod = [COD[b] && COD[b][k], ph ? 'fase ' + ph : ''].filter(Boolean).join(' · '));
  const baseQ = (w, d, X, Y, info, zap) => { const b = dado(w, d, H_SOP, zap); en(b, X, Y); escena.add(reg(b, 'obraCivil', F.baseEq)); b.userData.infoPadre = info; return b; };
  for (const b of BAHIAS) {
    const x0 = b.x0;
    if (b.tipo === 'linea') {
      for (const [ph, dx] of FASES) {
        const X = x0 + dx;
        c(b.k, 'pr', ph); add(pararrayosEq(), 'patio138', F.pr, X, 9.0); baseQ(0.6, 0.6, X, 9.0, F.pr, [1.6, 1.6]);
        c(b.k, 'tt', ph); add(ttEq(), 'patio138', F.tt, X, 12.0); baseQ(0.7, 0.7, X, 12.0, F.tt, [1.8, 1.8]);
        c(b.k, 'tc', ph); add(tcEq(), 'patio138', F.tc, X, 20.0); baseQ(0.7, 0.7, X, 20.0, F.tc, [2.1, 2.1]);
        c(b.k, 'int', ph); const ip = add(poloInterruptor(), 'patio138', F.int, X, 23.0); baseQ(1.0, 1.0, X, 23.0, F.int, [1.9, 1.9]);
        POS[b.k + ph] = { X, pr: 3.2 + 1.905, tt: 2.5 + 2.411, tc: 3.2 + 2.648, ipS: ip.userData.tSup, ipI: ip.userData.tInf };
      }
      c(b.k, 'sl'); add(seccionador({ pat: true }), 'patio138', F.sl, x0 + 7, 16.0); baseQ(0.9, 0.9, x0 + 3.45, 16.0, F.sl, [1.4, 4.3]); baseQ(0.9, 0.9, x0 + 10.55, 16.0, F.sl, [1.4, 4.3]);
      c(b.k, 'sb'); add(seccionador({}), 'patio138', F.sb, x0 + 7, 27.0); baseQ(0.9, 0.9, x0 + 3.45, 27.0, F.sb, [1.4, 4.3]); baseQ(0.9, 0.9, x0 + 10.55, 27.0, F.sb, [1.4, 4.3]);
      cod = b.dest; add(gabinete(0.8, 1.2, 0.4), 'patio138', F.tabTC, x0 + 7.0, 18.9, 0, 0);
      add(gabinete(0.8, 1.2, 0.4), 'patio138', F.tabTT, x0 + 7.0, 13.0 - 0.4, 0, 180);
      add(gabinete(0.9, 1.6, 0.5), 'patio138', F.armario, x0 + 8.65, 23.2, 0, 0);
      ETQ.push({ n: 2, key: 'pr', X: x0 + 10, Y: 9, h: 6.2 }, { n: 3, key: 'tt', X: x0 + 10, Y: 12, h: 5.9 }, { n: 4, key: 'sl', X: x0 + 10, Y: 16, h: 5.4 },
        { n: 5, key: 'tc', X: x0 + 10, Y: 20, h: 6.9 }, { n: 6, key: 'int', X: x0 + 10, Y: 23, h: 8.1 }, { n: 7, key: 'sb', X: x0 + 10, Y: 27, h: 5.4 },
        { n: 12, key: 'tabTC', X: x0 + 7, Y: 18.9, h: 2.2 }, { n: 13, key: 'tabTT', X: x0 + 7, Y: 12.6, h: 2.2 }, { n: 14, key: 'armario', X: x0 + 8.65, Y: 23.2, h: 2.6 });
      ROT.push({ texto: b.dest, X: x0 + 7, Y: 6.3, h: 2.2, capa: 'patio138' });
    } else {
      for (const [ph, dx] of FASES) {
        const X = x0 + dx;
        cod = 'Bahía de transformador · fase ' + ph; add(aisladorSop(), 'patio138', F.as, X, 20.0); baseQ(0.6, 0.6, X, 20.0, F.as, [1.6, 1.6]);
        c(b.k, 'int', ph); const ip = add(poloInterruptor(), 'patio138', F.int, X, 23.0); baseQ(1.0, 1.0, X, 23.0, F.int, [1.9, 1.9]);
        cod = 'Bahía de transformador · fase ' + ph; add(aisladorSop(), 'patio138', F.as, X, 27.0); baseQ(0.6, 0.6, X, 27.0, F.as, [1.6, 1.6]);
        c(b.k, 'pr', ph); add(pararrayosEq(), 'patio138', F.pr, X, 31.0); baseQ(0.6, 0.6, X, 31.0, F.pr, [1.6, 1.6]);
        POS[b.k + ph] = { X, as: 3.2 + 1.7, pr: 3.2 + 1.905, ipS: ip.userData.tSup, ipI: ip.userData.tInf };
      }
      c(b.k, 'sb'); add(seccionador({}), 'patio138', F.sb, x0 + 7, 16.0); baseQ(0.9, 0.9, x0 + 3.45, 16.0, F.sb, [1.4, 4.3]); baseQ(0.9, 0.9, x0 + 10.55, 16.0, F.sb, [1.4, 4.3]);
      cod = 'Bahía de transformador'; add(gabinete(0.9, 1.6, 0.5), 'patio138', F.armario, x0 + 8.65, 23.2, 0, 0);
      ETQ.push({ n: 7, key: 'sb', X: x0 + 10, Y: 16, h: 5.4 }, { n: 8, key: 'as', X: x0 + 10, Y: 20, h: 5.8 }, { n: 6, key: 'int', X: x0 + 10, Y: 23, h: 8.1 },
        { n: 8, key: 'as', X: x0 + 10, Y: 27, h: 5.8 }, { n: 2, key: 'pr', X: x0 + 10, Y: 31, h: 6.2 }, { n: 14, key: 'armario', X: x0 + 8.65, Y: 23.2, h: 2.6 });
      ROT.push({ texto: b.dest, X: x0 + 7, Y: 33.0, h: 6.4, capa: 'patio138' });
      
      cod = COD.trafo; const tp = transformador(); add(tp, 'trafo', F.trafo, 15.10, 35.38, 0.3, 0);
      POS.trafo = { X: 15.10, Y: 35.38 - tp.userData.dzAT, h: 0.3 + tp.userData.tAT };
      ETQ.push({ n: 1, key: 'trafo', X: 17.5, Y: 35.4, h: 5.6 });
      ROT.push({ texto: 'Transformador 10/12,5 MVA 220/10 kV', X: 15.1, Y: 38.5, h: 6.0, capa: 'trafo' });
    }
  }
  
  for (const ph of ['R', 'S', 'T']) { c('barra', 'tt', ph); add(ttEq(), 'patio138', F.tt, 50.0, BARRA_Y[ph]); baseQ(0.7, 0.7, 50.0, BARRA_Y[ph], F.tt, [1.8, 1.8]); }
  cod = 'TT de barra'; add(gabinete(0.8, 1.2, 0.4), 'patio138', F.tabTT, 49.4, 23.4, 0, 90); cod = '';
  ETQ.push({ n: 3, key: 'tt', X: 51.2, Y: 25.5, h: 5.9 }, { n: 13, key: 'tabTT', X: 49.4, Y: 23.4, h: 2.2 });
}


function conductores(escena) {
  const gB = new THREE.Group(), gC = new THREE.Group();
  const hB = H_SOP + 12.3;
  const hC = H_SOP + 16.0;
  for (const ph of ['R', 'S', 'T']) {
    const Y = BARRA_Y[ph];
    for (let i = 0; i < 3; i++) {
      const a0 = p3(COL_X[i] + 0.5, Y, hB), b0 = p3(COL_X[i + 1] - 0.5, Y, hB);
      const a = amarre(gB, a0, new THREE.Vector3(1, 0, 0), 1.7), b = amarre(gB, b0, new THREE.Vector3(-1, 0, 0), 1.7);
      gB.add(catenaria(a, b, 0.32, RCOND, M.aluminio, 28));
      if (i > 0) gB.add(bajada(p3(COL_X[i] - 2.2, Y, hB - 0.05), p3(COL_X[i] + 2.2, Y, hB - 0.05), 1.1));
    }
    gB.add(bajada(p3(COL_X[3] - 2.2, Y, hB - 0.05), p3(50.0, Y, H_SOP + 2.5 + 2.411), 0.5));
  }
  escena.add(reg(gB, 'barras', F.barras));
  for (const b of BAHIAS) for (const [ph, dx] of FASES) {
    const X = b.x0 + dx;
    const a = amarre(gC, p3(X, COL_Y[0] + 0.5, hC), new THREE.Vector3(0, 0, -1), 1.9);
    const c = amarre(gC, p3(X, COL_Y[1] - 0.5, hC), new THREE.Vector3(0, 0, 1), 1.9);
    gC.add(catenaria(a, c, 0.35, RCOND, M.aluminio, 30));
    const yb = BARRA_Y[ph]; const t = (yb - (COL_Y[0] + 2.4)) / (COL_Y[1] - COL_Y[0] - 4.8);
    const hAt = hC - 4 * 0.35 * t * (1 - t);
    gC.add(tubo([p3(X, yb, hAt - 0.02), p3(X, yb, (hAt + hB) / 2), p3(X, yb, hB + 0.03)], RCOND, M.aluminio, 8));
    const P = POS[b.k + ph];
    if (b.tipo === 'linea') {
      gC.add(bajada(p3(X, COL_Y[1] - 2.6, hC - 0.08), p3(X, 27.0 + 1.25, H_SOP + 4.49), 1.2));
      gC.add(bajada(p3(X, 27.0 - 1.25, H_SOP + 4.49), p3(X, 23.0 + 0.15, H_SOP + P.ipI), 0.45));
      gC.add(bajada(p3(X, 23.0, H_SOP + P.ipS), p3(X, 20.0, H_SOP + P.tc - 0.05), 0.55));
      gC.add(bajada(p3(X, 20.0, H_SOP + P.tc - 0.05), p3(X, 16.0 + 1.25, H_SOP + 4.49), 0.6));
      gC.add(bajada(p3(X, 16.0 - 1.25, H_SOP + 4.49), p3(X, 12.0, H_SOP + P.tt), 0.4));
      gC.add(bajada(p3(X, 12.0, H_SOP + P.tt), p3(X, 9.0, H_SOP + P.pr), 0.35));
    } else {
      gC.add(bajada(p3(X, COL_Y[0] + 2.6, hC - 0.08), p3(X, 16.0 - 1.25, H_SOP + 4.49), 1.2));
      gC.add(bajada(p3(X, 16.0 + 1.25, H_SOP + 4.49), p3(X, 20.0, H_SOP + P.as), 0.35));
      gC.add(bajada(p3(X, 20.0, H_SOP + P.as), p3(X, 23.0, H_SOP + P.ipS), 0.5));
      gC.add(bajada(p3(X, 23.0 + 0.15, H_SOP + P.ipI), p3(X, 27.0, H_SOP + P.as), 0.35));
      gC.add(bajada(p3(X, 27.0, H_SOP + P.as), p3(X, 31.0, H_SOP + P.pr), 0.45));
      const xb = POS.trafo.X + (dx - 7) * 1.2 / 3;
      gC.add(bajada(p3(X, 31.0, H_SOP + P.pr), p3(xb, POS.trafo.Y, POS.trafo.h), 0.5));
    }
  }
  escena.add(reg(gC, 'barras', F.conductores));
}


function llegadaLinea(escena) {
  const g = new THREE.Group(), gT = new THREE.Group();
  const zT = AJUSTE_T19.z ?? alturaTerreno(T19.X, T19.Y);
  const dIn = new THREE.Vector2(T19.X - 250.9, T19.Y - 60.6).normalize();
  const dOut = new THREE.Vector2(esp(36) - T19.X, 13.5 - T19.Y).normalize();
  const bis = dIn.clone().add(dOut).normalize(); const perp = new THREE.Vector2(-bis.y, bis.x);
  const hF = { S: 16.3, T: 21.75, R: 27.2 }, hG = 32.5; 
  const brazo = 3.6;
  const fuste = columnaPortico({ b0: 6.0, b1: 1.6, hT: 15.5, hC: 28.5, punta: hG - 28.5, panel: 2.0, ala: 0.12, diag: 0.06 });
  const t = new THREE.Mesh(fuste, M.fantasma); t.position.copy(p3(T19.X, T19.Y, zT)); t.rotation.y = Math.atan2(-perp.y, perp.x); gT.add(t);
  for (const ph of ['S', 'T', 'R']) for (const s of [-1, 1]) {
    const a = p3(T19.X, T19.Y, zT + hF[ph]); const b = p3(T19.X + s * perp.x * brazo, T19.Y + s * perp.y * brazo, zT + hF[ph]);
    gT.add(barra(a, b, 0.09, M.fantasma));
  }
  gT.userData.t23 = true; escena.add(reg(gT, 'linea', F.t23));
  ROT.push({ texto: 'Torre T19 (LT 220 kV)', X: T19.X, Y: T19.Y, h: zT + hG + 1.5, capa: 'linea' });
  const lado = { b2: 1, b3: -1 };
  for (const b of BAHIAS.filter((x) => x.tipo === 'linea')) for (const [ph, dx] of FASES) {
    const X = esp(b.x0 + dx);
    const pa = p3(X, COL_Y[0] - 0.5, H_SOP + 16.0);
    const tip = p3(T19.X + lado[b.k] * perp.x * brazo, T19.Y + lado[b.k] * perp.y * brazo, zT + hF[ph]);
    const dir = tip.clone().sub(pa); dir.y = 0; dir.normalize();
    const a = amarre(g, pa, dir, L_ANCLAJE);
    const pt = tip.clone().addScaledVector(dir, -L_ANCLAJE);
    g.add(cadena(tip, pt, M.aisladorGris));
    g.add(catenaria(a, pt, 1.1, 0.0105, M.lineaAAAC, 40));
    const P = POS[b.k + ph];
    const q = a.clone().addScaledVector(dir, 1.2); q.y -= 0.15;
    g.add(bajada(q, p3(X, 9.0, H_SOP + P.pr), 2.0));
  }
  for (const x of [esp(22), esp(36)]) g.add(catenaria(p3(T19.X, T19.Y, zT + hG), p3(x, COL_Y[0], H_SOP + H_PUNTA - 0.05), 0.9, 0.0045, M.aceroOsc, 30));
  escena.add(reg(g, 'linea', F.linea));
}

export const CANALETAS = [
  
  [0.70, 0.70, [[12.0, 31.85], [47.9, 31.85]]],
  [0.70, 0.70, [[47.9, 31.85], [47.9, 47.3]]],                        
  [0.50, 0.60, [[20.0, 14.4], [20.0, 31.85]]], [0.50, 0.60, [[34.0, 13.2], [34.0, 31.85]]], [0.50, 0.60, [[48.0, 13.2], [48.0, 31.5]]],
  [0.50, 0.60, [[11.7, 24.3], [20.0, 24.3]]], [0.50, 0.60, [[25.0, 24.3], [34.0, 24.3]]], [0.50, 0.60, [[39.0, 24.3], [48.0, 24.3]]],
  [0.30, 0.30, [[25.7, 18.75], [34.0, 18.75]]], [0.30, 0.30, [[39.7, 18.75], [48.0, 18.75]]],
  [0.50, 0.60, [[25.0, 13.5], [34.0, 13.5]]], [0.50, 0.60, [[39.0, 13.5], [48.0, 13.5]]],
  [0.90, 1.10, [[35.3, 51.1], [64.0, 51.1]]],                         
  [0.80, 1.10, [[35.46, 48.05], [44.42, 48.05]]],
  [0.70, 0.70, [[45.84, 47.74], [50.04, 47.74]]],
];
function obraCivil(escena) {
  const gc = new THREE.Group();
  for (const [a, pr, pts] of CANALETAS) {
    gc.add(canaletaYP(pts, a, pr));
    for (let i = 0; i + 1 < pts.length; i++) {
      const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], e = a / 2 + 0.12;
      HUECOS.push([Math.min(x0, x1) - e, Math.min(y0, y1) - e, Math.max(x0, x1) + e, Math.max(y0, y1) + e]);
    }
  }
  escena.add(reg(gc, 'obraCivil', F.canaleta));
  
  const gz = new THREE.Group();
  for (const [X, Y, n] of [[19.2, 35.0, 'Bz-1'], [38.81, 35.0, 'Bz-2']]) {
    const z = new THREE.Group();
    z.add(caja(2.52, 0.15, 0.16, M.concreto, 0, -0.075, 1.18), caja(2.52, 0.15, 0.16, M.concreto, 0, -0.075, -1.18), caja(0.16, 0.15, 2.2, M.concreto, 1.18, -0.075, 0), caja(0.16, 0.15, 2.2, M.concreto, -1.18, -0.075, 0));
    for (const s of [-1, 1]) for (const r of [0, 1]) { const w = caja(r ? 0.16 : 2.52, 1.6, r ? 2.2 : 0.16, M.concreto, r ? s * 1.18 : 0, -0.95, r ? 0 : s * 1.18); w.userData.subsuelo = true; CTX.subsuelo.push(w); z.add(w); }
    const tapa = caja(2.2, 0.08, 2.2, M.concretoNuevo, 0, 0.04, 0); tapa.userData.tapa = true; CTX.tapas.push(tapa); z.add(tapa);
    en(z, X, Y); gz.add(z); HUECOS.push([X - 1.26, Y - 1.26, X + 1.26, Y + 1.26]);
    ROT.push({ texto: n, X, Y, h: 0.8, capa: 'obraCivil', menor: true });
  }
  for (let k = 0; k < 3; k++) { const d = caja(18.1, 0.42, 0.42, M.concreto, 29.0, -0.75, -(35.0 - 0.5 + k * 0.5)); d.userData.subsuelo = true; CTX.subsuelo.push(d); gz.add(d); }
  escena.add(reg(gz, 'obraCivil', F.buzon));
  
  const via = new THREE.Group();
  const anillo = redondeado(1.5, 1.5, 58.5, 44.5, 10), hueco = redondeado(5.5, 5.5, 54.5, 39.5, 6);
  via.add(losaConHueco(anillo, hueco, 0.0, 0.03, M.afirmado));
  via.add(losa([[1.5, 44.0], [11.5, 44.0], [11.5, 56.0], [1.5, 56.0]], 0.0, 0.03, M.afirmado));
  via.add(losa([[26.35, 44.0], [29.5, 44.0], [29.5, 54.0], [26.35, 54.0]], 0.0, 0.03, M.afirmado));
  via.traverse((m) => { if (m.isMesh) { m.castShadow = false; if (m.material.map) { m.material = m.material.clone(); } } });
  escena.add(reg(via, 'obraCivil', F.via));
  
  const dr = new THREE.Group();
  dr.add(canaletaYP([[-1.0, 55.4], [-1.0, -0.9], [68.4, -0.9]], 0.3, 0.3, false));
  dr.add(canaletaYP([[14.8, 56.75], [67.8, 56.75]], 0.3, 0.3, false));
  escena.add(reg(dr, 'obraCivil', F.drenaje));
  const bt = new THREE.Group();
  bt.add(caja(6.1, 0.35, 0.2, M.concretoNuevo, 15.0, 0.05, -(35.0 + 2.2)), caja(6.1, 0.35, 0.2, M.concretoNuevo, 15.0, 0.05, -(35.0 - 2.2)));
  bt.add(caja(0.2, 0.35, 4.6, M.concretoNuevo, 15.0 + 2.95, 0.05, -35.0), caja(0.2, 0.35, 4.6, M.concretoNuevo, 15.0 - 2.95, 0.05, -35.0));
  const gr = caja(5.7, 0.05, 4.2, M.grava, 15.0, 0.0, -35.0); gr.userData.gravaBase = true; CTX.tapas.push(gr); bt.add(gr);
  bt.add(caja(4.6, 0.32, 3.0, M.concretoNuevo, 15.0, 0.13, -35.0));
  for (const y of [34.26, 35.73]) { const r = caja(13.4, 0.12, 0.1, M.riel, 6.2, 0.06, -y); bt.add(r); }
  bt.add(losa([[1.5, 33.4], [11.9, 33.4], [11.9, 36.7], [1.5, 36.7]], -0.01, 0.02, M.concretoNuevo));
  for (const x of [14.2, 15.75]) bt.add(caja(0.1, 0.12, 9.2, M.riel, x, 0.06, -(37.3 + 4.6)));
  bt.add(losa([[13.7, 37.3], [16.2, 37.3], [16.2, 46.2], [13.7, 46.2]], -0.01, 0.02, M.concretoNuevo));
  escena.add(reg(bt, 'obraCivil', F.baseTrafo));
}
function redondeado(x0, y0, x1, y1, r, n = 8) {
  const pts = []; const c = [[x1 - r, y0 + r, -90], [x1 - r, y1 - r, 0], [x0 + r, y1 - r, 90], [x0 + r, y0 + r, 180]];
  for (const [cx, cy, a0] of c) for (let i = 0; i <= n; i++) { const a = ((a0 + (90 * i) / n) * Math.PI) / 180; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
  return pts;
}
function losaConHueco(ext, hue, y0, y1, mat) {
  const sh = new THREE.Shape(ext.map(([X, Y]) => new THREE.Vector2(X, Y)));
  sh.holes.push(new THREE.Path(hue.slice().reverse().map(([X, Y]) => new THREE.Vector2(X, Y))));
  const geo = new THREE.ExtrudeGeometry(sh, { depth: y1 - y0, bevelEnabled: false }); geo.rotateX(-Math.PI / 2); geo.translate(0, y0, 0);
  const uv = geo.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) / 3, uv.getY(k) / 3);
  const m = new THREE.Mesh(geo, mat); m.receiveShadow = true; return m;
}
function canaletaYP(pts, a, p, tapas = true) {
  const g = new THREE.Group(); const e = 0.12;
  for (let i = 0; i + 1 < pts.length; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const L = Math.hypot(x1 - x0, y1 - y0); const ang = Math.atan2(y1 - y0, x1 - x0);
    const s = new THREE.Group(); s.position.set((x0 + x1) / 2, 0, -(y0 + y1) / 2); s.rotation.y = ang;
    const Lx = L + a + 2 * e;
    s.add(caja(Lx, e, a + 2 * e, M.concreto, 0, -p - e / 2, 0));
    s.add(caja(Lx, p + 0.05, e, M.concretoNuevo, 0, -p / 2 + 0.025, a / 2 + e / 2));
    s.add(caja(Lx, p + 0.05, e, M.concretoNuevo, 0, -p / 2 + 0.025, -a / 2 - e / 2));
    if (tapas) {
      const nt = Math.max(1, Math.round(L / 0.6));
      for (let k = 0; k < nt; k++) { const t = caja(L / nt - 0.015, 0.05, a + 0.04, M.concretoNuevo, -L / 2 + (k + 0.5) * (L / nt), 0.05, 0); t.userData.tapa = true; CTX.tapas.push(t); s.add(t); }
      for (let k = 0; k <= Math.floor(L); k++) s.add(caja(0.04, 0.03, a * 0.45, M.acero, -L / 2 + k, -0.2, a / 2 - a * 0.225));
    }
    g.add(s);
  }
  return g;
}


export const SALAS = [
  { k: 'ER2', nombre: 'Sala 2 (ER2) · celdas 10 kV', x0: 34.34, x1: 46.34, puertaX: 46.34 },
  { k: 'ER1', nombre: 'Sala 1 (ER1) · tableros de control y protección', x0: 48.94, x1: 60.94, puertaX: 48.94 },
];
const SALA_Y = [46.55, 49.55], H_PIL = 1.6, H_BAS = 0.313, H_CUM = 3.612;
function shelter(sl) {
  const g = new THREE.Group(); const L = sl.x1 - sl.x0, W = SALA_Y[1] - SALA_Y[0], cx = (sl.x0 + sl.x1) / 2, cy = (SALA_Y[0] + SALA_Y[1]) / 2;
  const y0 = H_PIL, yB = y0 + H_BAS, hMuro = H_CUM - H_BAS - 0.12;
  g.add(caja(L, H_BAS, 0.2, M.aceroOsc, cx, y0 + H_BAS / 2, -(SALA_Y[0] + 0.1)), caja(L, H_BAS, 0.2, M.aceroOsc, cx, y0 + H_BAS / 2, -(SALA_Y[1] - 0.1)));
  for (let k = 0; k <= 6; k++) g.add(caja(0.2, H_BAS, W - 0.4, M.aceroOsc, sl.x0 + 0.1 + (k * (L - 0.2)) / 6, y0 + H_BAS / 2, -cy));
  g.add(caja(L, 0.05, W, M.piso, cx, yB - 0.02, -cy));
  const muros = new THREE.Group(); muros.userData.muro = true; CTX.muros = CTX.muros || []; CTX.muros.push(muros);
  muros.add(caja(L, hMuro, 0.06, M.shelter, cx, yB + hMuro / 2, -(SALA_Y[0] + 0.03)), caja(L, hMuro, 0.06, M.shelter, cx, yB + hMuro / 2, -(SALA_Y[1] - 0.03)));
  for (const x of [sl.x0 + 0.03, sl.x1 - 0.03]) {
    if (Math.abs(x - sl.puertaX) < 0.1) { 
      const yA = 46.96, yC = 48.56;
      muros.add(caja(0.06, hMuro, yA - SALA_Y[0], M.shelter, x, yB + hMuro / 2, -(SALA_Y[0] + (yA - SALA_Y[0]) / 2)));
      muros.add(caja(0.06, hMuro, SALA_Y[1] - yC, M.shelter, x, yB + hMuro / 2, -(yC + (SALA_Y[1] - yC) / 2)));
      muros.add(caja(0.06, hMuro - 2.2, yC - yA, M.shelter, x, yB + 2.2 + (hMuro - 2.2) / 2, -(yA + yC) / 2));
      for (const [a, b] of [[yA, (yA + yC) / 2], [(yA + yC) / 2, yC]]) { const h = caja(0.05, 2.18, b - a - 0.02, M.puerta, x, yB + 1.09, -(a + b) / 2); g.add(h); }
    } else muros.add(caja(0.06, hMuro, W, M.shelter, x, yB + hMuro / 2, -cy));
  }
  for (const t of [0.22, 0.6]) for (const yy of [0.85, 2.4]) g.add(caja(0.6, 0.45, 0.03, M.rejilla, sl.x0 + t * L, yB + yy, -(SALA_Y[0] - 0.02)));
  for (const yy of [0.85, 2.4]) g.add(caja(0.6, 0.45, 0.03, M.rejilla, sl.x0 + 0.5 * L, yB + yy, -(SALA_Y[1] + 0.02)));
  g.add(muros);
  const yE = y0 + H_CUM - 0.1;
  for (const s of [-1, 1]) { const t = caja(L + 0.2, 0.06, W / 2 + 0.12, M.techoZ, cx, yE + 0.04, -(cy + s * (W / 4 + 0.03))); t.rotation.x = s * 0.06; muros.add(t);
    g.add(caja(L + 0.2, 0.08, 0.1, M.aceroOsc, cx, yE - 0.05, -(cy + s * (W / 2 + 0.14)))); }
  for (const dx of [0.3, 0.7]) { g.add(cil(0.02, 0.02, 0.5, M.acero, 8, sl.x0 + dx * L, yE + 0.35, -cy)); g.add(cil(0.06, 0.04, 0.1, M.gabinete, 12, sl.x0 + dx * L, yE + 0.62, -cy)); }
  
  for (const x of sl.k === 'ER2' ? [34.40, 38.34, 42.34, 46.29] : [49.00, 52.94, 56.94, 60.89]) for (const y of [46.60, 49.50]) {
    const pz = caja(0.5, H_PIL, 0.5, M.concretoNuevo, x, H_PIL / 2, -y); g.add(pz);
    const z = caja(1.8, 0.4, 1.8, M.concreto, x, -0.9, -y); z.userData.subsuelo = true; CTX.subsuelo.push(z); g.add(z);
  }
  const fila = (items, desdeOeste) => {
    let x = desdeOeste ? sl.x0 + 0.06 : sl.x1 - 0.06;
    for (const [w, d, h, mat, sep] of items) {
      x += desdeOeste ? sep : -sep; const xc = desdeOeste ? x + w / 2 : x - w / 2;
      const zF = -(SALA_Y[1] - 0.06 - d - 0.006);
      const b = caja(w - 0.04, h, d, mat, xc, yB + h / 2, -(SALA_Y[1] - 0.06 - d / 2)); g.add(b);
      g.add(caja(w * 0.7, 0.02, 0.01, M.aceroOsc, xc, yB + h * 0.62, zF));
      if (mat !== M.bateria) {
        g.add(caja(w * 0.62, h * 0.16, 0.01, M.bateria, xc, yB + h * 0.80, zF));
        g.add(caja(w - 0.04, 0.1, 0.012, M.aceroOsc, xc, yB + 0.05, zF));
      }
      x += desdeOeste ? w : -w;
    }
  };
  if (sl.k === 'ER2') fila([[0.6, 1.225, 2.25, M.celda, 0.767], [0.6, 1.225, 2.25, M.celda, 0], [0.6, 1.225, 2.25, M.celda, 0],
    [0.6, 1.225, 2.25, M.celda, 0.784], [0.6, 1.225, 2.25, M.celda, 0], [0.9, 1.225, 2.25, M.celda, 0], [0.6, 1.225, 2.25, M.celda, 0], [0.6, 1.225, 2.25, M.celda, 0], [0.6, 1.225, 2.25, M.celda, 0], [0.6, 1.225, 2.25, M.celda, 0],
    [0.8, 0.8, 2.2, M.tablero, 0.15], [0.8, 0.6, 1.94, M.tablero, 0.1], [1.75, 0.8, 2.2, M.bateria, 0.1]], true);
  else { fila(Array.from({ length: 10 }, (_, i) => [0.8, 0.8, 2.2, M.tablero, i ? 0 : 2.0]), true); fila([[1.75, 0.8, 1.2, M.bateria, 0.15], [0.66, 0.8, 1.9, M.tablero, 0.1]], false); }
  return marca(g);
}
function salasYMT(escena) {
  for (const sl of SALAS) { const g = shelter(sl); g.userData.cod = sl.nombre; escena.add(reg(g, 'mt10', F.sala)); }
  ETQ.push({ n: 9, key: 'sala', X: 36.5, Y: 48.0, h: 6.0 }, { n: 9, key: 'sala', X: 59.0, Y: 48.0, h: 6.0 });
  ROT.push({ texto: 'Sala 2 (ER2) · celdas 10 kV', X: 40.3, Y: 48.0, h: 6.6, capa: 'mt10' }, { texto: 'Sala 1 (ER1) · control y protección', X: 54.9, Y: 48.0, h: 6.6, capa: 'mt10' });
  const pl = new THREE.Group(); const hP = 1.903;
  pl.add(caja(2.6, 0.08, 4.0, M.rejilla, 47.64, hP - 0.04, -47.05));
  for (const x of [46.44, 48.84]) for (const y of [45.15, 48.95]) pl.add(caja(0.1, hP - 0.08, 0.1, M.acero, x, (hP - 0.08) / 2, -y), caja(0.35, 0.141, 0.35, M.concretoNuevo, x, 0.07, -y));
  const baranda = (a, b) => { pl.add(barra(p3(a[0], a[1], hP + 1.0), p3(b[0], b[1], hP + 1.0), 0.02, M.amarillo, true)); pl.add(barra(p3(a[0], a[1], hP + 0.5), p3(b[0], b[1], hP + 0.5), 0.015, M.amarillo, true)); };
  baranda([46.34, 45.05], [48.94, 45.05]);
  for (const [xa, xb] of [[46.34, 44.11], [48.94, 51.17]]) {
    const n = 11;
    for (let i = 0; i < n; i++) { const t = (i + 0.5) / n; pl.add(caja(Math.abs(xb - xa) / n + 0.02, 0.04, 1.14, M.rejilla, xa + (xb - xa) * t, hP * (1 - t) - 0.02, -45.62)); }
    for (const y of [45.05, 46.19]) { pl.add(barra(p3(xa, y, hP), p3(xb, y, 0), 0.05, M.acero)); pl.add(barra(p3(xa, y, hP + 0.95), p3(xb, y, 0.95), 0.02, M.amarillo, true)); }
  }
  escena.add(reg(pl, 'mt10', F.plataforma));
  const px = [47.5, 52.0, 56.5, 61.0], pyP = 52.7, gP = new THREE.Group();
  const col = columnaCelosia(0.5, 0.5, 8.6, 0.6, 0.06, 0.03, 0.4);
  for (const x of px) { const c = new THREE.Mesh(col, M.acero); en(c, x, pyP, 0.2); c.castShadow = true; gP.add(c); }
  const vg = vigaCelosia(4.0, 0.5, 0.5, 0.5);
  for (let i = 0; i < 3; i++) for (const h of [5.0, 7.0]) { const m = new THREE.Mesh(vg, M.acero); en(m, (px[i] + px[i + 1]) / 2, pyP, 0.2 + h); m.castShadow = true; gP.add(m); }
  escena.add(reg(gP, 'mt10', F.portico10));
  const bP = new THREE.Group(); for (const x of px) { const b = dado(0.9, 0.9, 0.2, [3.0, 3.0], 1.5, 0.5); en(b, x, pyP); bP.add(b); }
  escena.add(reg(bP, 'obraCivil', F.basePortico10));
  const MINAS = ['MINA 3', 'MINA 2', 'MINA 1'];
  for (let i = 0; i < 3; i++) {
    const gS = new THREE.Group(); const xc = (px[i] + px[i + 1]) / 2;
    for (const dx of [-1.2, 0, 1.2]) {
      const X = xc + dx;
      const pa = aislador(0.42, M.polimero, 0.04, 0.08, 0.04, false); en(pa, X, pyP + 0.35, 0.2 + 7.25); gS.add(pa);
      const sc = aislador(0.36, M.aisladorGris, 0.04, 0.08, 0.045); en(sc, X, pyP - 0.32, 0.2 + 5.25); gS.add(sc);
      gS.add(caja(0.06, 0.04, 0.55, M.aluminio, X, 0.2 + 5.25 + 0.38, -(pyP - 0.32)));
      const tm = aislador(0.45, M.aisladorGris, 0.05, 0.09, 0.045); en(tm, X, pyP - 0.32, 0.2 + 4.3); gS.add(tm);
      gS.add(tubo([p3(X, pyP - 0.32, 0.2 + 4.75), p3(X, pyP - 0.32, 0.2 + 5.25)], 0.012, M.cableNegro, 4));
      gS.add(bajada(p3(X, pyP - 0.32, 0.2 + 5.25 + 0.4), p3(X, pyP + 0.35, 0.2 + 7.25 + 0.42), 0.15, 0.008));
      
      gS.add(catenaria(p3(X, pyP + 0.35, 0.2 + 7.2), p3(X + dx * 0.6, pyP + 14, 0.2 + 6.8), 0.35, 0.007, M.lineaAAAC, 16));
    }
    const tu = cil(0.06, 0.06, 4.1, M.pvcGris, 10, px[i] + 0.35, 0.2 + 2.05, -(pyP - 0.32)); gS.add(tu);
    gS.userData.cod = MINAS[i] + ' · salida 10 kV';
    escena.add(reg(gS, 'mt10', F.salida10));
    ROT.push({ texto: MINAS[i], X: xc, Y: pyP, h: 9.6, capa: 'mt10', menor: true });
  }
  
  escena.add(reg(catenaria(p3(47.5, pyP, 0.2 + 9.0), p3(50, 29.5, H_SOP + H_PUNTA - 0.05), 0.7, 0.0045, M.aceroOsc, 24), 'barras', F.guarda));
  
  const gD = new THREE.Group(); const ducto = (x0, y0, x1, y1, n, h = -0.7) => { for (let k = 0; k < n; k++) { const o = (k - (n - 1) / 2) * 0.13; const d = barra(p3(x0 + (y0 === y1 ? 0 : o), y0 + (y0 === y1 ? o : 0), h), p3(x1 + (y0 === y1 ? 0 : o), y1 + (y0 === y1 ? o : 0), h), 0.055, M.pvcGris, true); d.userData.subsuelo = true; CTX.subsuelo.push(d); gD.add(d); } };
  ducto(63.45, 50.65, 63.45, 41.9, 6); ducto(61.55, 40.7, 61.55, 46.55, 4);
  for (const x of [49.75, 54.25, 58.75]) ducto(x, 51.55, x, 53.03, 3);
  ducto(19.2, 35.0, 38.8, 35.0, 9, -0.75);
  escena.add(reg(gD, 'obraCivil', F.ductos));
  const gL = new THREE.Group();
  gL.add(losa([[59.43, 31.8], [65.83, 31.8], [65.83, 40.7], [59.43, 40.7]], -0.02, 0.15, M.concretoNuevo));
  const r = [60.93, 32.0, 65.63, 40.5];
  const mallaPaño = (a, b, h = 2.4) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]); const pm = new THREE.Mesh(new THREE.PlaneGeometry(L, h), M.malla); const uv = pm.geometry.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * L * 4, uv.getY(k) * h * 4);
    pm.position.copy(p3((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0.15 + h / 2)); pm.rotation.y = Math.atan2(b[1] - a[1], b[0] - a[0]); gL.add(pm);
    gL.add(barra(p3(a[0], a[1], 0.15 + h), p3(b[0], b[1], 0.15 + h), 0.02, M.acero, true)); };
  const pts = [[r[0], r[1]], [r[2], r[1]], [r[2], r[3]], [r[0], r[3]]];
  mallaPaño(pts[0], pts[1]); mallaPaño(pts[1], pts[2]); mallaPaño(pts[2], pts[3]);
  mallaPaño([r[0], r[1]], [r[0], 33.0]); mallaPaño([r[0], 36.3], [r[0], 37.6]); mallaPaño([r[0], 39.4], [r[0], r[3]]);
  mallaPaño([r[0], 37.5], [r[2], 37.5]);
  for (const [x, y] of [...pts, [r[0], 37.5], [r[2], 37.5], [r[0], 33.0], [r[0], 36.3], [r[0], 37.6], [r[0], 39.4]]) gL.add(cil(0.035, 0.035, 2.5, M.acero, 8, x, 0.15 + 1.25, -y));
  escena.add(reg(gL, 'ssaa', F.recintoSA));
  const tr = new THREE.Group(); 
  tr.add(caja(1.26, 1.65, 1.6, M.pintura, 63.37, 0.15 + 0.17 + 0.825, -38.99));
  for (const [dx, dy] of [[-0.45, -0.6], [0.45, -0.6], [-0.45, 0.6], [0.45, 0.6]]) { const w = cil(0.075, 0.075, 0.08, M.negro, 12, 63.37 + dx, 0.15 + 0.085, -(38.99 + dy)); w.rotation.x = Math.PI / 2; tr.add(w); }
  tr.add(caja(0.02, 0.5, 1.0, M.rejilla, 64.015, 0.15 + 0.17 + 1.2, -38.99));
  tr.add(caja(0.02, 1.2, 1.24, M.puerta, 62.735, 0.15 + 0.17 + 0.7, -38.99));
  escena.add(reg(marca(tr), 'ssaa', F.trafoSA));
  const ge = new THREE.Group();
  ge.add(caja(1.8, 0.25, 3.1, M.concreto, 63.37, 0.15 + 0.125, -34.25));
  ge.add(caja(1.4, 0.15, 2.7, M.aceroOsc, 63.37, 0.4 + 0.075, -34.2));
  ge.add(caja(1.1, 1.55, 2.29, M.amarillo, 63.37, 0.55 + 0.775, -34.2));
  for (let k = 0; k < 6; k++) ge.add(caja(0.02, 0.5, 0.12, M.aceroOsc, 62.81, 0.95 + 0.4, -(33.4 + k * 0.3)));
  ge.add(cil(0.05, 0.05, 0.5, M.aceroOsc, 10, 63.6, 2.35, -35.0));
  escena.add(reg(marca(ge), 'ssaa', F.grupo));
  const tt = gabinete(0.8, 1.8, 0.8); en(tt, 62.21, 36.87, 0.15); escena.add(reg(tt, 'ssaa', F.tabTransf));
  ETQ.push({ n: 10, key: 'trafoSA', X: 63.37, Y: 38.99, h: 2.6 }, { n: 11, key: 'grupo', X: 63.37, Y: 34.2, h: 2.8 }, { n: 15, key: 'tabTransf', X: 62.21, Y: 36.87, h: 2.6 });
  ROT.push({ texto: 'Servicios auxiliares', X: 63.3, Y: 41.5, h: 3.4, capa: 'ssaa' });
}

const MALLA_X = [1.3, 10.3, 18.3, 24.3, 33.3, 41.3, 49.3, 57.3, 66.3], MALLA_Y = [2.5, 10.5, 18.5, 26.5, 34.5, 42.5, 50.5, 55.5];
const POZOS = [[7.5, 36.4], [11.1, 28.5], [14.5, 28.5], [17.9, 28.5], [25.1, 6.5], [28.7, 6.5], [32.2, 6.5], [39.3, 6.5], [42.8, 6.5], [46.2, 6.5], [51.7, 53.9], [56.2, 53.9], [60.8, 53.9], [65.0, 43.3], [65.0, 30.5]];
function redTierra(escena) {
  const g = new THREE.Group(); const h = -0.8;
  const geos = [];
  for (const x of MALLA_X) geos.push(barraGeo(p3(x, MALLA_Y[0], h), p3(x, MALLA_Y.at(-1), h), 0.035, true));
  for (const y of MALLA_Y) geos.push(barraGeo(p3(MALLA_X[0], y, h), p3(MALLA_X.at(-1), y, h), 0.035, true));
  const m = fusion(geos, M.tierraNueva, false); m.userData.subsuelo = true; CTX.subsuelo.push(m); g.add(m);
  for (const [X, Y] of POZOS) {
    const v = cil(0.012, 0.012, 2.4, M.cobre, 6, X, h - 1.2, -Y); v.userData.subsuelo = true; CTX.subsuelo.push(v); g.add(v);
    g.add(caja(0.4, 0.06, 0.4, M.concretoNuevo, X, 0.03, -Y));
  }
  escena.add(reg(g, 'tierra', F.tierra));
}
function edificaciones(escena) {
  const muro = (x0, y0, x1, y1, h, e = 0.15, y = 0) => { const L = Math.hypot(x1 - x0, y1 - y0) + e; const m = caja(L, h, e, M.muro, (x0 + x1) / 2, y + h / 2, -(y0 + y1) / 2); m.rotation.y = Math.atan2(y1 - y0, x1 - x0); return m; };
  
  const c = new THREE.Group(); const hC = 2.7;
  c.add(losa([[12.15, 49.5], [17.5, 49.5], [17.5, 55.4], [12.15, 55.4]], -0.02, 0.12, M.concretoNuevo));
  c.add(muro(12.725, 50.0, 12.725, 50.4, hC, 0.15, 0.12), muro(12.725, 51.5, 12.725, 53.0, hC, 0.15, 0.12), muro(12.725, 53.9, 12.725, 54.9, hC, 0.15, 0.12));
  c.add(muro(12.65, 54.825, 13.3, 54.825, hC, 0.15, 0.12), muro(14.6, 54.825, 17.0, 54.825, hC, 0.15, 0.12), muro(16.925, 50.0, 16.925, 54.9, hC, 0.15, 0.12));
  c.add(muro(12.65, 50.075, 14.3, 50.075, hC, 0.15, 0.12), muro(15.6, 50.075, 17.0, 50.075, hC, 0.15, 0.12));
  c.add(muro(12.65, 52.4, 17.0, 52.4, hC, 0.1, 0.12), muro(15.0, 52.4, 15.0, 54.9, hC, 0.1, 0.12));
  for (const [x0, x1, y] of [[13.3, 14.6, 54.825], [14.3, 15.6, 50.075]]) { c.add(caja(x1 - x0, 1.2, 0.04, M.vidrio, (x0 + x1) / 2, 0.12 + 1.45, -y)); c.add(caja(x1 - x0, 0.9, 0.15, M.muro, (x0 + x1) / 2, 0.12 + 0.45, -y)); c.add(caja(x1 - x0, 0.6, 0.15, M.muro, (x0 + x1) / 2, 0.12 + 2.4, -y)); }
  c.add(caja(0.05, 2.1, 1.1, M.puerta, 12.7, 0.12 + 1.05, -50.95), caja(0.05, 2.1, 0.9, M.puerta, 12.7, 0.12 + 1.05, -53.45));
  c.add(caja(0.15, hC - 2.1, 1.1, M.muro, 12.725, 0.12 + 2.1 + (hC - 2.1) / 2, -50.95), caja(0.15, hC - 2.1, 0.9, M.muro, 12.725, 0.12 + 2.1 + (hC - 2.1) / 2, -53.45));
  c.add(caja(4.75, 0.18, 5.3, M.concretoNuevo, 14.825, 0.12 + hC + 0.09, -52.45));
  const gc = marca(c); gc.userData.cod = 'Caseta (NE), baño (NO) y oficina (S)'; escena.add(reg(gc, 'edif', F.caseta));
  ROT.push({ texto: 'Caseta de vigilancia y oficina', X: 14.8, Y: 52.45, h: 3.6, capa: 'edif' });
  
  const a = new THREE.Group(); const ax0 = 61.45, ax1 = 66.02, ay0 = 0.57, ay1 = 12.0;
  a.add(losa([[ax0, ay0], [ax1, ay0], [ax1, ay1], [ax0, ay1]], -0.02, 0.1, M.concretoNuevo));
  for (const [x0, y0, x1, y1] of [[ax0, ay0, ax1, ay0], [ax1, ay0, ax1, ay1], [ax1, ay1, ax0, ay1], [ax0, ay1, ax0, ay0]]) a.add(muro(x0, y0, x1, y1, 0.45, 0.15, 0));
  const ys = [ay0, ay0 + 2.065, ay0 + 5.102, ay0 + 8.126, ay1];
  const hAlto = 3.783, hBajo = 3.196, hDe = (x) => hBajo + ((hAlto - hBajo) * (x - ax1)) / (ax0 - ax1);
  for (const x of [ax0, ax1]) for (const y of ys) a.add(cil(0.045, 0.045, hDe(x) - 0.45, M.acero, 10, x, 0.45 + (hDe(x) - 0.45) / 2, -y));
  const panel = (x0, y0, x1, y1) => { const L = Math.hypot(x1 - x0, y1 - y0); const hh = (hDe(x0) + hDe(x1)) / 2 - 0.45 - 0.1; const pm = new THREE.Mesh(new THREE.PlaneGeometry(L, hh), M.malla); const uv = pm.geometry.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * L * 5, uv.getY(k) * hh * 5);
    pm.position.copy(p3((x0 + x1) / 2, (y0 + y1) / 2, 0.45 + hh / 2)); pm.rotation.y = Math.atan2(y1 - y0, x1 - x0); a.add(pm); };
  panel(ax0, ay0, ax1, ay0); panel(ax1, ay0, ax1, ay1); panel(ax1, ay1, ax0, ay1); panel(ax0, ay1, ax0, 8.0); panel(ax0, 5.3, ax0, 3.61); panel(ax0, 2.6, ax0, ay0);
  a.add(muro(ax0, 3.61, ax1, 3.61, 2.6, 0.1, 0.45));
  a.add(caja(0.05, 2.3, 2.697, M.puerta, ax0, 0.45 + 1.15, -6.65), caja(0.05, 2.1, 0.9, M.puerta, ax0, 0.45 + 1.05, -3.05));
  const te = caja(ax1 - ax0 + 0.5, 0.05, ay1 - ay0 + 0.5, M.techoZ, (ax0 + ax1) / 2, (hAlto + hBajo) / 2 + 0.03, -(ay0 + ay1) / 2); te.rotation.z = Math.atan2(hAlto - hBajo, ax1 - ax0); a.add(te);
  const ga = marca(a); ga.userData.cod = 'Materiales peligrosos al sur (Y 0,82–3,61)'; escena.add(reg(ga, 'edif', F.almacen));
  ROT.push({ texto: 'Almacén general', X: 63.7, Y: 6.3, h: 4.6, capa: 'edif' });
  
  const rs = new THREE.Group();
  rs.add(losa([[0.14, 45.53], [1.46, 45.53], [1.46, 52.82], [0.14, 52.82]], -0.02, 0.1, M.concretoNuevo));
  for (const y of [45.6, 47.4, 49.2, 51.0, 52.75]) for (const x of [0.2, 1.4]) rs.add(cil(0.03, 0.03, 2.2, M.acero, 8, x, 0.1 + 1.1, -y));
  const tr2 = caja(1.6, 0.04, 7.6, M.techoZ, 0.8, 2.35, -49.18); tr2.rotation.z = 0.08; rs.add(tr2);
  for (let k = 0; k < 4; k++) rs.add(cil(0.25, 0.22, 0.85, [M.verde, M.amarillo, M.rojo, M.aceroOsc][k], 14, 0.8, 0.1 + 0.425, -(46.4 + k * 1.8)));
  escena.add(reg(marca(rs), 'edif', F.residuos));
  
  const ci = new THREE.Group();
  const tq = cil(0.6, 0.6, 1.9, M.pvc, 20, 15.93, -1.1, -48.07); tq.userData.subsuelo = true; CTX.subsuelo.push(tq); ci.add(tq);
  ci.add(cil(0.35, 0.35, 0.08, M.concretoNuevo, 18, 15.93, 0.04, -48.07));
  ci.add(caja(1.0, 1.9, 1.0, M.muro, 17.03, 0.95, -48.07), caja(1.1, 0.1, 1.1, M.concretoNuevo, 17.03, 1.95, -48.07));
  escena.add(reg(marca(ci), 'edif', F.cisterna));
  const se = new THREE.Group();
  for (const [y, n] of [[51.62, 'Tanque séptico 1300 L'], [46.22, 'Tanque recolector 1300 L']]) {
    const t = cil(0.575, 0.575, 1.5, M.negro, 20, 22.61, -0.58 - 0.75, -y); t.userData.subsuelo = true; CTX.subsuelo.push(t); se.add(t);
    se.add(cil(0.25, 0.25, 0.07, M.concretoNuevo, 16, 22.61, 0.035, -y));
  }
  escena.add(reg(marca(se), 'edif', F.septico));
}

function cercoPerimetrico(escena) {
  const g = new THREE.Group(); const hP = 2.5, hC = 3.2;
  const tramos = [[[0, 0], [67, 0]], [[67, 0], [67, 56]], [[67, 56], [11.3, 56]], [[10.0, 56], [8.7, 56]], [[3.7, 56], [0, 56]], [[0, 56], [0, 0]]];
  const geoC = [], geoP = [], anillos = [];
  for (const [a, b] of tramos) {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]); const n = Math.max(1, Math.round(L / 2.13)); const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    for (let k = 0; k <= n; k++) { const X = a[0] + ((b[0] - a[0]) * k) / n, Y = a[1] + ((b[1] - a[1]) * k) / n; geoC.push(new THREE.BoxGeometry(0.14, hC, 0.14).translate(X, hC / 2, -Y)); }
    for (let k = 0; k < n; k++) {
      const X = a[0] + ((b[0] - a[0]) * (k + 0.5)) / n, Y = a[1] + ((b[1] - a[1]) * (k + 0.5)) / n;
      for (let f = 0; f < 5; f++) { const pl = new THREE.BoxGeometry(L / n - 0.15, 0.49, 0.04); pl.rotateY(ang); pl.translate(X, 0.25 + f * 0.5, -Y); geoP.push(pl); }
    }
    const nA = Math.round(L / 0.32);
    for (let k = 0; k <= nA; k++) anillos.push([a[0] + ((b[0] - a[0]) * k) / nA, a[1] + ((b[1] - a[1]) * k) / nA, ang]);
  }
  g.add(fusion(geoC, M.concretoNuevo), fusion(geoP, M.prefab));
  const anillo = new THREE.TorusGeometry(0.228, 0.004, 3, 14);
  const im = new THREE.InstancedMesh(anillo, M.acero, anillos.length); const q = new THREE.Object3D();
  anillos.forEach(([X, Y, ang], i) => { q.position.set(X, hC - 0.05, -Y); q.rotation.set(0, ang + Math.PI / 2 + (i % 2 ? 0.25 : -0.25), 0); q.updateMatrix(); im.setMatrixAt(i, q.matrix); });
  g.add(im);
  escena.add(reg(g, 'cerco', F.cerco));
  const pt = new THREE.Group();
  for (const x of [3.7, 8.7]) pt.add(caja(0.4, 2.7, 0.4, M.concretoNuevo, x, 1.35, -56));
  for (const x of [10.0, 11.3]) pt.add(caja(0.3, 2.7, 0.3, M.concretoNuevo, x, 1.35, -56));
  for (const [x0, x1] of [[3.9, 6.2], [6.2, 8.5]]) { pt.add(caja(x1 - x0 - 0.02, 2.45, 0.05, M.puerta, (x0 + x1) / 2, 0.05 + 1.225, -56)); pt.add(caja(x1 - x0, 0.06, 0.07, M.aceroOsc, (x0 + x1) / 2, 0.05 + 2.45, -56)); }
  pt.add(caja(1.0, 2.1, 0.05, M.puerta, 10.65, 1.05, -56));
  escena.add(reg(marca(pt), 'cerco', F.porton));
  ROT.push({ texto: 'Ingreso', X: 6.2, Y: 57.5, h: 3.2, capa: 'cerco' });
}
