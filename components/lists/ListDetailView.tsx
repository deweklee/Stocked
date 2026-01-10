"use client";

import { useList, useUpdateList } from "@/hooks/useList";
import { useAddListItem, useListItems } from "@/hooks/useListItems";
import { ListItemRow } from "./ListItemRow";
import { useCustomIngredients, useIngredients } from "@/hooks/useIngredients";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function ListDetailView({ listId }: { listId: string }) {
  const router = useRouter();

  const { data: list, isLoading: listLoading } = useList(listId);
  const { data: items, isLoading: itemsLoading } = useListItems(listId);
  const { data: ingredients, isLoading: ingredientsLoading } = useIngredients();
  const { data: customIngredients, isLoading: customIngredientsLoading } =
    useCustomIngredients();

  const addItem = useAddListItem(listId);
  const updateListMutation = useUpdateList();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");

  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (list) setNewName(list.name);
  }, [list]);

  if (
    listLoading ||
    itemsLoading ||
    ingredientsLoading ||
    customIngredientsLoading
  )
    return <div>Loading...</div>;
  if (!list) return <div>List not found</div>;

  // Merge global and custom ingredients with isCustom flag
  const mergedIngredients = (
    ingredients?.map((i) => ({ id: i.id, name: i.name, isCustom: false })) || []
  ).concat(
    customIngredients?.map((i) => ({
      id: i.id,
      name: i.name,
      isCustom: true,
    })) || []
  );

  async function handleAdd() {
    if (!list || !selectedIngredient) return;

    // Find the selected ingredient from merged list
    const selected = mergedIngredients.find((i) => i.id === selectedIngredient);
    if (!selected) return;

    await addItem.mutateAsync(
      selected.isCustom
        ? { list_id: list.id, custom_ingredient_id: selected.id }
        : { list_id: list.id, ingredient_id: selected.id }
    );

    setSelectedIngredient(null);
  }

  async function handleSaveName() {
    if (!newName.trim() || newName === list!.name) {
      setIsEditingName(false);
      return;
    }

    try {
      await updateListMutation.mutateAsync({
        listId: list!.id,
        updates: { name: newName },
      });
      setIsEditingName(false);
    } catch (err) {
      console.error("Failed to update list name:", err);
    }
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

      <ul className="space-y-2">
        {items?.map((item) => (
          <ListItemRow key={item.id} item={item} />
        ))}
      </ul>

      {items?.length === 0 && <div className="text-gray-400">No items yet</div>}

      {/* Add Item Form */}
      <div className="mt-4 border-t pt-4">
        <h2 className="font-semibold mb-2">Add Item</h2>

        <div className="flex gap-2">
          <select
            value={selectedIngredient ?? ""}
            onChange={(e) => setSelectedIngredient(e.target.value)}
            className="border p-1 rounded flex-1"
          >
            <option value="">Select ingredient</option>
            {mergedIngredients.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} {i.isCustom ? "(Custom)" : ""}
              </option>
            ))}
          </select>

          <button
            onClick={handleAdd}
            className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
