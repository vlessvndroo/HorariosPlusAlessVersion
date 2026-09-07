import React from 'react';

export function Header({ currentCareer, onResetAllData, onChangeCareer }) {
  if (!currentCareer) return null;

  return (
    <div className="p-4 border-b border-slate-800/80 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl p-1.5 rounded-xl bg-slate-900 border border-slate-800">
            {currentCareer.icon}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">
                {currentCareer.name}
              </h2>
            </div>
            <p className="text-[10px] text-slate-400">
              {currentCareer.faculty}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onResetAllData}
            title="Limpiar todas las materias y NRCs de esta carrera"
            className="text-[11px] px-2.5 py-1 rounded-md bg-rose-950/50 border border-rose-500/40 text-rose-300 hover:text-white hover:bg-rose-600 transition font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Limpiar</span>
            <span>🗑️</span>
          </button>
          <button
            onClick={onChangeCareer}
            title="Volver a la pantalla de selección de carrera"
            className="text-[11px] px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            Cambiar Carrera 🔄
          </button>
        </div>
      </div>
    </div>
  );
}
