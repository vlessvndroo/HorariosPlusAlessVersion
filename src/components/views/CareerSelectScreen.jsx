import React from 'react';
import { CAREERS } from '../../constants/careers';

export function CareerSelectScreen({ onSelectCareer }) {
  return (
    <div className="min-h-screen w-full bg-[#0b0f19] flex flex-col items-center justify-center p-4 sm:p-6 text-slate-100 font-sans relative overflow-y-auto overflow-x-hidden">
      {/* Luces de fondo decorativas */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center space-y-6 sm:space-y-8 z-10 my-auto py-6">
        {/* Encabezado */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-400 shadow-sm">
            <span>⚡</span> UCAB • Universidad Católica Andrés Bello
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Generador de Horarios
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Bienvenido. Para comenzar a planificar y calcular tus combinaciones de materias sin choques, selecciona tu carrera:
          </p>
        </div>

        {/* Tarjetas de Selección de Carrera */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Opción 1: Ingeniería Informática */}
          <div
            onClick={() => onSelectCareer('informatica')}
            className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/80 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer text-left space-y-4 shadow-xl hover:shadow-indigo-600/10 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl p-3 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 group-hover:scale-110 transition">
                {CAREERS.informatica.icon}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                8 Semestres
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
                {CAREERS.informatica.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {CAREERS.informatica.faculty} • Pensum Oficial
              </p>
            </div>

            <button className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20">
              <span>Planificar {CAREERS.informatica.shortName}</span>
              <span>→</span>
            </button>
          </div>

          {/* Opción 2: Psicología */}
          <div
            onClick={() => onSelectCareer('psicologia')}
            className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-purple-500/80 hover:bg-slate-900/90 transition-all duration-200 cursor-pointer text-left space-y-4 shadow-xl hover:shadow-purple-600/10 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-4xl p-3 rounded-2xl bg-purple-600/10 border border-purple-500/20 group-hover:scale-110 transition">
                {CAREERS.psicologia.icon}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                8 Semestres
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition">
                {CAREERS.psicologia.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {CAREERS.psicologia.faculty} • Pensum Oficial
              </p>
            </div>

            <button className="w-full py-2.5 px-4 rounded-xl bg-purple-600 group-hover:bg-purple-500 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20">
              <span>Planificar {CAREERS.psicologia.shortName}</span>
              <span>→</span>
            </button>
          </div>

        </div>

        {/* Pie de pantalla inicial */}
        <p className="text-[11px] text-slate-500">
          Podrás alternar entre carreras en cualquier momento sin perder los datos cargados de ninguna.
        </p>

        {/* Firma del autor */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col items-center justify-center space-y-2.5">
          <div className="inline-flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-800 shadow-xl shadow-black/30 hover:border-indigo-500/50 transition-all duration-300 group">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="text-xs text-slate-400">Hecho con dedicación por</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
              Javier Alessandro Di Addezio
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] text-slate-500">
            <span>🎓 Para la comunidad estudiantil UCAB</span>
            <span className="hidden sm:inline">•</span>
            <a
              href="https://github.com/vlessvndroo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-400 transition-colors inline-flex items-center gap-1"
            >
              <span>GitHub @vlessvndroo</span>
              <span className="text-[10px]">↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
