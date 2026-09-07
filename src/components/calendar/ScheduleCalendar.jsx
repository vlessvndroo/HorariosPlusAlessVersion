import React, { useState, useMemo } from 'react';
import { DAYS } from '../../constants/schedule';
import { timeToDec } from '../../utils/timeUtils';
import { CalendarSlot } from './CalendarSlot';
import { MobileScheduleView } from './MobileScheduleView';

export function ScheduleCalendar({
  currentCareer,
  selectedCourses,
  combinations,
  currentIndex,
  setCurrentIndex,
  currentCombination,
  isExportingImage,
  onExportImage,
  onGoToCourses,
  onGoToNrcs
}) {
  // En móviles: 'agenda' (por defecto, tarjetas verticales por día) o 'matrix' (cuadrícula completa deslizable)
  const [mobileViewMode, setMobileViewMode] = useState('agenda');

  const { startHour, endHour, hasSaturday, hasSunday } = useMemo(() => {
    let minH = 7;
    let maxH = 19;
    let sat = false;
    let sun = false;

    currentCombination.forEach(item => {
      (item.schedule || []).forEach(slot => {
        if (slot.day === 'SAB') sat = true;
        if (slot.day === 'DOM') sun = true;
        const sDec = timeToDec(slot.start);
        const eDec = timeToDec(slot.end);
        if (sDec < minH) minH = Math.floor(sDec);
        if (eDec > maxH) maxH = Math.ceil(eDec);
      });
    });

    return { startHour: minH, endHour: maxH, hasSaturday: sat, hasSunday: sun };
  }, [currentCombination]);

  const activeDays = useMemo(() => {
    return DAYS.filter(d => {
      if (d.key === 'SAB' && !hasSaturday) return false;
      if (d.key === 'DOM' && !hasSunday) return false;
      return true;
    });
  }, [hasSaturday, hasSunday]);

  const totalHours = Math.max(1, endHour - startHour);

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-[#0b0f19] w-full">
      {/* Header del Calendario - Responsivo para desktop y mobile */}
      <header className="border-b border-slate-800/80 px-4 sm:px-6 py-3 min-h-16 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-900/40 backdrop-blur no-print">
        <div className="flex items-center justify-between">
          {combinations.length > 0 ? (
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
                ✓ {combinations.length} {combinations.length === 1 ? 'Opción Viable' : 'Opciones Viables'}
              </span>
              <span className="text-xs text-slate-300">
                Opción <span className="text-white font-bold text-sm">#{currentIndex + 1}</span> de{' '}
                <span className="text-white font-bold text-sm">{combinations.length}</span>
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              {selectedCourses.length === 0
                ? `Selecciona tus materias de ${currentCareer.name} para comenzar.`
                : 'Configura los NRCs para visualizar los horarios viables.'}
            </p>
          )}

          {/* Toggle móvil Agenda / Matriz (visible solo en pantallas pequeñas) */}
          {combinations.length > 0 && (
            <div className="flex md:hidden items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={() => setMobileViewMode('agenda')}
                className={`px-2 py-1 rounded-md font-semibold transition cursor-pointer ${
                  mobileViewMode === 'agenda'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📱 Agenda
              </button>
              <button
                type="button"
                onClick={() => setMobileViewMode('matrix')}
                className={`px-2 py-1 rounded-md font-semibold transition cursor-pointer ${
                  mobileViewMode === 'matrix'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📅 Matriz
              </button>
            </div>
          )}
        </div>

        {combinations.length > 0 && (
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-between sm:justify-end no-print">
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setCurrentIndex(0)}
                disabled={currentIndex === 0}
                className="hidden sm:inline-block px-2 py-1 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-30 transition cursor-pointer"
                title="Primera combinación"
              >
                ⇤
              </button>

              <button
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-30 transition flex items-center gap-1 cursor-pointer"
              >
                <span>←</span> <span className="hidden sm:inline">Anterior</span>
              </button>

              <span className="font-mono text-xs px-2 text-slate-300 font-bold whitespace-nowrap">
                {currentIndex + 1} / {combinations.length}
              </span>

              <button
                onClick={() => setCurrentIndex(prev => Math.min(combinations.length - 1, prev + 1))}
                disabled={currentIndex >= combinations.length - 1}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-30 transition shadow-lg shadow-indigo-600/20 flex items-center gap-1 cursor-pointer"
              >
                <span className="hidden sm:inline">Siguiente</span> <span>→</span>
              </button>

              <button
                onClick={() => setCurrentIndex(combinations.length - 1)}
                disabled={currentIndex >= combinations.length - 1}
                className="hidden sm:inline-block px-2 py-1 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-30 transition cursor-pointer"
                title="Última combinación"
              >
                ⇥
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onExportImage}
                disabled={isExportingImage}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
                title="Descargar horario como imagen PNG"
              >
                <span>{isExportingImage ? '⏳' : '📸'}</span>
                <span className="hidden sm:inline">{isExportingImage ? 'Guardando...' : 'Guardar Imagen'}</span>
                <span className="sm:hidden">{isExportingImage ? 'Guardando' : 'PNG'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer"
                title="Imprimir o guardar en PDF"
              >
                <span>🖨️</span>
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Área del Contenido del Horario */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        {combinations.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 sm:p-8">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-3xl mb-4">
              {currentCareer.icon}
            </div>
            <h2 className="text-base font-bold text-white mb-1">
              Planificador de Horarios • {currentCareer.name}
            </h2>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-4">
              {selectedCourses.length === 0
                ? `No tienes materias seleccionadas. Selecciona las asignaturas de ${currentCareer.name} que deseas inscribir este semestre.`
                : 'Carga los NRCs de cada sección o práctica en la pestaña "NRCs & Horarios".'}
            </p>
            {selectedCourses.length === 0 ? (
              <button
                onClick={onGoToCourses}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 mx-auto cursor-pointer"
              >
                <span>Seleccionar Materias (Paso 1)</span>
                <span>→</span>
              </button>
            ) : (
              <button
                onClick={onGoToNrcs}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 mx-auto cursor-pointer"
              >
                <span>Cargar NRCs & Horarios (Paso 2)</span>
                <span>→</span>
              </button>
            )}
          </div>
        ) : (
          <div>
            {/* VISTA MÓVIL DEDICADA: Agenda y Vista por Día (Por defecto en smartphones) */}
            <div className={`md:hidden ${mobileViewMode === 'agenda' ? 'block' : 'hidden'}`}>
              <MobileScheduleView
                currentCombination={currentCombination}
                activeDays={activeDays}
                currentCareer={currentCareer}
              />
            </div>

            {/* VISTA MATRIZ SEMANAL (Por defecto en pantallas grandes o seleccionada en móvil) */}
            <div className={`${mobileViewMode === 'matrix' ? 'block' : 'hidden md:block'}`}>
              {/* Sugerencia de deslizamiento horizontal solo en pantallas móviles */}
              <div className="md:hidden flex items-center justify-between text-[11px] text-slate-400 mb-2 px-1">
                <span>👈 Desliza horizontalmente para ver todos los días 👉</span>
                <span className="font-mono text-indigo-400 font-bold">Semana completa</span>
              </div>

              {/* Contenedor con overflow horizontal garantizado */}
              <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-800">
                <div
                  id="schedule-calendar-capture"
                  className="min-w-[680px] border border-slate-800 rounded-2xl overflow-hidden bg-[#0b0f19] shadow-2xl p-1"
                >
                  {/* Encabezados de días */}
                  <div className="grid" style={{ gridTemplateColumns: `70px repeat(${activeDays.length}, minmax(0, 1fr))` }}>
                    <div className="sticky left-0 z-30 border-b border-r border-slate-800 bg-slate-900 p-3 text-center text-xs font-bold text-slate-400 font-mono shadow-md">
                      24h
                    </div>
                    {activeDays.map(day => (
                      <div
                        key={day.key}
                        className={`border-b border-r border-slate-800 p-3 text-center text-xs font-bold last:border-r-0 ${
                          day.key === 'DOM'
                            ? 'bg-emerald-950/40 text-emerald-300'
                            : 'bg-slate-900/90 text-slate-200'
                        }`}
                      >
                        <span className="hidden sm:inline">{day.label}</span>
                        <span className="sm:hidden">{day.short}</span>
                      </div>
                    ))}
                  </div>

                  {/* Matriz horaria */}
                  <div className="grid relative" style={{ gridTemplateColumns: `70px repeat(${activeDays.length}, minmax(0, 1fr))` }}>
                    
                    {/* Eje de Horas Sticky para deslizamiento suave */}
                    <div className="sticky left-0 z-20 border-r border-slate-800 bg-slate-900/95 text-[11px] font-mono text-slate-400 select-none shadow-md">
                      {Array.from({ length: totalHours }).map((_, i) => (
                        <div key={i} className="h-16 border-b border-slate-800/60 p-2 flex items-start">
                          {String(startHour + i).padStart(2, '0')}:00
                        </div>
                      ))}
                    </div>

                    {/* Columnas de los días */}
                    {activeDays.map(day => (
                      <div
                        key={day.key}
                        className={`relative border-r border-slate-800/50 last:border-r-0 ${
                          day.key === 'DOM' ? 'bg-emerald-950/10' : ''
                        }`}
                      >
                        {Array.from({ length: totalHours }).map((_, i) => (
                          <div key={i} className="h-16 border-b border-slate-800/30" />
                        ))}

                        {currentCombination.map(item => {
                          if (item.type === 'theory_practice') {
                            const theorySlots = (item.theorySchedule || []).filter(s => s.day === day.key);
                            const practiceSlots = (item.practiceSchedule || []).filter(s => s.day === day.key);

                            return (
                              <React.Fragment key={item.courseId}>
                                {theorySlots.map((slot, sIdx) => {
                                  const sDec = timeToDec(slot.start);
                                  const eDec = timeToDec(slot.end);
                                  const topPercent = ((sDec - startHour) / totalHours) * 100;
                                  const heightPercent = ((eDec - sDec) / totalHours) * 100;

                                  return (
                                    <CalendarSlot
                                      key={`${item.courseId}-theory-${slot.day}-${slot.start}-${sIdx}`}
                                      topPercent={topPercent}
                                      heightPercent={heightPercent}
                                      courseName={item.courseName}
                                      courseId={item.courseId}
                                      nrc={item.theoryNrc}
                                      sectionName={item.theorySectionName}
                                      prof={item.theoryProf}
                                      subType="Teoría"
                                      timeRange={`${slot.start} - ${slot.end}`}
                                      color={item.color}
                                      isVirtual={false}
                                    />
                                  );
                                })}

                                {practiceSlots.map((slot, sIdx) => {
                                  const sDec = timeToDec(slot.start);
                                  const eDec = timeToDec(slot.end);
                                  const topPercent = ((sDec - startHour) / totalHours) * 100;
                                  const heightPercent = ((eDec - sDec) / totalHours) * 100;

                                  return (
                                    <CalendarSlot
                                      key={`${item.courseId}-practice-${slot.day}-${slot.start}-${sIdx}`}
                                      topPercent={topPercent}
                                      heightPercent={heightPercent}
                                      courseName={item.courseName}
                                      courseId={item.courseId}
                                      nrc={item.practiceNrc}
                                      sectionName={item.practiceSectionName}
                                      prof={item.practiceProf}
                                      subType="Práctica"
                                      timeRange={`${slot.start} - ${slot.end}`}
                                      color={item.color}
                                      isVirtual={false}
                                    />
                                  );
                                })}
                              </React.Fragment>
                            );
                          }

                          if (item.type === 'virtual') {
                            if (day.key !== 'DOM') return null;
                            const slot = item.schedule && item.schedule[0];
                            if (!slot) return null;

                            const sDec = timeToDec(slot.start);
                            const eDec = timeToDec(slot.end);
                            const topPercent = ((sDec - startHour) / totalHours) * 100;
                            const heightPercent = ((eDec - sDec) / totalHours) * 100;

                            return (
                              <CalendarSlot
                                key={item.courseId}
                                topPercent={topPercent}
                                heightPercent={heightPercent}
                                courseName={item.courseName}
                                courseId={item.courseId}
                                nrc={item.nrc}
                                sectionName={item.sectionName}
                                prof={item.prof}
                                subType={null}
                                timeRange={`${slot.start} - ${slot.end}`}
                                color={item.color}
                                isVirtual={true}
                              />
                            );
                          }

                          return (item.schedule || [])
                            .filter(s => s.day === day.key)
                            .map((slot, sIdx) => {
                              const sDec = timeToDec(slot.start);
                              const eDec = timeToDec(slot.end);
                              const topPercent = ((sDec - startHour) / totalHours) * 100;
                              const heightPercent = ((eDec - sDec) / totalHours) * 100;

                              return (
                                <CalendarSlot
                                  key={`${item.courseId}-${sIdx}`}
                                  topPercent={topPercent}
                                  heightPercent={heightPercent}
                                  courseName={item.courseName}
                                  courseId={item.courseId}
                                  nrc={item.nrc}
                                  sectionName={item.sectionName}
                                  prof={item.prof}
                                  subType={null}
                                  timeRange={`${slot.start} - ${slot.end}`}
                                  color={item.color}
                                  isVirtual={false}
                                />
                              );
                            });
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
