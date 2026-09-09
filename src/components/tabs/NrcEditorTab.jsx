import React from 'react';
import { StandardSectionEditor } from '../sections/StandardSectionEditor';
import { TheoryPracticeEditor } from '../sections/TheoryPracticeEditor';
import { VirtualSectionEditor } from '../sections/VirtualSectionEditor';
import { createDefaultOfferForMode } from '../../services/schedulerEngine';

export function NrcEditorTab({
  currentCareer,
  selectedCourses,
  courseOffer,
  combinationsCount,
  onChangeCourseMode,
  onGoToCourses,
  onGoToCombinations,
  // Standard actions
  onAddStandardSection,
  onRemoveStandardSection,
  onUpdateStandardSectionField,
  onAddStandardSlot,
  onRemoveStandardSlot,
  onUpdateStandardSlot,
  // Theory & Practice actions
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
  onUpdatePracticeSlot,
  // Virtual actions
  onAddVirtualSection,
  onRemoveVirtualSection,
  onUpdateVirtualSection
}) {
  if (selectedCourses.length === 0) {
    return (
      <div className="text-center py-12 px-4 border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
        <span className="text-3xl block mb-2">{currentCareer.icon}</span>
        <p className="text-xs font-semibold text-slate-300">
          No has seleccionado materias en {currentCareer.name}
        </p>
        <button
          onClick={onGoToCourses}
          className="mt-4 px-3.5 py-2 rounded-xl bg-indigo-600/30 text-indigo-300 hover:bg-indigo-600/50 text-xs font-semibold transition cursor-pointer"
        >
          Ir a Seleccionar Materias
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] text-slate-400">
          Formato de <b>horas redondas (24h)</b>.
        </p>
        <button
          onClick={onGoToCombinations}
          className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
        >
          Ver combinaciones →
        </button>
      </div>

      {selectedCourses.map((course) => {
        const offer = courseOffer[course.id] || createDefaultOfferForMode(course.mode || 'standard');
        const mode = offer.mode || course.mode || 'standard';

        return (
          <div
            key={course.id}
            className="border border-slate-800 bg-slate-950/60 rounded-2xl p-3 sm:p-3.5 space-y-3 shadow-sm hover:border-slate-700/80 transition"
          >
            <div className="border-b border-slate-800/80 pb-2.5">
              <h3 className="text-xs sm:text-sm font-bold text-white leading-snug">
                {course.name}
              </h3>
              
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {course.id}
                </span>
                
                <div className="flex flex-wrap items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 text-[10px]">
                  <button
                    type="button"
                    onClick={() => onChangeCourseMode(course.id, 'standard')}
                    className={`px-2 py-1 rounded cursor-pointer transition ${
                      mode === 'standard' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Estándar
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeCourseMode(course.id, 'theory_practice')}
                    className={`px-2 py-1 rounded cursor-pointer transition ${
                      mode === 'theory_practice' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Teoría + Práctica
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeCourseMode(course.id, 'virtual')}
                    className={`px-2 py-1 rounded cursor-pointer transition ${
                      mode === 'virtual' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Virtual (V)
                  </button>
                </div>
              </div>
            </div>

            {/* MODO VIRTUAL */}
            {mode === 'virtual' && (
              <VirtualSectionEditor
                courseId={course.id}
                virtualSections={offer.virtualSections}
                onAddSection={onAddVirtualSection}
                onUpdateSection={onUpdateVirtualSection}
                onRemoveSection={onRemoveVirtualSection}
              />
            )}

            {/* MODO TEORÍA + PRÁCTICA */}
            {mode === 'theory_practice' && (
              <TheoryPracticeEditor
                courseId={course.id}
                theoryGroups={offer.theoryGroups}
                onAddTheoryGroup={onAddTheoryGroup}
                onRemoveTheoryGroup={onRemoveTheoryGroup}
                onUpdateTheoryField={onUpdateTheoryField}
                onAddTheorySlot={onAddTheorySlot}
                onRemoveTheorySlot={onRemoveTheorySlot}
                onUpdateTheorySlot={onUpdateTheorySlot}
                onAddPracticeToTheory={onAddPracticeToTheory}
                onUpdatePracticeField={onUpdatePracticeField}
                onRemovePracticeFromTheory={onRemovePracticeFromTheory}
                onAddPracticeSlot={onAddPracticeSlot}
                onRemovePracticeSlot={onRemovePracticeSlot}
                onUpdatePracticeSlot={onUpdatePracticeSlot}
              />
            )}

            {/* MODO ESTÁNDAR */}
            {mode === 'standard' && (
              <StandardSectionEditor
                courseId={course.id}
                sections={offer.sections}
                onAddSection={onAddStandardSection}
                onRemoveSection={onRemoveStandardSection}
                onUpdateField={onUpdateStandardSectionField}
                onAddSlot={onAddStandardSlot}
                onRemoveSlot={onRemoveStandardSlot}
                onUpdateSlot={onUpdateStandardSlot}
              />
            )}
          </div>
        );
      })}

      <div className="pt-2 sticky bottom-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a] to-transparent pb-1">
        <button
          onClick={onGoToCombinations}
          className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
        >
          <span>Ver Combinaciones Generadas ({combinationsCount > 0 ? combinationsCount : '0'})</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}
