import React from 'react';

export function CombinationsTab({
  currentCareer,
  combinations,
  currentIndex,
  setCurrentIndex,
  currentCombination,
  missingCourses,
  combinationStats,
  copiedNotification,
  onCopyNrcList,
  onGoToNrcs
}) {
  if (missingCourses.length > 0) {
    return (
      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
          <span>⚠️</span> Materias con datos incompletos
        </div>
        <p className="text-[11px] text-slate-300">
          Para calcular las combinaciones en <b>{currentCareer.name}</b>, configura los NRCs de:
        </p>
        <ul className="text-xs font-mono space-y-1 pl-2 text-amber-200">
          {missingCourses.map(m => (
            <li key={m.id}>• {m.name} ({m.id}) - {m.reason}</li>
          ))}
        </ul>
        <button
          onClick={onGoToNrcs}
          className="mt-2 w-full py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
        >
          Ir a Completar NRCs
        </button>
      </div>
    );
  }

  if (combinations.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2 text-center py-8">
        <span className="text-3xl block mb-1">🚫</span>
        <h4 className="text-xs font-bold text-rose-300">No hay combinaciones posibles sin choque</h4>
        <p className="text-[11px] text-slate-300 leading-relaxed max-w-xs mx-auto">
          Las secciones o prácticas ingresadas tienen solapamiento de horario entre sí.
        </p>
        <button
          onClick={onGoToNrcs}
          className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
        >
          Modificar NRCs o Horarios
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Resumen de Combinación */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
              Combinación #{currentIndex + 1} de {combinations.length} • {currentCareer.shortName}
            </span>
            <h3 className="text-xs font-bold text-white">
              {currentCombination.length} Materias sin choques
            </h3>
          </div>

          <button
            onClick={onCopyNrcList}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              copiedNotification
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40'
            }`}
          >
            <span>{copiedNotification ? '✓ ¡Copiado!' : '📋 Copiar NRCs'}</span>
          </button>
        </div>

        {combinationStats && (
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">Días de Clase</span>
              <span className="text-xs font-bold text-white">{combinationStats.daysCount} días</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">Días Libres</span>
              <span className="text-xs font-bold text-emerald-400">{combinationStats.freeDaysCount} días</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">Virtuales (Dom)</span>
              <span className="text-xs font-bold text-indigo-300 font-mono">
                {combinationStats.virtualCount} {combinationStats.virtualCount === 1 ? 'materia' : 'materias'}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            NRCs que debes inscribir en esta opción:
          </p>

          <div className="space-y-1.5">
            {currentCombination.map((item) => (
              <div
                key={item.courseId}
                className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs"
              >
                <div className="pr-2 flex-1">
                  <p className="font-semibold text-white leading-tight">{item.courseName}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {item.courseId}
                  </p>
                </div>

                <div className="text-right">
                  {item.type === 'theory_practice' ? (
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-950 text-purple-200 border border-purple-500/40 block">
                        Teoría: {item.theoryNrc}
                      </span>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-200 border border-indigo-500/40 block">
                        Práctica: {item.practiceNrc}
                      </span>
                    </div>
                  ) : item.type === 'virtual' ? (
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded-md bg-emerald-950 text-emerald-200 border border-emerald-500/40 inline-block">
                      NRC {item.nrc} (Virtual)
                    </span>
                  ) : (
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded-md bg-indigo-950 text-indigo-200 border border-indigo-500/40 inline-block">
                      NRC {item.nrc}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {combinations.length > 1 && (
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Saltar a combinación:
          </span>
          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
            {combinations.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`px-2 py-1 rounded-md text-[11px] font-mono transition cursor-pointer ${
                  currentIndex === idx
                    ? 'bg-indigo-600 text-white font-bold shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                #{idx + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
