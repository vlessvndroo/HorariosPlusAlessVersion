import { PALETTES } from '../constants/palettes.js';
import { SUNDAY_ROUND_SLOTS } from '../constants/schedule.js';
import { checkConflict, slotsOverlap } from '../utils/timeUtils.js';

/**
 * Crea una estructura de oferta por defecto según la modalidad de la materia.
 */
export function createDefaultOfferForMode(mode) {
  if (mode === 'virtual') {
    return {
      mode: 'virtual',
      virtualSections: [
        { nrc: '', sectionName: 'Sec V1', prof: '' }
      ]
    };
  } else if (mode === 'theory_practice') {
    return {
      mode: 'theory_practice',
      theoryGroups: [
        {
          id: 'tg-' + Date.now(),
          theoryNrc: '',
          theorySectionName: 'Teoría 1',
          theoryProf: '',
          theorySchedule: [{ day: 'LUN', start: '07:00', end: '09:00' }],
          practices: [
            {
              id: 'p-' + Date.now(),
              practiceNrc: '',
              practiceSectionName: 'Práctica 1',
              practiceProf: '',
              practiceSchedule: [{ day: 'MIE', start: '07:00', end: '09:00' }]
            }
          ]
        }
      ]
    };
  } else {
    return {
      mode: 'standard',
      sections: [
        {
          nrc: '',
          sectionName: 'Sec 1',
          prof: '',
          schedule: [
            { day: 'LUN', start: '07:00', end: '09:00' }
          ]
        }
      ]
    };
  }
}

/**
 * Motor de resolución de combinaciones de horario mediante backtracking.
 * Filtra choques presenciales y distribuye materias virtuales en Domingo.
 */
export function computeCombinations(selectedCourses, courseOffer) {
  if (!selectedCourses || selectedCourses.length === 0) {
    return { combinations: [], missingCourses: [] };
  }

  const missing = [];
  const activeCourseOptions = [];

  selectedCourses.forEach((c, idx) => {
    const offer = courseOffer[c.id] || { mode: c.mode || 'standard' };
    const mode = offer.mode || c.mode || 'standard';
    const color = PALETTES[idx % PALETTES.length];
    const courseBase = { courseId: c.id, courseName: c.name, color, mode };

    if (mode === 'virtual') {
      const sections = (offer.virtualSections || []).filter(s => s.nrc && s.nrc.trim() !== '');
      if (sections.length === 0) {
        missing.push({ ...c, reason: 'Falta ingresar NRC virtual' });
      } else {
        const options = sections.map(sec => ({
          ...courseBase,
          type: 'virtual',
          nrc: sec.nrc,
          sectionName: sec.sectionName,
          prof: sec.prof,
          isVirtual: true,
          schedule: []
        }));
        activeCourseOptions.push({ course: c, options });
      }
    } else if (mode === 'theory_practice') {
      const groups = offer.theoryGroups || [];
      const validOptions = [];

      groups.forEach(tg => {
        if (!tg.theoryNrc || tg.theoryNrc.trim() === '') return;
        const tSched = (tg.theorySchedule || []).filter(s => s && s.day && s.start && s.end);
        if (tSched.length === 0) return;

        (tg.practices || []).forEach(pr => {
          if (!pr.practiceNrc || pr.practiceNrc.trim() === '') return;
          const pSched = (pr.practiceSchedule || []).filter(s => s && s.day && s.start && s.end);
          if (pSched.length === 0) return;

          const combinedSlots = [...tSched, ...pSched];
          let selfConflict = false;
          for (let i = 0; i < combinedSlots.length; i++) {
            for (let j = i + 1; j < combinedSlots.length; j++) {
              if (slotsOverlap(combinedSlots[i], combinedSlots[j])) {
                selfConflict = true;
                break;
              }
            }
            if (selfConflict) break;
          }

          if (!selfConflict) {
            validOptions.push({
              ...courseBase,
              type: 'theory_practice',
              theoryNrc: tg.theoryNrc,
              theorySectionName: tg.theorySectionName,
              theoryProf: tg.theoryProf,
              theorySchedule: tSched,
              practiceNrc: pr.practiceNrc,
              practiceSectionName: pr.practiceSectionName,
              practiceProf: pr.practiceProf,
              practiceSchedule: pSched,
              schedule: combinedSlots
            });
          }
        });
      });

      if (validOptions.length === 0) {
        missing.push({ ...c, reason: 'Falta ingresar NRC de Teoría o Práctica' });
      } else {
        activeCourseOptions.push({ course: c, options: validOptions });
      }
    } else {
      const sections = (offer.sections || []).filter(s => s.nrc && s.nrc.trim() !== '' && s.schedule && s.schedule.length > 0);
      if (sections.length === 0) {
        missing.push({ ...c, reason: 'Falta ingresar NRC y horario' });
      } else {
        const options = sections.map(sec => ({
          ...courseBase,
          type: 'standard',
          nrc: sec.nrc,
          sectionName: sec.sectionName,
          prof: sec.prof,
          schedule: sec.schedule
        }));
        activeCourseOptions.push({ course: c, options });
      }
    }
  });

  if (missing.length > 0) {
    return { combinations: [], missingCourses: missing };
  }

  const rawCombinations = [];

  function backtrack(idx, currentPlaced) {
    if (idx === activeCourseOptions.length) {
      rawCombinations.push([...currentPlaced]);
      return;
    }

    const { options } = activeCourseOptions[idx];
    for (const opt of options) {
      if (opt.isVirtual || !checkConflict(opt.schedule, currentPlaced)) {
        currentPlaced.push(opt);
        backtrack(idx + 1, currentPlaced);
        currentPlaced.pop();
      }
    }
  }

  backtrack(0, []);

  // Asignación secuencial de materias virtuales en Domingo con horas redondas
  const processedCombinations = rawCombinations.map(comb => {
    let virtualIdx = 0;
    return comb.map(item => {
      if (item.isVirtual) {
        const slotTime = SUNDAY_ROUND_SLOTS[virtualIdx % SUNDAY_ROUND_SLOTS.length];
        virtualIdx++;
        return {
          ...item,
          schedule: [
            { day: 'DOM', start: slotTime.start, end: slotTime.end, isVirtual: true }
          ]
        };
      }
      return item;
    });
  });

  return { combinations: processedCombinations, missingCourses: [] };
}
