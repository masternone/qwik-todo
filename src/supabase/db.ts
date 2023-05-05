import type { DataBase } from "~/supabase/schema";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<DataBase>(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY
);