export function Ambient() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="lamp absolute inset-0" />
      <div className="rain absolute inset-0 opacity-40" />
      <div className="vignette absolute inset-0" />
      <div className="grain absolute inset-0" />
    </div>
  );
}
