import React, { useState, useMemo, useEffect } from 'react';
import { CAREERS } from './constants/careers';
import { loadCareerData, saveSelectedCourses, saveCustomCourses, saveCourseOffer, clearCareerData } from './utils/storage';
import { timeToDec, decToTime } from './utils/timeUtils';
import { exportScheduleImage, copyNrcList } from './utils/exportUtils';
import { computeCombinations, createDefaultOfferForMode } from './services/schedulerEngine';

import { CareerSelectScreen } from './components/views/CareerSelectScreen';
import { Header } from './components/common/Header';
import { TabNav } from './components/common/TabNav';
import { CourseSelectionTab } from './components/tabs/CourseSelectionTab';
import { NrcEditorTab } from './components/tabs/NrcEditorTab';
import { CombinationsTab } from './components/tabs/CombinationsTab';
import { ScheduleCalendar } from './components/calendar/ScheduleCalendar';

export function App() {
  // Estado de Carrera Activa (inicia en null para solicitar carrera)
  const [activeCareerId, setActiveCareerId] = useState(null);

  // Estado por carrera activa
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [customCourses, setCustomCourses] = useState([]);
  const [courseOffer, setCourseOffer] = useState({});

  const [activeTab, setActiveTab] = useState('courses');
  const [mobileCombinationsSubTab, setMobileCombinationsSubTab] = useState('calendar'); // 'calendar' | 'details'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);

  // Guardar datos específicos de la carrera activa
  useEffect(() => {
    if (activeCareerId) {
      saveSelectedCourses(activeCareerId, selectedCourses);
    }
  }, [selectedCourses, activeCareerId]);

  useEffect(() => {
    if (activeCareerId) {
      saveCustomCourses(activeCareerId, customCourses);
    }
  }, [customCourses, activeCareerId]);

  useEffect(() => {
    if (activeCareerId) {
      saveCourseOffer(activeCareerId, courseOffer);
    }
  }, [courseOffer, activeCareerId]);

  // Selección de carrera
  const selectCareer = (careerId) => {
    const data = loadCareerData(careerId);
    setActiveCareerId(careerId);
    setSelectedCourses(data.selectedCourses);
    setCustomCourses(data.customCourses);
    setCourseOffer(data.courseOffer);
    setCurrentIndex(0);
    setActiveTab('courses');
    setMobileCombinationsSubTab('calendar');
  };

  const currentCareer = activeCareerId ? CAREERS[activeCareerId] : null;

  // Catálogo completo de materias
  const allAvailableCourses = useMemo(() => {
    if (!currentCareer) return [];
    const list = [];
    currentCareer.curriculum.forEach(sem => {
      sem.courses.forEach(c => list.push({ ...c, semester: sem.semester, isCustom: false }));
    });
    customCourses.forEach(c => list.push({ ...c, semester: 'Personalizada', isCustom: true }));
    return list;
  }, [currentCareer, customCourses]);

  // Creación de materia personalizada
  const handleCreateCustomCourse = ({ code, name, mode }) => {
    const newCourse = {
      id: code,
      name,
      defaultMode: mode,
      isCustom: true
    };
    setCustomCourses(prev => [...prev, newCourse]);
    setSelectedCourses(prev => [...prev, { ...newCourse, mode }]);
    setCourseOffer(prev => ({
      ...prev,
      [newCourse.id]: createDefaultOfferForMode(mode)
    }));
  };

  // Alternar selección de materia
  const toggleCourse = (course) => {
    const exists = selectedCourses.some(c => c.id === course.id);
    if (exists) {
      setSelectedCourses(prev => prev.filter(c => c.id !== course.id));
    } else {
      const mode = course.defaultMode || 'standard';
      setSelectedCourses(prev => [...prev, { ...course, mode }]);
      if (!courseOffer[course.id]) {
        setCourseOffer(prev => ({
          ...prev,
          [course.id]: createDefaultOfferForMode(mode)
        }));
      }
    }
  };

  // Cambio de modalidad de la materia
  const changeCourseMode = (courseId, newMode) => {
    setSelectedCourses(prev => prev.map(c => c.id === courseId ? { ...c, mode: newMode } : c));
    setCourseOffer(prev => {
      const current = prev[courseId];
      if (current && current.mode === newMode) return prev;
      return {
        ...prev,
        [courseId]: createDefaultOfferForMode(newMode)
      };
    });
  };

  // --- Métodos de Sección Estándar ---
  const addStandardSection = (courseId) => {
    const offer = courseOffer[courseId] || createDefaultOfferForMode('standard');
    const sections = offer.sections || [];
    const nextNum = sections.length + 1;
    setCourseOffer(prev => ({
      ...prev,
      [courseId]: {
        ...offer,
        sections: [
          ...sections,
          {
            nrc: '',
            sectionName: `Sec ${nextNum}`,
            prof: '',
            schedule: [{ day: 'LUN', start: '07:00', end: '09:00' }]
          }
        ]
      }
    }));
  };

  const removeStandardSection = (courseId, sIdx) => {
    const offer = courseOffer[courseId];
    const sections = (offer.sections || []).filter((_, idx) => idx !== sIdx);
    setCourseOffer(prev => ({ ...prev, [courseId]: { ...offer, sections } }));
  };

  const updateStandardSectionField = (courseId, sIdx, field, value) => {
    const offer = { ...courseOffer[courseId] };
    offer.sections[sIdx][field] = value;
    setCourseOffer(prev => ({ ...prev, [courseId]: offer }));
  };

  const addStandardSlot = (courseId, sIdx) => {
    const offer = { ...courseOffer[courseId] };
    offer.sections[sIdx].schedule.push({ day: 'MIE', start: '07:00', end: '09:00' });
    setCourseOffer(prev => ({ ...prev, [courseId]: offer }));
  };

  const removeStandardSlot = (courseId, sIdx, bIdx) => {
    const offer = { ...courseOffer[courseId] };
    offer.sections[sIdx].schedule = offer.sections[sIdx].schedule.filter((_, idx) => idx !== bIdx);
    setCourseOffer(prev => ({ ...prev, [courseId]: offer }));
  };

  const updateStandardSlot = (courseId, sIdx, bIdx, field, value) => {
    const offer = { ...courseOffer[courseId] };
    offer.sections[sIdx].schedule[bIdx][field] = value;
    setCourseOffer(prev => ({ ...prev, [courseId]: offer }));
  };

  // --- Métodos de Teoría + Práctica ---
  const addTheoryGroup = (courseId) => {
    const offer = courseOffer[courseId] || createDefaultOfferForMode('theory_practice');
    const groups = offer.theoryGroups || [];
    const nextNum = groups.length + 1;
    setCourseOffer(prev => ({
      ...prev,
      [courseId]: {
        ...offer,
        theoryGroups: [
          ...groups,
          {
            id: 'tg-' + Date.now(),
            theoryNrc: '',
            theorySectionName: `Teoría ${nextNum}`,
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
      }
    }));
  };

  const removeTheoryGroup = (courseId, tgIdx) => {
    const offer = courseOffer[courseId];
    const groups = (offer.theoryGroups || []).filter((_, idx) => idx !== tgIdx);
    setCourseOffer(prev => ({ ...prev, [courseId]: { ...offer, theoryGroups: groups } }));
  };

  const updateTheoryField = (courseId, tgIdx, field, value) => {
    const offer = { ...courseOffer[courseId] };
    offer.theoryGroups[tgIdx][field] = value;
    setCourseOffer(prev => ({ ...prev, [courseId]: offer }));
  };

  const addTheorySlot = (courseId, tgIdx) => {
    const offer = { ...courseOffer[courseId] };
    const tg = offer.theoryGroups[tgIdx];
    if (!tg.theorySchedule) tg.theorySchedule = [];
    tg.theorySchedule.push({ day: 'MIE', start: '07:00', end: '09:00' });
    setCourseOffer(prev => ({ ...prev, [courseId]: offer }));
  };

  const removeTheorySlot = (courseId, tgIdx, slotIdx) => {
    const offer = { ...courseOffer[courseId] };
    const tg = offer.theoryGroups[tgIdx];
    tg.theorySchedule = (tg.theorySchedule || []).filter((_, idx) => idx !== slotIdx);
    setCourseOffer(prev => ({ ...prev, [courseId]: offer }));
  };

  const updateTheorySlot = (courseId, tgIdx, slotIdx, field, value) => {
    const offer = { ...courseOffer[courseId] };
    const tg = offer.theoryGroups[tgIdx];
    if (!tg.theorySchedule) tg.theorySchedule = [];
    tg.theorySchedule[slotIdx] = { ...tg.theorySchedule[slotIdx], [field]: value };
    setCourseOffer(prev => ({ ...prev, [courseId]: offer }));
  };

  const addPracticeToTheory = (courseId, tgIdx) => {
    const offer = { ...courseOffer[courseId] };
    const practices = offer.theoryGroups[tgIdx].practices || [];
    const nextNum = practices.length + 1;
    practices.push({
      id: 'p-' + Date.now(),
      practiceNrc: '',
      practiceSectionName: `Práctica ${nextNum}`,
      practiceProf: '',
      practiceSchedule: [{ day: 'VIE', start: '07:00', end: '09:00' }]
    });
    offer.theoryGroups[tgIdx].practices = practices;
    setCourseOffer(prev => ({ ...prev, [courseId]: offer }));
  };

  const updatePracticeField = (courseId, tgIdx, prIdx, field, value) => {
    const offer = { ...courseOffer[courseId] };
    offer.theoryGroups[tgIdx].practices[prIdx][field] = value;
    setCourseOffer(prev => ({ ...prev, [courseId]: offer }));
  };

  const removePracticeFromTheory = (courseId, tgIdx, prIdx) => {
    const offer = { ...courseOffer[courseId] };
    offer.theoryGroups[tgIdx].practices = offer.theoryGroups[tgIdx].practices.filter((_, idx) => idx !== prIdx);
    setCourseOffer(prev => ({ ...prev, [courseId]: offer }));
  };

  const addPracticeSlot = (courseId, tgIdx, prIdx) => {
    const offer = { ...courseOffer[courseId] };
    const pr = offer.theoryGroups[tgIdx].practices[prIdx];
    if (!pr.practiceSchedule) pr.practiceSchedule = [];
    pr.practiceSchedule.push({ day: 'VIE', start: '07:00', end: '09:00' });
    setCourseOffer(prev => ({ ...prev, [courseId]: offer }));
  };

  const removePracticeSlot = (courseId, tgIdx, prIdx, slotIdx) => {
    const offer = { ...courseOffer[courseId] };
    const pr = offer.theoryGroups[tgIdx].practices[prIdx];
    pr.practiceSchedule = (pr.practiceSchedule || []).filter((_, idx) => idx !== slotIdx);
    setCourseOffer(prev => ({ ...prev, [courseId]: offer }));
  };

  const updatePracticeSlot = (courseId, tgIdx, prIdx, slotIdx, field, value) => {
    const offer = { ...courseOffer[courseId] };
    const pr = offer.theoryGroups[tgIdx].practices[prIdx];
    if (!pr.practiceSchedule) pr.practiceSchedule = [];
    pr.practiceSchedule[slotIdx] = { ...pr.practiceSchedule[slotIdx], [field]: value };
    setCourseOffer(prev => ({ ...prev, [courseId]: offer }));
  };

  // --- Métodos de Modo Virtual ---
  const addVirtualSection = (courseId) => {
    const offer = courseOffer[courseId] || createDefaultOfferForMode('virtual');
    const list = offer.virtualSections || [];
    const nextNum = list.length + 1;
    setCourseOffer(prev => ({
      ...prev,
      [courseId]: {
        ...offer,
        virtualSections: [
          ...list,
          { nrc: '', sectionName: `Sec V${nextNum}`, prof: '' }
        ]
      }
    }));
  };

  const removeVirtualSection = (courseId, vIdx) => {
    const offer = courseOffer[courseId];
    const list = (offer.virtualSections || []).filter((_, idx) => idx !== vIdx);
    setCourseOffer(prev => ({ ...prev, [courseId]: { ...offer, virtualSections: list } }));
  };

  const updateVirtualSection = (courseId, vIdx, field, value) => {
    const offer = { ...courseOffer[courseId] };
    offer.virtualSections[vIdx][field] = value;
    setCourseOffer(prev => ({ ...prev, [courseId]: offer }));
  };

  // Reiniciar datos de la carrera activa
  const resetAllData = () => {
    if (confirm(`¿Deseas limpiar todas las materias y NRCs cargados para ${currentCareer.name}?`)) {
      setSelectedCourses([]);
      setCourseOffer({});
      setCustomCourses([]);
      setCurrentIndex(0);
      clearCareerData(activeCareerId);
      setActiveTab('courses');
    }
  };

  // Cálculo de combinaciones
  const calculationResult = useMemo(() => {
    return computeCombinations(selectedCourses, courseOffer);
  }, [selectedCourses, courseOffer]);

  const combinations = calculationResult.combinations;
  const missingCourses = calculationResult.missingCourses;

  useEffect(() => {
    if (currentIndex >= combinations.length) {
      setCurrentIndex(0);
    }
  }, [combinations.length, currentIndex]);

  const currentCombination = combinations[currentIndex] || [];

  // Copiar NRCs al portapapeles
  const handleCopyNrcList = () => {
    copyNrcList(currentCombination, currentCareer?.name, () => {
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2500);
    });
  };

  // Exportar horario a PNG
  const handleExportImage = () => {
    exportScheduleImage(
      'schedule-calendar-capture',
      currentCareer?.shortName,
      currentIndex,
      setIsExportingImage
    );
  };

  // Estadísticas de la combinación actual
  const combinationStats = useMemo(() => {
    if (!currentCombination.length) return null;
    const daysWithClasses = new Set();
    let earliest = 24;
    let latest = 0;
    let virtualCount = 0;

    currentCombination.forEach(c => {
      if (c.isVirtual) {
        virtualCount++;
        return;
      }
      (c.schedule || []).forEach(s => {
        daysWithClasses.add(s.day);
        const sDec = timeToDec(s.start);
        const eDec = timeToDec(s.end);
        if (sDec < earliest) earliest = sDec;
        if (eDec > latest) latest = eDec;
      });
    });

    const hasSaturday = currentCombination.some(item => (item.schedule || []).some(s => s.day === 'SAB'));
    const totalPresentialDays = hasSaturday ? 6 : 5;
    const freeDaysCount = Math.max(0, totalPresentialDays - daysWithClasses.size);

    return {
      daysCount: daysWithClasses.size,
      freeDaysCount,
      virtualCount,
      earliest: earliest < 24 ? decToTime(earliest) : '--:--',
      latest: latest > 0 ? decToTime(latest) : '--:--',
      coursesCount: currentCombination.length
    };
  }, [currentCombination]);

  // Pantalla inicial de bienvenida y selección de carrera
  if (!activeCareerId) {
    return <CareerSelectScreen onSelectCareer={selectCareer} />;
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-[#0b0f19] font-sans text-slate-100">
      {/* BARRA LATERAL (Desktop: panel lateral izquierdo 480px; Móvil: pantalla completa en Pasos 1 y 2, o en Detalle de Paso 3) */}
      <aside
        className={`no-print flex-col bg-[#0f172a]/95 backdrop-blur-xl z-20 border-r border-slate-800/80 ${
          activeTab === 'combinations'
            ? mobileCombinationsSubTab === 'details'
              ? 'flex w-full h-full lg:w-[480px] xl:w-[500px] lg:flex-shrink-0'
              : 'hidden lg:flex lg:w-[480px] xl:w-[500px] lg:flex-shrink-0'
            : 'flex w-full h-full lg:w-[480px] xl:w-[500px] lg:flex-shrink-0'
        }`}
      >
        {/* Encabezado con selector de carrera y reset */}
        <Header
          currentCareer={currentCareer}
          onResetAllData={resetAllData}
          onChangeCareer={() => setActiveCareerId(null)}
        />

        {/* Pestañas de Navegación de los 3 pasos */}
        <TabNav
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'combinations') setMobileCombinationsSubTab('calendar');
          }}
          selectedCount={selectedCourses.length}
          combinationsCount={combinations.length}
        />

        {/* Selector de sub-vista móvil en Paso 3: Alternar entre Horario y Resumen de NRCs */}
        {activeTab === 'combinations' && (
          <div className="lg:hidden px-3 py-2 bg-slate-950/90 border-b border-slate-800 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setMobileCombinationsSubTab('calendar')}
              className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 bg-slate-900 border border-slate-800 text-slate-300 cursor-pointer"
            >
              <span>📅 Ver Horario</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileCombinationsSubTab('details')}
              className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 bg-indigo-600 text-white shadow-sm cursor-pointer"
            >
              <span>📋 Resumen y NRCs</span>
            </button>
          </div>
        )}

        {/* Contenido de la pestaña activa */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
          {activeTab === 'courses' && (
            <CourseSelectionTab
              currentCareer={currentCareer}
              allAvailableCourses={allAvailableCourses}
              selectedCourses={selectedCourses}
              customCourses={customCourses}
              onToggleCourse={toggleCourse}
              onCreateCustomCourse={handleCreateCustomCourse}
              onGoToNrcs={() => setActiveTab('nrcs')}
            />
          )}

          {activeTab === 'nrcs' && (
            <NrcEditorTab
              currentCareer={currentCareer}
              selectedCourses={selectedCourses}
              courseOffer={courseOffer}
              combinationsCount={combinations.length}
              onChangeCourseMode={changeCourseMode}
              onGoToCourses={() => setActiveTab('courses')}
              onGoToCombinations={() => {
                setActiveTab('combinations');
                setMobileCombinationsSubTab('calendar');
              }}
              // Standard
              onAddStandardSection={addStandardSection}
              onRemoveStandardSection={removeStandardSection}
              onUpdateStandardSectionField={updateStandardSectionField}
              onAddStandardSlot={addStandardSlot}
              onRemoveStandardSlot={removeStandardSlot}
              onUpdateStandardSlot={updateStandardSlot}
              // Theory & Practice
              onAddTheoryGroup={addTheoryGroup}
              onRemoveTheoryGroup={removeTheoryGroup}
              onUpdateTheoryField={updateTheoryField}
              onAddTheorySlot={addTheorySlot}
              onRemoveTheorySlot={removeTheorySlot}
              onUpdateTheorySlot={updateTheorySlot}
              onAddPracticeToTheory={addPracticeToTheory}
              onUpdatePracticeField={updatePracticeField}
              onRemovePracticeFromTheory={removePracticeFromTheory}
              onAddPracticeSlot={addPracticeSlot}
              onRemovePracticeSlot={removePracticeSlot}
              onUpdatePracticeSlot={updatePracticeSlot}
              // Virtual
              onAddVirtualSection={addVirtualSection}
              onRemoveVirtualSection={removeVirtualSection}
              onUpdateVirtualSection={updateVirtualSection}
            />
          )}

          {activeTab === 'combinations' && (
            <CombinationsTab
              currentCareer={currentCareer}
              combinations={combinations}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              currentCombination={currentCombination}
              missingCourses={missingCourses}
              combinationStats={combinationStats}
              copiedNotification={copiedNotification}
              onCopyNrcList={handleCopyNrcList}
              onGoToNrcs={() => setActiveTab('nrcs')}
            />
          )}
        </div>

        {/* Pie de Barra Lateral */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>{selectedCourses.length} materias seleccionadas</span>
          <span>{currentCareer.shortName} • 24h</span>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL: CALENDARIO */}
      {/* En desktop siempre visible al lado; en móvil visible cuando activeTab === 'combinations' y mobileCombinationsSubTab === 'calendar' */}
      <div
        className={`flex-1 flex-col h-full overflow-hidden ${
          activeTab === 'combinations' && mobileCombinationsSubTab === 'calendar'
            ? 'flex w-full'
            : 'hidden lg:flex'
        }`}
      >
        {/* Barra de navegación superior exclusiva en Móvil cuando se visualiza el Horario */}
        <div className="lg:hidden flex flex-col bg-[#0f172a]/95 border-b border-slate-800/80">
          <Header
            currentCareer={currentCareer}
            onResetAllData={resetAllData}
            onChangeCareer={() => setActiveCareerId(null)}
          />
          <TabNav
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              if (tab === 'combinations') setMobileCombinationsSubTab('calendar');
            }}
            selectedCount={selectedCourses.length}
            combinationsCount={combinations.length}
          />
          <div className="px-3 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setMobileCombinationsSubTab('calendar')}
              className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 bg-indigo-600 text-white shadow-sm cursor-pointer"
            >
              <span>📅 Ver Horario</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileCombinationsSubTab('details')}
              className="flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 bg-slate-900 border border-slate-800 text-slate-300 cursor-pointer"
            >
              <span>📋 Resumen y NRCs</span>
            </button>
          </div>
        </div>

        <ScheduleCalendar
          currentCareer={currentCareer}
          selectedCourses={selectedCourses}
          combinations={combinations}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          currentCombination={currentCombination}
          isExportingImage={isExportingImage}
          onExportImage={handleExportImage}
          onGoToCourses={() => setActiveTab('courses')}
          onGoToNrcs={() => setActiveTab('nrcs')}
        />
      </div>
    </div>
  );
}
