import React, { useState } from 'react';
import { NewCourseModal } from '../modals/NewCourseModal';

export function CourseSelectionTab({
  currentCareer,
  allAvailableCourses,
  selectedCourses,
  customCourses,
  onToggleCourse,
  onCreateCustomCourse,
  onGoToNrcs
}) {
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [showNewCourseModal, setShowNewCourseModal] = useState(false);

  const semestersList = ['Personalizada', 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={`Buscar materia en ${currentCareer.shortName}...`}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={() => setShowNewCourseModal(true)}
            className="px-3 py-2 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <span>+</span> Personalizada
          </button>
        </div>

        {/* Filtros de Semestre */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          <button
            onClick={() => setSelectedSemester('all')}
            className={`px-2.5 py-1 rounded-md transition whitespace-nowrap cursor-pointer ${
              selectedSemester === 'all'
                ? 'bg-slate-700 text-white font-semibold'
                : 'bg-slate-850 text-slate-400 hover:bg-slate-800'
            }`}
          >
            Todos
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
            <button
              key={s}
              onClick={() => setSelectedSemester(s)}
              className={`px-2 py-1 rounded-md transition whitespace-nowrap cursor-pointer ${
                selectedSemester === s
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-850 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Sem {s}
            </button>
          ))}
          {customCourses.length > 0 && (
            <button
              onClick={() => setSelectedSemester('Personalizada')}
              className={`px-2 py-1 rounded-md transition whitespace-nowrap cursor-pointer ${
                selectedSemester === 'Personalizada'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-slate-850 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Personalizadas ({customCourses.length})
            </button>
          )}
        </div>
      </div>

      {/* Modal de Materia Personalizada */}
      {showNewCourseModal && (
        <NewCourseModal
          onClose={() => setShowNewCourseModal(false)}
          onCreateCourse={onCreateCustomCourse}
        />
      )}

      {/* Listado de Materias Filtradas */}
      <div className="space-y-4">
        {semestersList.map(sem => {
          if (selectedSemester !== 'all' && selectedSemester !== sem) return null;

          const coursesInSem = allAvailableCourses.filter(c => c.semester === sem);
          const filtered = coursesInSem.filter(c =>
            c.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
            c.id.toLowerCase().includes(searchFilter.toLowerCase())
          );

          if (filtered.length === 0) return null;

          return (
            <div key={sem} className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  {sem === 'Personalizada' ? 'Materias Personalizadas' : `Semestre ${sem} • ${currentCareer.shortName}`}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {filtered.length} {filtered.length === 1 ? 'materia' : 'materias'}
                </span>
              </div>

              <div className="space-y-1.5">
                {filtered.map(course => {
                  const isSelected = selectedCourses.some(c => c.id === course.id);
                  const selectedObj = selectedCourses.find(c => c.id === course.id);
                  const currentMode = selectedObj ? selectedObj.mode : (course.defaultMode || 'standard');

                  return (
                    <div
                      key={course.id}
                      onClick={() => onToggleCourse(course)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between group ${
                        isSelected
                          ? 'border-indigo-500/70 bg-indigo-950/30 text-white shadow-sm'
                          : 'border-slate-800/80 bg-slate-900/40 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80'
                      }`}
                    >
                      <div className="pr-3 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold leading-tight text-slate-100">{course.name}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            {course.id}
                          </span>

                          {currentMode === 'theory_practice' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              ⚡ Teoría + Práctica
                            </span>
                          )}
                          {currentMode === 'virtual' && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              🌐 Virtual (V)
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-500 text-white'
                            : 'border-slate-700 bg-slate-950 group-hover:border-slate-600'
                        }`}>
                          {isSelected && <span className="text-xs">✓</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {selectedCourses.length > 0 && (
        <div className="pt-2 sticky bottom-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a] to-transparent pb-1">
          <button
            onClick={onGoToNrcs}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            <span>Continuar a Cargar NRCs ({selectedCourses.length})</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
}
