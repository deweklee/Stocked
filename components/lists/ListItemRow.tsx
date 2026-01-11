"use client";

import { useDeleteListItem, useToggleListItem } from "@/hooks/useListItems";
import { ListItemWithIngredient } from "@/lib/list-items";

type Props = {
  item: ListItemWithIngredient;
  canRemove: boolean;
  canToggle: boolean;
};

export function ListItemRow({ item, canRemove, canToggle }: Props) {
  const deleteItem = useDeleteListItem(item.list_id);
  const toggleItem = useToggleListItem(item.list_id);

  const name = item.ingredient?.name ?? item.custom_ingredient?.name;

  return (
    <li className="flex items-center justify-between border rounded p-2">
      <label className="flex items-center gap-2 flex-1">
        <input
          type="checkbox"
          checked={!!item.checked}
          disabled={!canToggle}
          onChange={() =>
            toggleItem.mutate({
              itemId: item.id,
              checked: !item.checked,
            })
          }
        />

        <span
          className={`${item.checked ? "line-through text-gray-400" : ""} ${
            !canToggle ? "opacity-70" : ""
          }`}
        >
          {name}
        </span>
      </label>

      {canRemove && (
        <button
          onClick={() => deleteItem.mutate(item.id)}
          className="text-sm text-red-500 hover:underline"
        >
          Remove
        </button>
      )}
    </li>
  );
}
