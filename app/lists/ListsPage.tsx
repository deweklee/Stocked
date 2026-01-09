"use client";

import { ListsView } from "@/components/lists/ListsView";

export default function ListsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Lists</h1>
      <ListsView />
    </main>
  );
}
