import React from 'react';

export function Header({ currentCareer, onResetAllData, onChangeCareer }) {
  if (!currentCareer) return null;

  return (
    <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-[#0f172a]/95">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl sm:text-2xl p-1 sm:p-1.5 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0">
            {currentCareer.icon}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
                {currentCareer.name}
              </h2>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-400 flex-shrink-0">
                <span>por</span>
                <span className="text-indigo-300 font-semibold">Javier Di Addezio</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              {currentCareer.faculty}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onResetAllData}
            title="Limpiar todas las materias y NRCs de esta carrera"
            className="text-[11px] px-2 sm:px-2.5 py-1.5 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300 hover:text-white hover:bg-rose-600 transition font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>🗑️</span>
            <span className="hidden xs:inline sm:inline">Limpiar</span>
          </button>
          <button
            onClick={onChangeCareer}
            title="Volver a la pantalla de selección de carrera"
            className="text-[11px] px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition flex items-center gap-1 cursor-pointer"
          >
            <span>🔄</span>
            <span className="hidden xs:inline sm:inline">Carrera</span>
          </button>
        </div>
      </div>
    </div>
  );
}
