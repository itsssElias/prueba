export function hhmmssToSeconds(hhmmss) {
  if (!hhmmss) return NaN;
  const [h, m, s] = hhmmss.split(':').map(Number);
  if ([h,m,s].some(n => isNaN(n))) return NaN;
  return h * 3600 + m * 60 + s;
}
export function secondsToHours(sec) { return sec / 3600; }

export function calcIMC(pesoKg, estaturaM) {
  if (pesoKg <= 0 || estaturaM <= 0) return 0;
  return pesoKg / (estaturaM * estaturaM);
}
export function calcCalories(factor, pesoKg, horas) {
  if (factor <= 0 || pesoKg <= 0 || horas <= 0) return 0;
  return factor * pesoKg * horas;
}
export function fmt(n, dec = 2) {
  const x = Number(n);
  if (!Number.isFinite(x)) return '—'; // o devuelve '-' si prefieres
  return x.toFixed(dec);
}


export function metForCycling(v) {
  v = Number(v)||0;
  if (v<16) return 6; if (v<19) return 8; if (v<22) return 10; if (v<25) return 12; return 15;
}
export function metForRunning(v) {
  v = Number(v)||0;
  if (v<7) return 7; if (v<8.5) return 9; if (v<10) return 9.8;
  if (v<12) return 11; if (v<14) return 13.5; if (v<16) return 15;
  return 16;
}
export function metForWalkingIntensity(i) {
  i = (i||'').toLowerCase();
  if(i==='suave') return 3; if(i==='moderada') return 4.5; if(i==='vigorosa') return 5.5;
  return 0;
}
export function metForSwimmingIntensity(i) {
  i = (i||'').toLowerCase();
  if(i==='suave') return 6; if(i==='moderada') return 7; if(i==='vigorosa') return 9.3;
  return 0;
}

export const TIPOS_ACTIVIDAD = ['Ciclismo','Correr','Caminata','Natación','Otro'];
