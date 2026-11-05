/** Fundo do app: luz e duas curvas amplas, que aparecem refratadas atrás do vidro. */
export function Scene() {
  return (
    <div className="scene" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full blur-[10px]" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" fill="none">
        <defs>
          <linearGradient id="scene-curve" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#E4F5C0" stopOpacity="0.34" />
            <stop offset="0.5" stopColor="#8FC3A4" stopOpacity="0.07" />
            <stop offset="1" stopColor="#E4F5C0" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <circle cx="880" cy="250" r="400" stroke="url(#scene-curve)" strokeWidth="70" />
        <circle cx="90" cy="860" r="330" stroke="url(#scene-curve)" strokeWidth="46" />
      </svg>
    </div>
  );
}
