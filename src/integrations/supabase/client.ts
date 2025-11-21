import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "❌ Configuração do Supabase ausente. Verifique o arquivo .env e defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY."
  );
} else {
  console.log("✅ Supabase configurado com URL:", supabaseUrl);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
