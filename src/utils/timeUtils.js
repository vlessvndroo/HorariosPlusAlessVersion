/**
 * Convierte un string de hora en formato HH:MM (24h) a decimal.
 * Ejemplo: "07:30" -> 7.5
 */
export function timeToDec(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 7.0;
  const [h, m] = timeStr.split(':').map(Number);
  return (isNaN(h) ? 7 : h) + (isNaN(m) ? 0 : m) / 60;
}

/**
 * Convierte un número decimal a un string de hora en formato HH:MM (24h).
 * Ejemplo: 7.5 -> "07:30"
 */
export function decToTime(dec) {
  const h = Math.floor(dec);
  const m = Math.round((dec - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Verifica si dos slots o intervalos de tiempo se solapan en el mismo día.
 */
export function slotsOverlap(s1, s2) {
  if (!s1 || !s2 || s1.day !== s2.day) return false;
  const start1 = timeToDec(s1.start);
  const end1 = timeToDec(s1.end);
  const start2 = timeToDec(s2.start);
  const end2 = timeToDec(s2.end);
  return Math.max(start1, start2) < Math.min(end1, end2);
}

/**
 * Verifica si una lista de slots candidatos entra en conflicto con las materias ya ubicadas.
 */
export function checkConflict(candidateSlots, placedItems) {
  for (const item of placedItems) {
    if (item.isVirtual) continue;
    for (const slot1 of candidateSlots) {
      for (const slot2 of item.schedule) {
        if (slotsOverlap(slot1, slot2)) {
          return true;
        }
      }
    }
  }
  return false;
}
