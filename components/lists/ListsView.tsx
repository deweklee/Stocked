"use client";

import { useLists } from "@/hooks/useLists";

export function ListsView() {
  const { data: lists, isLoading, error } = useLists();

  if (isLoading) return <div>Loading lists...</div>;
  if (error) return <div>Failed to load lists</div>;
  if (!lists || lists.length === 0) return <div>No lists yet</div>;

  return (
    <ul className="space-y-2">
      {lists.map((list) => (
        <li key={list.id} className="border rounded p-3 flex justify-between">
          <span>
            {list.name}, id: {list.id}, created at {list.created_at}
          </span>

          {list.is_public && (
            <span className="text-sm text-gray-500">Public</span>
          )}
        </li>
      ))}
    </ul>
  );
}
