import React from 'react';

export function VirtualSectionEditor({
  courseId,
  virtualSections = [],
  onAddSection,
  onUpdateSection,
  onRemoveSection
}) {
  return (
    <div className="space-y-2.5 bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
            🌐 Materia Virtual / Asíncrona
          </span>
          <p className="text-[10px] text-slate-400">
            Sin horario presencial. Se ubica el <b>Domingo</b> sin causar choques.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onAddSection(courseId)}
          className="text-[10px] px-2 py-1 rounded bg-emerald-600/30 text-emerald-200 hover:bg-emerald-600/50 font-semibold cursor-pointer transition"
        >
          + NRC Virtual
        </button>
      </div>

      <div className="space-y-2 pt-1">
        {virtualSections.map((vSec, vIdx) => (
          <div key={vIdx} className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs">
            <div className="w-28">
              <label className="text-[9px] text-slate-400 uppercase font-bold block mb-0.5">NRC</label>
              <input
                type="text"
                placeholder="Ej. 18201"
                value={vSec.nrc}
                onChange={(e) => onUpdateSection(courseId, vIdx, 'nrc', e.target.value)}
                className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-mono font-bold text-emerald-300 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="w-24">
              <label className="text-[9px] text-slate-400 uppercase font-bold block mb-0.5">Sección</label>
              <input
                type="text"
                placeholder="Sec V1"
                value={vSec.sectionName}
                onChange={(e) => onUpdateSection(courseId, vIdx, 'sectionName', e.target.value)}
                className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex-1">
              <label className="text-[9px] text-slate-400 uppercase font-bold block mb-0.5">Profesor (opcional)</label>
              <input
                type="text"
                placeholder="Docente virtual"
                value={vSec.prof}
                onChange={(e) => onUpdateSection(courseId, vIdx, 'prof', e.target.value)}
                className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              />
            </div>
            {virtualSections.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveSection(courseId, vIdx)}
                className="text-slate-500 hover:text-rose-400 text-sm mt-3 px-1 cursor-pointer transition"
                title="Eliminar sección virtual"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
