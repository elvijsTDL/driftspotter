"use client";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-surface-lighter rounded-xl ${className}`} />
  );
}

export function ThreadSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <div className="hidden sm:flex items-center gap-6">
        <Skeleton className="w-10 h-8" />
        <Skeleton className="w-10 h-8" />
        <Skeleton className="w-10 h-8" />
      </div>
    </div>
  );
}

export function CategorySkeleton() {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="w-11 h-11 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="w-9 h-9 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
