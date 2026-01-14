"use client";

import { useCreateList } from "@/hooks/useList";
import { useLists } from "@/hooks/useLists";
import { useRouter } from "next/navigation";

import { IncomingShares } from "./IncomingShares";
import { useUsers } from "@/hooks/useUsers";

export function ListsView() {
  const { data: lists, isLoading, error } = useLists();
  const { data: userId, isLoading: isUserLoading } = useUsers();
  const createListMutation = useCreateList();
  const router = useRouter();

  if (isLoading || isUserLoading) {
    return <div>Loading lists...</div>;
  }

  if (error) return <div>Failed to load lists</div>;
  if (!userId) return <div>Not authenticated</div>;

  async function handleAddList() {
    try {
      const newList = await createListMutation.mutateAsync("Untitled List");
      router.push(`/lists/${newList.id}`);
    } catch (err) {
      console.error("Failed to create list:", err);
    }
  }

  const myLists = lists?.filter((l) => l.owner_id === userId) ?? [];
  const sharedLists = lists?.filter((l) => l.owner_id !== userId) ?? [];

  const listItemClasses =
    "group border rounded-lg p-3 cursor-pointer flex justify-between items-center " +
    "text-gray-900 dark:text-gray-100 " +
    "bg-white dark:bg-gray-900 " +
    "hover:bg-gray-200 dark:hover:bg-gray-800 " +
    "hover:shadow-sm transition";

  return (
    <div className="space-y-6">
      {/* Incoming Invites */}
      <IncomingShares />

      {/* Add List Button */}
      <button
        onClick={handleAddList}
        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
      >
        + Add List
      </button>

      {/* My Lists */}
      <section>
        <h2 className="text-lg font-semibold mb-2">My Lists</h2>

        {myLists.length === 0 ? (
          <div className="text-gray-400">You don’t own any lists</div>
        ) : (
          <ul className="space-y-2">
            {myLists.map((list) => (
              <li
                key={list.id}
                className={listItemClasses}
                onClick={() => router.push(`/lists/${list.id}`)}
              >
                <span className="font-medium">{list.name}</span>

                {list.is_public && (
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    Public
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Shared Lists */}
      <section>
        <h2 className="text-lg font-semibold mb-2">Shared With Me</h2>

        {sharedLists.length === 0 ? (
          <div className="text-gray-400">No shared lists</div>
        ) : (
          <ul className="space-y-2">
            {sharedLists.map((list) => (
              <li
                key={list.id}
                className={listItemClasses}
                onClick={() => router.push(`/lists/${list.id}`)}
              >
                <span className="font-medium">{list.name}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
