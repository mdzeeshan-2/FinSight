import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-xl text-foreground">Page not found</p>
      <p className="mt-2 text-muted">The page you're looking for doesn't exist.</p>
      <Button asChild className="mt-8">
        <Link to="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
