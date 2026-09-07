import React from 'react';

export function CalendarSlot({
  topPercent,
  heightPercent,
  courseName,
  courseId,
  nrc,
  sectionName,
  prof,
  subType,
  timeRange,
  color,
  isVirtual
}) {
  if (isVirtual) {
    return (
      <div
        style={{
          top: `${Math.max(0, topPercent)}%`,
          height: `${Math.max(4, heightPercent)}%`
        }}
        className="absolute inset-x-1.5 rounded-xl p-2.5 text-white border border-emerald-400 bg-emerald-800/90 shadow-lg flex flex-col justify-between overflow-hidden transition-all duration-200 hover:scale-[1.01] hover:z-10"
      >
        <div>
          <div className="flex items-start justify-between gap-1">
            <p className="font-bold text-xs leading-tight break-words">
              {courseName}
            </p>
            <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-black/40 text-emerald-200 border border-emerald-300/30 whitespace-nowrap">
              NRC {nrc}
            </span>
          </div>
          <p className="text-[10px] font-mono text-emerald-200 mt-0.5 flex items-center gap-1">
            <span>🌐 Asíncrona / Virtual</span> • {sectionName}
          </p>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-emerald-100 pt-1 border-t border-emerald-500/30 mt-1">
          <span>{timeRange}</span>
          <span className="font-sans text-[9px] bg-emerald-950/60 px-1 py-0.5 rounded">
            Horario libre
          </span>
        </div>
      </div>
    );
  }

  const bgClass = color?.bg || 'bg-indigo-600/90';
  const borderClass = color?.border || 'border-indigo-400';

  return (
    <div
      style={{
        top: `${Math.max(0, topPercent)}%`,
        height: `${Math.max(4, heightPercent)}%`
      }}
      className={`absolute inset-x-1.5 rounded-xl p-2.5 text-white border shadow-lg flex flex-col justify-between overflow-hidden transition-all duration-200 hover:scale-[1.01] hover:z-10 ${bgClass} ${borderClass}`}
    >
      <div>
        <div className="flex items-start justify-between gap-1">
          <p className="font-bold text-xs leading-tight break-words drop-shadow-sm">
            {courseName} {subType && <span className="opacity-80">[{subType}]</span>}
          </p>
          <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-black/40 text-white/95 border border-white/20 whitespace-nowrap">
            NRC {nrc}
          </span>
        </div>
        <p className="text-[10px] font-mono text-white/80 mt-0.5">
          {courseId} • {sectionName}
        </p>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono text-white/90 pt-1 border-t border-white/10 mt-1">
        <span>{timeRange}</span>
        {prof && (
          <span className="truncate max-w-[110px] font-sans opacity-90" title={prof}>
            {prof}
          </span>
        )}
      </div>
    </div>
  );
}
