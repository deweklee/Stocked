"use client";

import { use } from "react";
import ListPage from "./ListPage";

export function ListPageLoader({
  params,
}: {
  params: Promise<{ listId: string }>;
}) {
  const { listId } = use(params);
  return <ListPage listId={listId} />;
}
