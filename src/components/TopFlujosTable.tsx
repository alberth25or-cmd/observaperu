"use client";

interface Flujo {
  origen: string;
  destino: string;
  count: number;
}

interface TopFlujosTableProps {
  flujos: Flujo[];
}

export default function TopFlujosTable({ flujos }: TopFlujosTableProps) {
  if (!flujos?.length) {
    return (
      <div className="py-4 text-center text-slate-500 text-sm">
        No hay flujos entre departamentos
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-600 font-semibold">
            <th className="py-2 pr-4">Origen</th>
            <th className="py-2 pr-4">Destino</th>
            <th className="py-2 text-right">Candidatos</th>
          </tr>
        </thead>
        <tbody>
          {flujos.map((f, i) => (
            <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-2 pr-4 font-medium text-[#0b1b3b]">
                {f.origen}
              </td>
              <td className="py-2 pr-4 text-slate-700">{f.destino}</td>
              <td className="py-2 text-right font-semibold text-[#1b2b5a]">
                {f.count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
