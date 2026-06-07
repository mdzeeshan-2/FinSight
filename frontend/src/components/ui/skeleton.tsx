import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-gradient-to-r from-card via-card-hover to-card bg-[length:200%_100%] animate-shimmer',
        className
      )}
    />
  );
}
