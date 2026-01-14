import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types";

export type ListShare = Tables<"list_shares">;

export type ShareRequest = {
  id: string;
  list_id: string;
  list_name: string;
  inviter_email: string;
  invited_id?: string; // new
  role: "viewer" | "editor" | "owner";
  status: "pending" | "accepted" | "denied";
};

// Fetch all shares for a list
export async function fetchListShares(listId: string): Promise<ListShare[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("list_shares")
    .select("*")
    .eq("list_id", listId)
    .eq("status", "pending");

  if (error) throw error;
  return data ?? [];
}

// Create a new share
export async function createListShare({
  listId,
  email,
  role = "viewer",
}: {
  listId: string;
  email: string;
  role?: "viewer" | "editor";
}): Promise<ListShare> {
  const supabase = createClient();

  // Get current user for inviter_email
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("list_shares")
    .insert([
      {
        list_id: listId,
        email,
        role,
        inviter_email: user.email, // <-- store inviter's email
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}


// Update a share
export async function updateListShare(
  shareId: string,
  updates: Partial<Pick<ListShare, "role" | "status" | "invited_id">>
): Promise<void> {
  const supabase = createClient();

  // If accepting, automatically set invited_id
  if (updates.status === "accepted") {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");
    updates.invited_id = user.id;
  }
  
  console.log("shareId: ", shareId)
  console.log("updating list share, updates:", updates)
  const { error } = await supabase
    .from("list_shares")
    .update(updates)
    .eq("id", shareId);

  if (error) throw error;
}


// Delete a share
export async function deleteListShare(shareId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("list_shares")
    .delete()
    .eq("id", shareId);

  if (error) throw error;
}

// Fetch incoming shares for current user
export async function fetchMyIncomingShares(): Promise<ShareRequest[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("list_shares")
    .select(`
      id,
      list_id,
      list:lists(name),
      email,
      invited_id,
      role,
      status
    `)
    .eq("email", user.email)
    .eq("status", "pending");
  console.log("incoming shares", data)
  if (error) throw error;

  return (
    data?.map((d: any) => ({
      id: d.id,
      list_id: d.list_id,
      list_name: d.list?.name ?? "",
      inviter_email: d.email,
      invited_id: d.invited_id,
      role: d.role,
      status: d.status,
    })) ?? []
  );
}
