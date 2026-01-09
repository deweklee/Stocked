import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function IngredientsData() {
  const supabase = await createClient();
  const { data: ingredients } = await supabase.from("ingredients").select();

  return <pre>{JSON.stringify(ingredients, null, 2)}</pre>;
}

export default function Instruments() {
  return (
    <Suspense fallback={<div>Loading ingredients...</div>}>
      <IngredientsData />
    </Suspense>
  );
}
