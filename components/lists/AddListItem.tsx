"use client";

import CreatableSelect from "react-select/creatable";
import {
  useCreateCustomIngredient,
  useCustomIngredients,
  useIngredients,
} from "@/hooks/useIngredients";
import { IngredientOption } from "@/types";
import { useState } from "react";

type Props = {
  onAdd: (option: IngredientOption) => Promise<void>;
};

export function AddListItem({ onAdd }: Props) {
  const { data: ingredients, isLoading: ingredientsLoading } = useIngredients();
  const { data: customIngredients, isLoading: customIngredientsLoading } =
    useCustomIngredients();

  const createCustomIngredientMutation = useCreateCustomIngredient();

  const [selectedOption, setSelectedOption] = useState<IngredientOption | null>(
    null
  );

  if (ingredientsLoading || customIngredientsLoading) {
    return <div>Loading ingredients...</div>;
  }

  const ingredientOptions: IngredientOption[] = [
    ...(ingredients
      ?.filter((i) => i.name)
      .map((i) => ({
        value: i.id,
        label: i.name!,
        isCustom: false,
      })) ?? []),

    ...(customIngredients
      ?.filter((i) => i.name)
      .map((i) => ({
        value: i.id,
        label: `${i.name!} (Custom)`,
        isCustom: true,
      })) ?? []),
  ];

  async function handleAdd() {
    if (!selectedOption) return;

    await onAdd(selectedOption);
    setSelectedOption(null);
  }

  return (
    <div className="mt-4 border-t pt-4">
      <h2 className="font-semibold mb-2">Add Item</h2>

      <div className="flex gap-2">
        <div className="flex-1">
          <CreatableSelect
            isClearable
            placeholder="Search or add ingredient..."
            options={ingredientOptions}
            value={selectedOption}
            onChange={(option) => setSelectedOption(option as IngredientOption)}
            onCreateOption={async (inputValue) => {
              const created = await createCustomIngredientMutation.mutateAsync(
                inputValue.trim()
              );

              setSelectedOption({
                value: created.id,
                label: `${created.name} (Custom)`,
                isCustom: true,
              });
            }}
            styles={{
              control: (base) => ({ ...base, color: "black" }),
              singleValue: (base) => ({ ...base, color: "black" }),
              input: (base) => ({ ...base, color: "black" }),
              option: (base, state) => ({
                ...base,
                color: "black",
                backgroundColor: state.isFocused ? "#e5e7eb" : "white",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#6b7280",
              }),
            }}
          />
        </div>

        <button
          onClick={handleAdd}
          disabled={!selectedOption}
          className="bg-blue-500 text-white px-3 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}
