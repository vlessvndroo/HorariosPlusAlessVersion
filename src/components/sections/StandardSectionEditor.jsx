import React from 'react';
import { DAYS, ROUND_HOURS_24H } from '../../constants/schedule';

export function StandardSectionEditor({
  courseId,
  sections = [],
  onAddSection,
  onRemoveSection,
  onUpdateField,
  onAddSlot,
  onRemoveSlot,
  onUpdateSlot
}) {
  const weekDays = DAYS.filter(d => d.key !== 'DOM');

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-bold text-slate-300">Secciones estándar</span>
        <button
          type="button"
          onClick={() => onAddSection(courseId)}
          className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-600/30 text-indigo-200 hover:bg-indigo-600/50 font-semibold cursor-pointer transition"
        >
          + Agregar NRC
        </button>
      </div>

      {sections.map((sec, sIdx) => (
        <div key={sIdx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs">
          <div className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-4">
              <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">NRC</label>
              <input
                type="text"
                placeholder="Ej. 14201"
                value={sec.nrc}
                onChange={(e) => onUpdateField(courseId, sIdx, 'nrc', e.target.value)}
                className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs font-mono font-bold text-indigo-300 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="col-span-3">
              <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Sección</label>
              <input
                type="text"
                value={sec.sectionName}
                onChange={(e) => onUpdateField(courseId, sIdx, 'sectionName', e.target.value)}
                className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="col-span-4">
              <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Profesor</label>
              <input
                type="text"
                placeholder="Opcional"
                value={sec.prof}
                onChange={(e) => onUpdateField(courseId, sIdx, 'prof', e.target.value)}
                className="w-full px-2 py-1 bg-slate-950 border border-slate-700 rounded text-xs text-slate-300 focus:outline-none truncate focus:border-indigo-500"
              />
            </div>
            <div className="col-span-1 flex justify-end">
              {sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveSection(courseId, sIdx)}
                  className="text-slate-500 hover:text-rose-400 text-sm mt-3 px-1 cursor-pointer transition"
                  title="Eliminar NRC"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Bloques con HORAS REDONDAS */}
          <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
              <span>Días y Horarios:</span>
              <button
                type="button"
                onClick={() => onAddSlot(courseId, sIdx)}
                className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition"
              >
                + Agregar otro día/hora
              </button>
            </div>

            {sec.schedule.map((slot, bIdx) => (
              <div key={bIdx} className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center gap-1.5 text-xs">
                <select
                  value={slot.day}
                  onChange={(e) => onUpdateSlot(courseId, sIdx, bIdx, 'day', e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px] cursor-pointer"
                >
                  {weekDays.map(d => (
                    <option key={d.key} value={d.key}>{d.label}</option>
                  ))}
                </select>

                <select
                  value={slot.start}
                  onChange={(e) => onUpdateSlot(courseId, sIdx, bIdx, 'start', e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px] font-mono cursor-pointer"
                >
                  {ROUND_HOURS_24H.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <span className="text-slate-500 font-bold">-</span>
                <select
                  value={slot.end}
                  onChange={(e) => onUpdateSlot(courseId, sIdx, bIdx, 'end', e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px] font-mono cursor-pointer"
                >
                  {ROUND_HOURS_24H.map(t => <option key={t} value={t}>{t}</option>)}
                </select>

                {sec.schedule.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemoveSlot(courseId, sIdx, bIdx)}
                    className="text-slate-500 hover:text-rose-400 p-1 ml-auto cursor-pointer transition"
                    title="Eliminar bloque horario"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
