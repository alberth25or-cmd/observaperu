/** Marca Observa Perú: ícono vectorial + wordmark en la display del sistema. */
const Logo = ({ className = "", light = false }: { className?: string; light?: boolean }) => {
  const color = light ? "#ffffff" : "var(--color-navy)";

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
        className="h-9 w-9 shrink-0"
      >
        <g stroke={color} strokeLinecap="round" fill="none">
          <path d="M7.85 38.47 A25 25 0 1 1 25.53 56.15" strokeWidth="3" />
          <circle cx="32" cy="32" r="10.5" strokeWidth="4" />
          <path d="M24.58 39.42 L17 47" strokeWidth="4.5" />
        </g>
      </svg>
      <span
        className="font-display text-[19px] font-bold tracking-[-0.02em] whitespace-nowrap"
        style={{ color }}
      >
        OBSERVA PERÚ
      </span>
    </span>
  );
};

export default Logo;
