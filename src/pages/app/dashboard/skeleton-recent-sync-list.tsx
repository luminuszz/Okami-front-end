import { Skeleton } from '@/components/ui/skeleton'

export function SkeletonRecentSyncList() {
  return Array.from({ length: 7 }).map((_, index) => (
    <div className="flex justify-between" key={index}>
      <header className="flex items-center justify-center gap-3">
        <Skeleton className="size-10 rounded-full" />

        <div className="flex w-full flex-col gap-2">
          <Skeleton className="h-4 w-[500px]  rounded-md" />
          <Skeleton className="w-50  h-3 w-[30%]  rounded-md" />
        </div>
      </header>

      <aside className="space-y-2">
        <Skeleton className="h-2 w-24 rounded-md" />
        <Skeleton className="h-2 w-24 rounded-md" />
      </aside>
    </div>
  ))
}
