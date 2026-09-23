import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | undefined;

function getClient(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("SUPABASE_URL não definido");
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY não definido");
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

/**
 * Cliente Supabase server-side, criado sob demanda no primeiro uso.
 * A validação das variáveis de ambiente acontece na primeira requisição, e não
 * na importação do módulo, para que `next build` ("Collecting page data")
 * não dependa de segredos de runtime.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const c = getClient();
    const value = Reflect.get(c, prop, c);
    return typeof value === "function" ? value.bind(c) : value;
  },
});
