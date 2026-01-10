"use client";

import { useCreateList } from "@/hooks/useList";
import { useLists } from "@/hooks/useLists";
import { useRouter } from "next/navigation";

export function ListsView() {
  const { data: lists, isLoading, error } = useLists();
  const createListMutation = useCreateList();
  const router = useRouter();

  if (isLoading) return <div>Loading lists...</div>;
  if (error) return <div>Failed to load lists</div>;

  async function handleAddList() {
    try {
      const newList = await createListMutation.mutateAsync("Untitled List");
      router.push(`/lists/${newList.id}`);
    } catch (err) {
      console.error("Failed to create list:", err);
    }
  }

  return (
    <div>
      {/* Add List Button */}
      <button
        onClick={handleAddList}
        className="mb-4 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        + Add List
      </button>

      {(!lists || lists.length === 0) && <div>No lists yet</div>}

      <ul className="space-y-2">
        {lists?.map((list) => (
          <li
            key={list.id}
            className="border rounded p-3 flex justify-between cursor-pointer hover:bg-gray-100"
            onClick={() => router.push(`/lists/${list.id}`)}
          >
            <span>
              {list.name}, id: {list.id}, created at {list.created_at}
            </span>

            {list.is_public && (
              <span className="text-sm text-gray-500">Public</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
