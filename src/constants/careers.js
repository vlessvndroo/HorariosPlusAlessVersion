import { CURRICULUM_INFORMATICA } from '../data/curricula/informatica.js';
import { CURRICULUM_PSICOLOGIA } from '../data/curricula/psicologia.js';

export const CAREERS = {
  informatica: {
    id: 'informatica',
    name: 'Ingeniería Informática',
    shortName: 'Informática',
    icon: '💻',
    faculty: 'Facultad de Ingeniería',
    description: 'Plan oficial de 8 semestres para Ingeniería Informática en la UCAB.',
    curriculum: CURRICULUM_INFORMATICA
  },
  psicologia: {
    id: 'psicologia',
    name: 'Psicología',
    shortName: 'Psicología',
    icon: '🧠',
    faculty: 'Facultad de Humanidades y Educación',
    description: 'Plan de estudios oficial de 8 semestres para la Escuela de Psicología en la UCAB.',
    curriculum: CURRICULUM_PSICOLOGIA
  }
};
