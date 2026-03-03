"use client";

interface BoxplotData {
  min: number;
  q1: number;
  mediana: number;
  q3: number;
  max: number;
}

interface PostulacionesBoxplotVisualProps {
  data: BoxplotData;
  label: string;
  color?: string;
}

export default function PostulacionesBoxplotVisual({
  data,
  label,
  color = "#1b2b5a",
}: PostulacionesBoxplotVisualProps) {
  const range = data.max - data.min || 1;
  const scale = (v: number) => ((v - data.min) / range) * 100;

  return (
    <div className="w-full">
      <p className="text-xs font-semibold text-slate-600 mb-2">{label}</p>
      <div className="relative h-14 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
        <div className="absolute inset-y-0 left-0 right-0 flex items-stretch">
          <div
            className="absolute bottom-0 top-0 border-l-2 border-slate-300"
            style={{ left: `${scale(data.min)}%` }}
          />
          <div
            className="absolute bottom-0 top-0 bg-slate-200/60"
            style={{
              left: `${scale(data.q1)}%`,
              width: `${scale(data.mediana) - scale(data.q1)}%`,
            }}
          />
          <div
            className="absolute bottom-0 top-0 bg-slate-300"
            style={{
              left: `${scale(data.mediana)}%`,
              width: `${scale(data.q3) - scale(data.mediana)}%`,
            }}
          />
          <div
            className="absolute bottom-0 top-0 bg-slate-200/60"
            style={{
              left: `${scale(data.q3)}%`,
              width: `${scale(data.max) - scale(data.q3)}%`,
            }}
          />
          <div
            className="absolute bottom-0 top-0 border-r-2 border-slate-300"
            style={{ left: `${scale(data.max)}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
        <span>Min: {data.min}</span>
        <span>Q1: {data.q1}</span>
        <span>Med: {data.mediana}</span>
        <span>Q3: {data.q3}</span>
        <span>Máx: {data.max}</span>
      </div>
    </div>
  );
}
