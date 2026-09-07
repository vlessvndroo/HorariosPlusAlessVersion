import React, { useMemo } from 'react';
import { DAYS } from '../../constants/schedule';
import { timeToDec } from '../../utils/timeUtils';
import { CalendarSlot } from './CalendarSlot';

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
    <main className="flex-1 flex flex-col overflow-hidden bg-[#0b0f19]">
      {/* Header del Calendario */}
      <header className="h-16 border-b border-slate-800/80 px-6 flex items-center justify-between bg-slate-900/40 backdrop-blur no-print">
        <div>
          {combinations.length > 0 ? (
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ✓ {combinations.length} {combinations.length === 1 ? 'Opción Viable' : 'Opciones Viables'}
              </span>
              <span className="text-xs text-slate-300">
                Mostrando <span className="text-white font-bold text-sm">#{currentIndex + 1}</span> de{' '}
                <span className="text-white font-bold text-sm">{combinations.length}</span> en{' '}
                <span className="text-indigo-400 font-semibold">{currentCareer.shortName}</span>
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              {selectedCourses.length === 0
                ? `Selecciona tus materias de ${currentCareer.name} para comenzar.`
                : 'Configura los NRCs para visualizar los horarios viables.'}
            </p>
          )}
        </div>

        {combinations.length > 0 && (
          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() => setCurrentIndex(0)}
              disabled={currentIndex === 0}
              className="px-2 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-30 transition cursor-pointer"
              title="Primera combinación"
            >
              ⇤ Primera
            </button>

            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-30 transition flex items-center gap-1 cursor-pointer"
            >
              <span>←</span> Anterior
            </button>

            <span className="font-mono text-xs px-2 text-slate-300">
              {currentIndex + 1} / {combinations.length}
            </span>

            <button
              onClick={() => setCurrentIndex(prev => Math.min(combinations.length - 1, prev + 1))}
              disabled={currentIndex >= combinations.length - 1}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-30 transition shadow-lg shadow-indigo-600/20 flex items-center gap-1 cursor-pointer"
            >
              Siguiente <span>→</span>
            </button>

            <button
              onClick={() => setCurrentIndex(combinations.length - 1)}
              disabled={currentIndex >= combinations.length - 1}
              className="px-2 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 disabled:opacity-30 transition cursor-pointer"
              title="Última combinación"
            >
              Última ⇥
            </button>

            <button
              onClick={onExportImage}
              disabled={isExportingImage}
              className="ml-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
              title="Descargar horario como imagen PNG"
            >
              <span>{isExportingImage ? '⏳ Guardando...' : '📸 Guardar Imagen'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer"
              title="Imprimir o guardar en PDF"
            >
              <span>🖨️ Imprimir / PDF</span>
            </button>
          </div>
        )}
      </header>

      {/* Cuadrícula Semanal */}
      <div className="flex-1 overflow-y-auto p-6">
        {combinations.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
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
          <div id="schedule-calendar-capture" className="border border-slate-800 rounded-2xl overflow-hidden bg-[#0b0f19] shadow-2xl p-1">
            {/* Encabezados de días */}
            <div className="grid" style={{ gridTemplateColumns: `80px repeat(${activeDays.length}, minmax(0, 1fr))` }}>
              <div className="border-b border-r border-slate-800 bg-slate-900/90 p-3 text-center text-xs font-bold text-slate-500 font-mono">
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
            <div className="grid relative" style={{ gridTemplateColumns: `80px repeat(${activeDays.length}, minmax(0, 1fr))` }}>
              
              {/* Eje de Horas */}
              <div className="border-r border-slate-800 bg-slate-900/40 text-[11px] font-mono text-slate-400 select-none">
                {Array.from({ length: totalHours }).map((_, i) => (
                  <div key={i} className="h-16 border-b border-slate-800/50 p-2 flex items-start">
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
        )}
      </div>
    </main>
  );
}
