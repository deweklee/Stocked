import { createClient } from "./supabase/client";

export async function getUserId(
  
): Promise<string> {
  const supabase = createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();
  
  if (!user) throw new Error("Not authenticated");
  
  return user.id
}