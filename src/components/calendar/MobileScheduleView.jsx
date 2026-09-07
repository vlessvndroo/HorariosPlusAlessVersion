import React, { useState, useMemo } from 'react';
import { DAYS } from '../../constants/schedule';

export function MobileScheduleView({ currentCombination, activeDays, currentCareer }) {
  const [selectedDayKey, setSelectedDayKey] = useState('all');

  // Extraer todos los bloques de clase de la combinación actual organizados por día
  const dayScheduleMap = useMemo(() => {
    const map = {};
    DAYS.forEach(d => {
      map[d.key] = [];
    });

    currentCombination.forEach(item => {
      if (item.type === 'theory_practice') {
        (item.theorySchedule || []).forEach(slot => {
          if (map[slot.day]) {
            map[slot.day].push({
              courseName: item.courseName,
              courseId: item.courseId,
              nrc: item.theoryNrc,
              sectionName: item.theorySectionName,
              prof: item.theoryProf,
              subType: 'Teoría',
              start: slot.start,
              end: slot.end,
              color: item.color,
              isVirtual: false
            });
          }
        });

        (item.practiceSchedule || []).forEach(slot => {
          if (map[slot.day]) {
            map[slot.day].push({
              courseName: item.courseName,
              courseId: item.courseId,
              nrc: item.practiceNrc,
              sectionName: item.practiceSectionName,
              prof: item.practiceProf,
              subType: 'Práctica',
              start: slot.start,
              end: slot.end,
              color: item.color,
              isVirtual: false
            });
          }
        });
      } else if (item.type === 'virtual') {
        const slot = item.schedule && item.schedule[0];
        if (slot && map['DOM']) {
          map['DOM'].push({
            courseName: item.courseName,
            courseId: item.courseId,
            nrc: item.nrc,
            sectionName: item.sectionName,
            prof: item.prof,
            subType: 'Virtual (Asíncrona)',
            start: slot.start,
            end: slot.end,
            color: item.color,
            isVirtual: true
          });
        }
      } else {
        (item.schedule || []).forEach(slot => {
          if (map[slot.day]) {
            map[slot.day].push({
              courseName: item.courseName,
              courseId: item.courseId,
              nrc: item.nrc,
              sectionName: item.sectionName,
              prof: item.prof,
              subType: null,
              start: slot.start,
              end: slot.end,
              color: item.color,
              isVirtual: false
            });
          }
        });
      }
    });

    // Ordenar cronológicamente las clases de cada día
    Object.keys(map).forEach(dayKey => {
      map[dayKey].sort((a, b) => a.start.localeCompare(b.start));
    });

    return map;
  }, [currentCombination]);

  // Lista de días a mostrar según los días activos en la combinación
  const visibleDays = useMemo(() => {
    return activeDays;
  }, [activeDays]);

  const totalClassesCount = currentCombination.reduce((acc, curr) => {
    if (curr.type === 'theory_practice') {
      return acc + (curr.theorySchedule?.length || 0) + (curr.practiceSchedule?.length || 0);
    }
    return acc + (curr.schedule?.length || 0);
  }, 0);

  return (
    <div className="space-y-4">
      {/* Barra de Filtro de Días Horizontal */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          type="button"
          onClick={() => setSelectedDayKey('all')}
          className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
            selectedDayKey === 'all'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
          }`}
        >
          <span>Agenda Completa</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/30 font-mono">
            {totalClassesCount}
          </span>
        </button>

        {visibleDays.map(d => {
          const classesCount = (dayScheduleMap[d.key] || []).length;
          const isSelected = selectedDayKey === d.key;
          const isDom = d.key === 'DOM';

          return (
            <button
              key={d.key}
              type="button"
              onClick={() => setSelectedDayKey(d.key)}
              className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? isDom
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <span>{d.short}</span>
              {classesCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isSelected ? 'bg-black/30 text-white' : 'bg-slate-800 text-indigo-300'
                  }`}
                >
                  {classesCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Contenedor de Clases */}
      <div className="space-y-4">
        {selectedDayKey === 'all' ? (
          // Vista de Agenda Semanal Completa
          <div className="space-y-5">
            {visibleDays.map(day => {
              const classes = dayScheduleMap[day.key] || [];
              if (classes.length === 0) return null;

              return (
                <div key={day.key} className="space-y-2.5">
                  <div className="flex items-center gap-2 px-1">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        day.key === 'DOM'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {day.label}
                    </span>
                    <div className="h-px bg-slate-800 flex-1" />
                    <span className="text-[11px] text-slate-500 font-medium">
                      {classes.length} {classes.length === 1 ? 'clase' : 'clases'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {classes.map((c, idx) => (
                      <MobileClassCard key={idx} item={c} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Vista de Día Específico
          <div>
            {(() => {
              const dayObj = DAYS.find(d => d.key === selectedDayKey);
              const classes = dayScheduleMap[selectedDayKey] || [];

              if (classes.length === 0) {
                return (
                  <div className="text-center py-10 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30 space-y-2">
                    <span className="text-3xl block">🏖️</span>
                    <h4 className="text-sm font-bold text-slate-200">
                      ¡Día libre el {dayObj?.label || selectedDayKey}!
                    </h4>
                    <p className="text-xs text-slate-400">
                      No tienes ninguna clase programada para este día en esta combinación.
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1 mb-1">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>📅 {dayObj?.label}</span>
                      <span className="text-xs font-normal text-slate-400">
                        ({classes.length} {classes.length === 1 ? 'asignatura' : 'asignaturas'})
                      </span>
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {classes.map((c, idx) => (
                      <MobileClassCard key={idx} item={c} />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}

function MobileClassCard({ item }) {
  const bgClass = item.color?.bg || (item.isVirtual ? 'bg-emerald-900/80' : 'bg-indigo-600/80');
  const borderClass = item.color?.border || (item.isVirtual ? 'border-emerald-400' : 'border-indigo-400');

  return (
    <div
      className={`p-3.5 rounded-2xl border shadow-md flex flex-col justify-between transition ${bgClass} ${borderClass}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-xs sm:text-sm font-bold text-white leading-tight break-words">
              {item.courseName}
            </h4>
            {item.subType && (
              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-black/40 text-white/90 border border-white/20">
                {item.subType}
              </span>
            )}
          </div>
          <p className="text-[11px] font-mono text-white/80">
            {item.courseId} • {item.sectionName}
          </p>
        </div>

        <span className="font-mono text-xs font-extrabold px-2.5 py-1 rounded-lg bg-black/50 text-white border border-white/20 whitespace-nowrap shadow-sm">
          NRC {item.nrc}
        </span>
      </div>

      <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-white/15 text-xs text-white/90">
        <div className="flex items-center gap-1.5 font-mono font-bold">
          <span>⏰</span>
          <span>
            {item.start} - {item.end}
          </span>
          {item.isVirtual && (
            <span className="font-sans text-[10px] px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-200 border border-emerald-400/30">
              Horario flexible
            </span>
          )}
        </div>

        {item.prof && (
          <div className="flex items-center gap-1 text-[11px] font-medium text-white/80 truncate max-w-[140px]" title={item.prof}>
            <span>👨‍🏫</span>
            <span className="truncate">{item.prof}</span>
          </div>
        )}
      </div>
    </div>
  );
}
