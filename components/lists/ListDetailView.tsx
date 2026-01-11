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
    console.log("list:", list);
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
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => router.push("/lists")}
          className="text-blue-500 hover:underline"
        >
          &larr; Back to Lists
        </button>

        <div className="flex gap-2">
          {isOwner && (
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Share / Manage Access
            </button>
          )}

          {isOwner && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="text-red-600 hover:underline text-sm"
            >
              Delete List
            </button>
          )}
        </div>
      </div>

      {/* List Name */}
      <div className="mb-4">
        {isEditingName && isOwner ? (
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
            className={`text-2xl font-semibold ${
              isOwner ? "cursor-pointer" : ""
            }`}
            onClick={() => isOwner && setIsEditingName(true)}
          >
            {list.name}
          </h1>
        )}
      </div>

      {/* List Items */}
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
      {canEditItems && <AddListItem onAdd={handleAddItem} />}

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
