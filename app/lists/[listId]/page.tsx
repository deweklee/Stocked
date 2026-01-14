import { Suspense } from "react";
import { ListPageLoader } from "./ListPageLoader";

export default function Page({
  params,
}: {
  params: Promise<{ listId: string }>;
}) {
  return (
    <Suspense fallback={<ListPageSkeleton />}>
      <ListPageLoader params={params} />
    </Suspense>
  );
}

function ListPageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto p-4 text-gray-400">Loading list…</div>
  );
}
