import { Link } from 'react-router-dom';
import { FinSightLogo } from '@/components/common/FinSightLogo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-12 lg:flex">
        <div className="flex items-center gap-3">
          <FinSightLogo className="h-10 w-10" />
          <span className="text-2xl font-bold text-white">FinSight</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight text-white">
            Your money,
            <br />
            intelligently managed
          </h1>
          <p className="mt-4 max-w-md text-lg text-slate-300">
            Smart banking with real-time insights, seamless transfers, and Maya — your AI banking assistant.
          </p>
        </div>

        <div className="relative h-48">
          <svg viewBox="0 0 400 200" className="h-full w-full opacity-80">
            <rect x="20" y="40" width="120" height="80" rx="12" fill="#1E293B" stroke="#3B82F6" strokeWidth="2" />
            <rect x="160" y="20" width="120" height="80" rx="12" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
            <rect x="300" y="50" width="80" height="60" rx="12" fill="#1E293B" stroke="#8B5CF6" strokeWidth="2" />
            <circle cx="80" cy="160" r="20" fill="#10B981" opacity="0.6" />
            <circle cx="200" cy="170" r="15" fill="#3B82F6" opacity="0.6" />
            <circle cx="320" cy="155" r="18" fill="#F59E0B" opacity="0.6" />
          </svg>
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <FinSightLogo />
          <span className="text-xl font-bold">FinSight</span>
        </div>
        <div className="w-full max-w-md">{children}</div>
        <p className="mt-8 text-center text-xs text-muted">
          © 2025 FinSight. Built for modern banking.
        </p>
      </div>
    </div>
  );
}

export function AuthFooterLink({ to, text, linkText }: { to: string; text: string; linkText: string }) {
  return (
    <p className="mt-6 text-center text-sm text-muted">
      {text}{' '}
      <Link to={to} className="font-medium text-primary hover:underline">
        {linkText}
      </Link>
    </p>
  );
}
