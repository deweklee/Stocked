"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useDeleteList, useList, useUpdateList } from "@/hooks/useList";
import { useAddListItem, useListItems } from "@/hooks/useListItems";
import { useListRole } from "@/hooks/useListUsers";

import { ListItemRow } from "./ListItemRow";
import { AddListItem } from "./AddListItem";

import { IngredientOption } from "@/types";
import { ConfirmModal } from "../ui/ConfirmModal";
import { ListShareModal } from "./ListShareModal";

export function ListDetailView({ listId }: { listId: string }) {
  const router = useRouter();

  const { data: list, isLoading: listLoading } = useList(listId);
  const { data: items, isLoading: itemsLoading } = useListItems(listId);
  const { data: role, isLoading: roleLoading } = useListRole(listId);

  const addItem = useAddListItem(listId);
  const updateListMutation = useUpdateList();
  const deleteListMutation = useDeleteList();

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const isOwner = role === "owner";
  const isEditor = role === "editor";

  const canViewItems = !!role || list?.is_public;
  const canToggleItems = !!role;
  const canEditItems = isOwner || isEditor;

  useEffect(() => {
    if (!list) return;
    if (list) setNewName(list.name);
  }, [list]);

  if (listLoading || itemsLoading || roleLoading) {
    return <div>Loading...</div>;
  }

  if (!list) {
    return <div>List not found</div>;
  }

  async function handleDeleteList() {
    if (!list) return;

    await deleteListMutation.mutateAsync(list.id);
    router.push("/lists");
  }

  async function handleSaveName() {
    if (!list) return;

    if (!newName.trim() || newName === list.name) {
      setIsEditingName(false);
      return;
    }

    await updateListMutation.mutateAsync({
      listId: list.id,
      updates: { name: newName },
    });

    setIsEditingName(false);
  }

  async function handleAddItem(option: IngredientOption) {
    if (!list) return;
    await addItem.mutateAsync(
      option.isCustom
        ? { list_id: list.id, custom_ingredient_id: option.value }
        : { list_id: list.id, ingredient_id: option.value }
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-0 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push("/lists")}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Lists
        </button>

        <div className="flex gap-2">
          {isOwner && (
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="
                px-3 py-1 rounded
                bg-green-600 text-white
                hover:bg-green-700 transition
              "
            >
              Share / Manage Access
            </button>
          )}

          {isOwner && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-sm text-red-600 hover:underline"
            >
              Delete List
            </button>
          )}
        </div>
      </div>

      {/* List Card */}
      <div className="border rounded-lg p-4 bg-white dark:bg-gray-900">
        {/* List Name */}
        <div className="mb-4">
          {isEditingName && isOwner ? (
            <div className="flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                className="
                  border rounded px-2 py-1 flex-1
                  bg-white dark:bg-gray-800
                  text-gray-900 dark:text-gray-100
                "
                autoFocus
              />

              <button
                onClick={handleSaveName}
                className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700"
              >
                Save
              </button>

              <button
                onClick={() => {
                  setIsEditingName(false);
                  setNewName(list.name);
                }}
                className="
                  bg-gray-300 text-gray-900 px-3 rounded
                  hover:bg-gray-400
                  dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500
                "
              >
                Cancel
              </button>
            </div>
          ) : (
            <h1
              className={`text-2xl font-semibold ${
                isOwner ? "cursor-pointer hover:underline" : ""
              }`}
              onClick={() => isOwner && setIsEditingName(true)}
            >
              {list.name}
            </h1>
          )}

          {list.is_public && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Public list
            </div>
          )}
        </div>

        {/* Items */}
        {canViewItems && (
          <ul className="space-y-2">
            {items?.map((item) => (
              <ListItemRow
                key={item.id}
                item={item}
                canRemove={canEditItems}
                canToggle={canToggleItems}
              />
            ))}
          </ul>
        )}

        {items?.length === 0 && (
          <div className="text-gray-400 mt-2">No items yet</div>
        )}

        {/* Add Item */}
        {canEditItems && (
          <div className="mt-4">
            <AddListItem onAdd={handleAddItem} />
          </div>
        )}
      </div>

      {/* Modals */}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete list?"
        description="This will permanently delete the list and all its items."
        confirmText="Delete"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteList}
      />

      {isOwner && (
        <ListShareModal
          listId={listId}
          open={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}
    </div>
  );
}
