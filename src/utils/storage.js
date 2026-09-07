const STORAGE_VERSION = 'v7';

/**
 * Carga los datos de persistencia local para una carrera dada.
 */
export function loadCareerData(careerId) {
  if (!careerId) return { selectedCourses: [], customCourses: [], courseOffer: {} };

  try {
    const savedCourses = localStorage.getItem(`horarios_courses_${careerId}_${STORAGE_VERSION}`);
    const savedCustom = localStorage.getItem(`horarios_custom_${careerId}_${STORAGE_VERSION}`);
    const savedOffer = localStorage.getItem(`horarios_offer_${careerId}_${STORAGE_VERSION}`);

    return {
      selectedCourses: savedCourses ? JSON.parse(savedCourses) : [],
      customCourses: savedCustom ? JSON.parse(savedCustom) : [],
      courseOffer: savedOffer ? JSON.parse(savedOffer) : {}
    };
  } catch (error) {
    console.error('Error al cargar datos desde localStorage:', error);
    return { selectedCourses: [], customCourses: [], courseOffer: {} };
  }
}

/**
 * Guarda las materias seleccionadas de una carrera.
 */
export function saveSelectedCourses(careerId, selectedCourses) {
  if (!careerId) return;
  try {
    localStorage.setItem(`horarios_courses_${careerId}_${STORAGE_VERSION}`, JSON.stringify(selectedCourses));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Guarda las materias personalizadas de una carrera.
 */
export function saveCustomCourses(careerId, customCourses) {
  if (!careerId) return;
  try {
    localStorage.setItem(`horarios_custom_${careerId}_${STORAGE_VERSION}`, JSON.stringify(customCourses));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Guarda las ofertas (secciones, NRCs, horarios) de una carrera.
 */
export function saveCourseOffer(careerId, courseOffer) {
  if (!careerId) return;
  try {
    localStorage.setItem(`horarios_offer_${careerId}_${STORAGE_VERSION}`, JSON.stringify(courseOffer));
  } catch (e) {
    console.error(e);
  }
}

/**
 * Limpia todos los datos guardados para una carrera (incluyendo versiones anteriores).
 */
export function clearCareerData(careerId) {
  if (!careerId) return;
  const versions = ['v7', 'v6'];
  versions.forEach(v => {
    localStorage.removeItem(`horarios_courses_${careerId}_${v}`);
    localStorage.removeItem(`horarios_offer_${careerId}_${v}`);
    localStorage.removeItem(`horarios_custom_${careerId}_${v}`);
  });
}
