import React from 'react';
import { DAYS, ROUND_HOURS_24H } from '../../constants/schedule';

export function TheoryPracticeEditor({
  courseId,
  theoryGroups = [],
  onAddTheoryGroup,
  onRemoveTheoryGroup,
  onUpdateTheoryField,
  onAddPracticeToTheory,
  onUpdatePracticeField,
  onRemovePracticeFromTheory
}) {
  const weekDays = DAYS.filter(d => d.key !== 'DOM');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
          ⚡ Secciones de Teoría vinculadas a Prácticas
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
              <div className="col-span-4">
                <label className="text-[9px] font-bold text-purple-300 uppercase block mb-0.5">NRC Teoría</label>
                <input
                  type="text"
                  placeholder="Ej. 15660"
                  value={tg.theoryNrc}
                  onChange={(e) => onUpdateTheoryField(courseId, tgIdx, 'theoryNrc', e.target.value)}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-mono font-bold text-purple-200 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="col-span-3">
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Sección</label>
                <input
                  type="text"
                  value={tg.theorySectionName}
                  onChange={(e) => onUpdateTheoryField(courseId, tgIdx, 'theorySectionName', e.target.value)}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 focus:outline-none"
                />
              </div>
              <div className="col-span-5">
                <label className="text-[9px] font-bold text-slate-400 uppercase block mb-0.5">Prof. Teoría</label>
                <input
                  type="text"
                  placeholder="Profesor"
                  value={tg.theoryProf}
                  onChange={(e) => onUpdateTheoryField(courseId, tgIdx, 'theoryProf', e.target.value)}
                  className="w-full px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300 focus:outline-none"
                />
              </div>
            </div>

            {/* Horario de Teoría con HORAS REDONDAS */}
            <div className="pt-1 border-t border-slate-800/80 flex items-center gap-1.5 text-xs">
              <span className="text-[10px] text-purple-300 font-semibold w-16">Horario:</span>
              <select
                value={tg.theorySchedule[0]?.day || 'LUN'}
                onChange={(e) => {
                  const updated = [...tg.theorySchedule];
                  updated[0] = { ...updated[0], day: e.target.value };
                  onUpdateTheoryField(courseId, tgIdx, 'theorySchedule', updated);
                }}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px] cursor-pointer"
              >
                {weekDays.map(d => (
                  <option key={d.key} value={d.key}>{d.label}</option>
                ))}
              </select>

              <select
                value={tg.theorySchedule[0]?.start || '07:00'}
                onChange={(e) => {
                  const updated = [...tg.theorySchedule];
                  updated[0] = { ...updated[0], start: e.target.value };
                  onUpdateTheoryField(courseId, tgIdx, 'theorySchedule', updated);
                }}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px] font-mono cursor-pointer"
              >
                {ROUND_HOURS_24H.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <span className="text-slate-500 font-bold">-</span>
              <select
                value={tg.theorySchedule[0]?.end || '09:00'}
                onChange={(e) => {
                  const updated = [...tg.theorySchedule];
                  updated[0] = { ...updated[0], end: e.target.value };
                  onUpdateTheoryField(courseId, tgIdx, 'theorySchedule', updated);
                }}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px] font-mono cursor-pointer"
              >
                {ROUND_HOURS_24H.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Prácticas asociadas */}
          <div className="space-y-2 pl-3 border-l-2 border-purple-500/40">
            <div className="flex items-center justify-between text-[10px]">
              <span className="font-bold text-slate-300">
                Prácticas asociadas a este NRC de Teoría ({tg.practices.length}):
              </span>
              <button
                type="button"
                onClick={() => onAddPracticeToTheory(courseId, tgIdx)}
                className="text-purple-300 hover:text-white font-semibold cursor-pointer transition"
              >
                + Agregar Práctica
              </button>
            </div>

            {tg.practices.map((pr, prIdx) => (
              <div key={pr.id || prIdx} className="bg-slate-950/90 p-2 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-24">
                    <label className="text-[9px] text-slate-400 uppercase font-bold block">NRC Práctica</label>
                    <input
                      type="text"
                      placeholder="Ej. 15683"
                      value={pr.practiceNrc}
                      onChange={(e) => onUpdatePracticeField(courseId, tgIdx, prIdx, 'practiceNrc', e.target.value)}
                      className="w-full px-1.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs font-mono font-bold text-indigo-300 focus:outline-none"
                    />
                  </div>
                  <div className="w-20">
                    <label className="text-[9px] text-slate-400 uppercase font-bold block">Sección</label>
                    <input
                      type="text"
                      value={pr.practiceSectionName}
                      onChange={(e) => onUpdatePracticeField(courseId, tgIdx, prIdx, 'practiceSectionName', e.target.value)}
                      className="w-full px-1.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] text-slate-400 uppercase font-bold block">Profesor</label>
                    <input
                      type="text"
                      placeholder="Opcional"
                      value={pr.practiceProf}
                      onChange={(e) => onUpdatePracticeField(courseId, tgIdx, prIdx, 'practiceProf', e.target.value)}
                      className="w-full px-1.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300 focus:outline-none"
                    />
                  </div>
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

                {/* Horario de Práctica con HORAS REDONDAS */}
                <div className="flex items-center gap-1.5 text-xs pt-1 border-t border-slate-800/60">
                  <select
                    value={pr.practiceSchedule[0]?.day || 'MIE'}
                    onChange={(e) => {
                      const updated = [...pr.practiceSchedule];
                      updated[0] = { ...updated[0], day: e.target.value };
                      onUpdatePracticeField(courseId, tgIdx, prIdx, 'practiceSchedule', updated);
                    }}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-slate-200 text-[11px] cursor-pointer"
                  >
                    {weekDays.map(d => (
                      <option key={d.key} value={d.key}>{d.label}</option>
                    ))}
                  </select>

                  <select
                    value={pr.practiceSchedule[0]?.start || '07:00'}
                    onChange={(e) => {
                      const updated = [...pr.practiceSchedule];
                      updated[0] = { ...updated[0], start: e.target.value };
                      onUpdatePracticeField(courseId, tgIdx, prIdx, 'practiceSchedule', updated);
                    }}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-slate-200 text-[11px] font-mono cursor-pointer"
                  >
                    {ROUND_HOURS_24H.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span className="text-slate-500 font-bold">-</span>
                  <select
                    value={pr.practiceSchedule[0]?.end || '09:00'}
                    onChange={(e) => {
                      const updated = [...pr.practiceSchedule];
                      updated[0] = { ...updated[0], end: e.target.value };
                      onUpdatePracticeField(courseId, tgIdx, prIdx, 'practiceSchedule', updated);
                    }}
                    className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-slate-200 text-[11px] font-mono cursor-pointer"
                  >
                    {ROUND_HOURS_24H.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
