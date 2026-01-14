export const dynamic = "force-dynamic";

import { ListDetailView } from "@/components/lists/ListDetailView";

export default function ListPage({ listId }: { listId: string }) {
  return (
    <main className="p-6">
      <ListDetailView listId={listId} />
    </main>
  );
}
