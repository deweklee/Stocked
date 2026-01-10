"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useList, useUpdateList } from "@/hooks/useList";
import { useAddListItem, useListItems } from "@/hooks/useListItems";

import { ListItemRow } from "./ListItemRow";
import { AddListItem } from "./AddListItem";

import { IngredientOption } from "@/types";

export function ListDetailView({ listId }: { listId: string }) {
  const router = useRouter();

  const { data: list, isLoading: listLoading } = useList(listId);
  const { data: items, isLoading: itemsLoading } = useListItems(listId);

  const addItem = useAddListItem(listId);
  const updateListMutation = useUpdateList();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (list) setNewName(list.name);
  }, [list]);

  if (listLoading || itemsLoading) {
    return <div>Loading...</div>;
  }

  if (!list) {
    return <div>List not found</div>;
  }

  async function handleSaveName() {
    if (!list) return;

    if (!newName.trim() || newName === list.name) {
      setIsEditingName(false);
      return;
    }

    try {
      await updateListMutation.mutateAsync({
        listId: list.id,
        updates: { name: newName },
      });
      setIsEditingName(false);
    } catch (err) {
      console.error("Failed to update list name:", err);
    }
  }

  async function handleAddItem(option: IngredientOption) {
    if (!list) return;

    await addItem.mutateAsync(
      option.isCustom
        ? {
            list_id: list.id,
            custom_ingredient_id: option.value,
          }
        : {
            list_id: list.id,
            ingredient_id: option.value,
          }
    );
  }

  return (
    <div>
      {/* Back Button */}
      <button
        onClick={() => router.push("/lists")}
        className="mb-4 text-blue-500 hover:underline"
      >
        &larr; Back to Lists
      </button>

      {/* Editable List Name */}
      <div className="mb-4">
        {isEditingName ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              className="border p-1 rounded flex-1"
              autoFocus
            />
            <button
              onClick={handleSaveName}
              className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditingName(false);
                setNewName(list.name);
              }}
              className="bg-gray-300 px-3 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        ) : (
          <h1
            className="text-2xl font-semibold cursor-pointer"
            onClick={() => setIsEditingName(true)}
          >
            {list.name}
          </h1>
        )}
      </div>

      {/* List Items */}
      <ul className="space-y-2">
        {items?.map((item) => (
          <ListItemRow key={item.id} item={item} />
        ))}
      </ul>

      {items?.length === 0 && <div className="text-gray-400">No items yet</div>}

      {/* Add Item */}
      <AddListItem onAdd={handleAddItem} />
    </div>
  );
}
