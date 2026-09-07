// HORAS REDONDAS EN FORMATO 24 HORAS (SIN FRACCIONES NI AM/PM)
export const ROUND_HOURS_24H = [
  '07:00', '08:00', '09:00', '10:00',
  '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00',
  '19:00', '20:00', '21:00', '22:00'
];

export const DAYS = [
  { key: 'LUN', label: 'Lunes', short: 'Lun' },
  { key: 'MAR', label: 'Martes', short: 'Mar' },
  { key: 'MIE', label: 'Miércoles', short: 'Mié' },
  { key: 'JUE', label: 'Jueves', short: 'Jue' },
  { key: 'VIE', label: 'Viernes', short: 'Vie' },
  { key: 'SAB', label: 'Sábado', short: 'Sáb' },
  { key: 'DOM', label: 'Domingo (Virtuales)', short: 'Dom (Virtual)' }
];

// Asignación secuencial de materias virtuales en Domingo con horas redondas
export const SUNDAY_ROUND_SLOTS = [
  { start: '07:00', end: '09:00' },
  { start: '09:00', end: '11:00' },
  { start: '11:00', end: '13:00' },
  { start: '13:00', end: '15:00' },
  { start: '15:00', end: '17:00' },
  { start: '17:00', end: '19:00' }
];
