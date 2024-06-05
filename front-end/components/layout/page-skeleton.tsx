import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
export default function PageSkeleton() {
  return (
    <div>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-y-6 px-2 sm:py-5">
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-5 w-14 rounded" />
          <Skeleton className="h-5 w-14 rounded" />
        </nav>
      </aside>
      <div className="container flex justify-center pt-8">
        <Card className="w-10/12 h-96">
          <CardContent className="flex justify-center pt-4">
            <Skeleton className="h-80 w-full rounded-xl mt-5" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
