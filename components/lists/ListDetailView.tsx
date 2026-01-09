"use client";

import { useList } from "@/hooks/useList";

export function ListDetailView({ listId }: { listId: string }) {
  const { data: list, isLoading, error } = useList(listId);

  if (isLoading) return <div>Loading list...</div>;
  if (error) return <div>Failed to load list</div>;
  if (!list) return <div>List not found</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">{list.name}</h1>

      {list.is_public && (
        <span className="text-sm text-gray-500">Public list</span>
      )}

      {/* Items will go here next */}
      <div className="mt-6 text-gray-400">Items coming soon...</div>
    </div>
  );
}
