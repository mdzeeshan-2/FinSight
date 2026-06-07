export function FinSightLogo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#3B82F6" />
      <path
        d="M10 26V14h4.5c2.2 0 3.6 1.1 3.6 2.9 0 1.2-.6 2.1-1.6 2.5 1.3.4 2.1 1.5 2.1 3 0 2.2-1.6 3.6-4.2 3.6H10zm3.6-7.8h.8c1 0 1.5-.4 1.5-1.2s-.5-1.1-1.5-1.1h-.8v2.3zm0 5.5h1c1.1 0 1.7-.5 1.7-1.4 0-.9-.6-1.4-1.7-1.4h-1v2.8zM22 26V14h6.5v2.8H25.6v2.5h2.6V22H25.6v4H22z"
        fill="white"
      />
      <circle cx="32" cy="12" r="3" fill="#10B981" />
    </svg>
  );
}
