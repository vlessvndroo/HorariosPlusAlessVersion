import React from 'react';

export function TabNav({ activeTab, setActiveTab, selectedCount, combinationsCount }) {
  return (
    <div className="px-4 pt-3 pb-2 border-b border-slate-800/60 bg-slate-900/40">
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/70 border border-slate-800 rounded-xl">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'courses'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span className="text-[10px] uppercase opacity-75">Paso 1</span>
          <span className="truncate w-full text-center">Materias ({selectedCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('nrcs')}
          className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'nrcs'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span className="text-[10px] uppercase opacity-75">Paso 2</span>
          <span className="truncate w-full text-center">NRCs & Horarios</span>
        </button>

        <button
          onClick={() => setActiveTab('combinations')}
          className={`flex flex-col items-center py-2 px-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
            activeTab === 'combinations'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <span className="text-[10px] uppercase opacity-75">Paso 3</span>
          <span className="truncate w-full text-center">
            Combinaciones {combinationsCount > 0 && `(${combinationsCount})`}
          </span>
        </button>
      </div>
    </div>
  );
}
