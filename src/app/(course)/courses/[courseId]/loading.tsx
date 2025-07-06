import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="max-w-4xl mx-auto pb-20 px-4">
      <div className="pt-8 pb-4">
        <Skeleton className="h-8 w-2/3 mb-2" />
        <Skeleton className="h-5 w-1/3" />
      </div>
      <div className="relative aspect-video rounded-md overflow-hidden mb-8">
        <Skeleton className="w-full h-full absolute inset-0" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
};

export default Loading;