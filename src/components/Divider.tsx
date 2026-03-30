export default function Divider() {
  return (
    <div className="flex w-full items-center gap-x-4 text-gold">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/40" />
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="divider-ornament"
      >
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
        <circle cx="6" cy="6" r="2" fill="currentColor" />
      </svg>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/40" />
    </div>
  );
}
