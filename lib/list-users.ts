import { createClient } from "@/lib/supabase/client";

export type ListRole = "owner" | "editor" | "viewer";

export type AcceptedUser = {
  user_id: string;
  email: string;
  role: "owner" | "editor" | "viewer";
};

export async function fetchMyRoleForList(
  listId: string
): Promise<ListRole | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("list_users")
    .select("role")
    .eq("list_id", listId)
    .eq("user_id", user.id)
    .single();

  console.log('user role: ', data?.role)
  if (error) return null;
  return data.role;
}

export async function updateListUserRole({
  listId,
  userId,
  role,
}: {
  listId: string;
  userId: string;
  role: "viewer" | "editor" | "owner";
}): Promise<void> {
  const supabase = createClient();
  console.log("updating list_users", listId, userId, role)
  const { error } = await supabase
    .from("list_users")
    .update({ role })
    .eq("list_id", listId)
    .eq("user_id", userId);

  if (error) throw error;
}

export async function fetchListUsers(listId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("list_users")
    .select("*")
    .eq("list_id", listId);

  if (error) throw error;
  return data ?? []; // <-- important!
}

export async function fetchAcceptedUsers(listId: string): Promise<AcceptedUser[]> {
  const supabase = createClient();

  // 1. Get all accepted users from list_users
  const { data: usersData, error: usersError } = await supabase
    .from("list_users")
    .select("user_id, role")
    .eq("list_id", listId);

  if (usersError) throw usersError;
  if (!usersData || usersData.length === 0) return [];

  // 2. Get corresponding emails from list_shares
  const invitedIds = usersData.map((u: any) => u.user_id);

  const { data: sharesData, error: sharesError } = await supabase
    .from("list_shares")
    .select("invited_id, email")
    .eq("list_id", listId)
    .in("invited_id", invitedIds);

  if (sharesError) throw sharesError;

  // 3. Only keep users that exist in list_shares (exclude owner)
  const acceptedUsers = usersData
    .map((u: any) => {
      const share = sharesData?.find((s: any) => s.invited_id === u.user_id);
      if (!share) return null; // skip if no matching share
      return {
        user_id: u.user_id,
        role: u.role,
        email: share.email,
      };
    })
    .filter(Boolean) as AcceptedUser[];

  return acceptedUsers;
}