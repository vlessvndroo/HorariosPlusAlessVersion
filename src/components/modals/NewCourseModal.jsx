import React, { useState } from 'react';

export function NewCourseModal({ onClose, onCreateCourse }) {
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseMode, setNewCourseMode] = useState('standard');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newCourseCode.trim() || !newCourseName.trim()) return;

    onCreateCourse({
      code: newCourseCode.trim().toUpperCase(),
      name: newCourseName.trim(),
      mode: newCourseMode
    });
    onClose();
  };

  return (
    <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-950/20 space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-xs font-bold text-indigo-300">Nueva Materia Personalizada</h4>
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-white text-xs cursor-pointer"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Código de la Materia</label>
          <input
            type="text"
            placeholder="Ej. ELECT-01"
            value={newCourseCode}
            onChange={(e) => setNewCourseCode(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white uppercase font-mono focus:outline-none focus:border-indigo-500"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Nombre de la Materia</label>
          <input
            type="text"
            placeholder="Ej. Asignatura Especial"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            required
          />
        </div>

        <div>
          <label className="text-[10px] text-slate-400 block mb-1">Modalidad de la Materia</label>
          <select
            value={newCourseMode}
            onChange={(e) => setNewCourseMode(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
          >
            <option value="standard">🏛️ Presencial Estándar (1 solo NRC por sección)</option>
            <option value="theory_practice">⚡ Teoría + Práctica (NRC de Teoría vinculado a Práctica)</option>
            <option value="virtual">🌐 Virtual / Asíncrona (Sin horario presencial, en Domingo)</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-3 py-1.5 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow transition cursor-pointer"
          >
            Guardar y Seleccionar
          </button>
        </div>
      </form>
    </div>
  );
}
