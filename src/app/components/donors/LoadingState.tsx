/**
 * Loading State
 *
 * Skeleton loader displayed while donor data is being fetched.
 * Provides visual feedback to users during API requests.
 */

export function LoadingState() {
  return (
    <div className="w-full animate-pulse">
      {/* Table header skeleton */}
      <div className="flex gap-4 mb-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-8 bg-muted rounded flex-1" />
        ))}
      </div>

      {/* Table rows skeleton */}
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4 mb-3">
          {/* Name column - wider */}
          <div className="h-12 bg-muted rounded flex-[2]" />
          {/* Other columns */}
          {Array.from({ length: 6 }).map((_, colIndex) => (
            <div key={colIndex} className="h-12 bg-muted rounded flex-1" />
          ))}
        </div>
      ))}

      {/* Pagination skeleton */}
      <div className="flex justify-between items-center mt-6">
        <div className="h-8 w-32 bg-muted rounded" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-8 bg-muted rounded" />
          ))}
        </div>
        <div className="h-8 w-24 bg-muted rounded" />
      </div>
    </div>
  );
}
