import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <div className="flex gap-2 p-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full bg-white"
          >
            <div className="relative w-full aspect-video rounded-md overflow-hidden mb-2">
              <Skeleton className="w-full h-full absolute inset-0" />
            </div>
            <div className="flex flex-col pt-2 gap-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <div className="my-3 flex items-center gap-x-2 text-sm">
                <div className="flex items-center gap-x-1 text-slate-500">
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Loading;
