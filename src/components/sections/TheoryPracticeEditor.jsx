import React from 'react';
import { DAYS, ROUND_HOURS_24H } from '../../constants/schedule';

export function TheoryPracticeEditor({
  courseId,
  theoryGroups = [],
  onAddTheoryGroup,
  onRemoveTheoryGroup,
  onUpdateTheoryField,
  onAddTheorySlot,
  onRemoveTheorySlot,
  onUpdateTheorySlot,
  onAddPracticeToTheory,
  onUpdatePracticeField,
  onRemovePracticeFromTheory,
  onAddPracticeSlot,
  onRemovePracticeSlot,
  onUpdatePracticeSlot
}) {
  const weekDays = DAYS.filter(d => d.key !== 'DOM');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-bold text-purple-300">
          Grupos vinculados (Teoría obligatoria + Práctica elegible)
        </span>
        <button
          type="button"
          onClick={() => onAddTheoryGroup(courseId)}
          className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-600/30 text-purple-200 hover:bg-purple-600/50 font-semibold cursor-pointer transition"
        >
          + Grupo de Teoría
        </button>
      </div>

      {theoryGroups.map((tg, tgIdx) => (
        <div key={tg.id || tgIdx} className="p-3 rounded-xl bg-slate-900/90 border border-purple-500/30 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
              Grupo de Teoría #{tgIdx + 1}
            </span>
            {theoryGroups.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveTheoryGroup(courseId, tgIdx)}
                className="text-rose-400 hover:text-rose-300 text-xs cursor-pointer transition"
              >
                Eliminar Grupo
              </button>
            )}
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 space-y-2">
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6 sm:col-span-4">
                <label className="text-[9px] font-bold text-purple-300 uppercase block mb-0.5">NRC Teoría</label>
                <input
                  type="text"
                  placeholder="Ej. 15660"
                  value={tg.theoryNrc}
                  onChange={(e) => onUpdateTheoryField(courseId, tgIdx, 'theoryNrc', e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono font-bold text-purple-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Sección</label>
                <input
                  type="text"
                  value={tg.theorySectionName}
                  onChange={(e) => onUpdateTheoryField(courseId, tgIdx, 'theorySectionName', e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                />
              </div>
              <div className="col-span-12 sm:col-span-5">
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Prof. Teoría</label>
                <input
                  type="text"
                  placeholder="Profesor"
                  value={tg.theoryProf}
                  onChange={(e) => onUpdateTheoryField(courseId, tgIdx, 'theoryProf', e.target.value)}
                  className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none"
                />
              </div>
            </div>

            {/* Bloques de Teoría con HORAS REDONDAS */}
            <div className="space-y-1.5 pt-1.5 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[10px] text-purple-300 font-medium">
                <span>Días y Horarios de Teoría:</span>
                <button
                  type="button"
                  onClick={() => onAddTheorySlot(courseId, tgIdx)}
                  className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer transition"
                >
                  + Agregar otro día/hora
                </button>
              </div>

              {(tg.theorySchedule || []).map((slot, bIdx) => (
                <div key={bIdx} className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex flex-wrap items-center gap-1.5 text-xs">
                  <select
                    value={slot.day}
                    onChange={(e) => onUpdateTheorySlot(courseId, tgIdx, bIdx, 'day', e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 text-[11px] cursor-pointer flex-1 sm:flex-none"
                  >
                    {weekDays.map(d => (
                      <option key={d.key} value={d.key}>{d.label}</option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1 flex-1 sm:flex-none justify-between sm:justify-start">
                    <select
                      value={slot.start}
                      onChange={(e) => onUpdateTheorySlot(courseId, tgIdx, bIdx, 'start', e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 text-[11px] font-mono cursor-pointer"
                    >
                      {ROUND_HOURS_24H.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span className="text-slate-500 font-bold">-</span>
                    <select
                      value={slot.end}
                      onChange={(e) => onUpdateTheorySlot(courseId, tgIdx, bIdx, 'end', e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 text-[11px] font-mono cursor-pointer"
                    >
                      {ROUND_HOURS_24H.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {(tg.theorySchedule || []).length > 1 && (
                    <button
                      type="button"
                      onClick={() => onRemoveTheorySlot(courseId, tgIdx, bIdx)}
                      className="text-slate-500 hover:text-rose-400 p-1 ml-auto cursor-pointer transition"
                      title="Eliminar bloque de teoría"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Prácticas Vinculadas */}
          <div className="space-y-2 pl-1 sm:pl-3 border-l-2 border-purple-500/40">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-300">Prácticas asociadas a este grupo:</span>
              <button
                type="button"
                onClick={() => onAddPracticeToTheory(courseId, tgIdx)}
                className="text-purple-300 hover:text-white font-semibold cursor-pointer transition text-[11px]"
              >
                + Agregar Práctica
              </button>
            </div>

            {tg.practices.map((pr, prIdx) => (
              <div key={pr.id || prIdx} className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800 space-y-2 text-xs">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-6 sm:col-span-4">
                    <label className="text-[9px] text-slate-400 uppercase font-bold block mb-0.5">NRC Práctica</label>
                    <input
                      type="text"
                      placeholder="Ej. 15683"
                      value={pr.practiceNrc}
                      onChange={(e) => onUpdatePracticeField(courseId, tgIdx, prIdx, 'practiceNrc', e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono font-bold text-indigo-300 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-5 sm:col-span-3">
                    <label className="text-[9px] text-slate-400 uppercase font-bold block mb-0.5">Sección</label>
                    <input
                      type="text"
                      value={pr.practiceSectionName}
                      onChange={(e) => onUpdatePracticeField(courseId, tgIdx, prIdx, 'practiceSectionName', e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="col-span-1 sm:hidden flex justify-end">
                    {tg.practices.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemovePracticeFromTheory(courseId, tgIdx, prIdx)}
                        className="text-slate-500 hover:text-rose-400 text-sm mt-3 px-1 cursor-pointer transition"
                        title="Eliminar práctica"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="col-span-12 sm:col-span-4">
                    <label className="text-[9px] text-slate-400 uppercase font-bold block mb-0.5">Profesor</label>
                    <input
                      type="text"
                      placeholder="Opcional"
                      value={pr.practiceProf}
                      onChange={(e) => onUpdatePracticeField(courseId, tgIdx, prIdx, 'practiceProf', e.target.value)}
                      className="w-full px-2 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none"
                    />
                  </div>
                  <div className="hidden sm:flex col-span-1 justify-end">
                    {tg.practices.length > 1 && (
                      <button
                        type="button"
                        onClick={() => onRemovePracticeFromTheory(courseId, tgIdx, prIdx)}
                        className="text-slate-500 hover:text-rose-400 text-sm mt-3 px-1 cursor-pointer transition"
                        title="Eliminar práctica"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Bloques de Práctica con HORAS REDONDAS */}
                <div className="space-y-1.5 pt-1.5 border-t border-slate-800/60">
                  <div className="flex items-center justify-between text-[10px] text-indigo-300 font-medium">
                    <span>Días y Horarios de Práctica:</span>
                    <button
                      type="button"
                      onClick={() => onAddPracticeSlot(courseId, tgIdx, prIdx)}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition"
                    >
                      + Agregar otro día/hora
                    </button>
                  </div>

                  {(pr.practiceSchedule || []).map((slot, bIdx) => (
                    <div key={bIdx} className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex flex-wrap items-center gap-1.5 text-xs">
                      <select
                        value={slot.day}
                        onChange={(e) => onUpdatePracticeSlot(courseId, tgIdx, prIdx, bIdx, 'day', e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 text-[11px] cursor-pointer flex-1 sm:flex-none"
                      >
                        {weekDays.map(d => (
                          <option key={d.key} value={d.key}>{d.label}</option>
                        ))}
                      </select>

                      <div className="flex items-center gap-1 flex-1 sm:flex-none justify-between sm:justify-start">
                        <select
                          value={slot.start}
                          onChange={(e) => onUpdatePracticeSlot(courseId, tgIdx, prIdx, bIdx, 'start', e.target.value)}
                          className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 text-[11px] font-mono cursor-pointer"
                        >
                          {ROUND_HOURS_24H.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <span className="text-slate-500 font-bold">-</span>
                        <select
                          value={slot.end}
                          onChange={(e) => onUpdatePracticeSlot(courseId, tgIdx, prIdx, bIdx, 'end', e.target.value)}
                          className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-200 text-[11px] font-mono cursor-pointer"
                        >
                          {ROUND_HOURS_24H.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>

                      {(pr.practiceSchedule || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => onRemovePracticeSlot(courseId, tgIdx, prIdx, bIdx)}
                          className="text-slate-500 hover:text-rose-400 p-1 ml-auto cursor-pointer transition"
                          title="Eliminar bloque de práctica"
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
        </div>
      ))}
    </div>
  );
}
