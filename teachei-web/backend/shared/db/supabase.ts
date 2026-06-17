import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL ?? (() => { throw new Error("SUPABASE_URL não definido"); })();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? (() => { throw new Error("SUPABASE_SERVICE_ROLE_KEY não definido"); })();

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});
