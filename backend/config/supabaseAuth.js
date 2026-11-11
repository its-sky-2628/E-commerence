require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase URL or Anon Key is missing");
}

const authClient = createClient(supabaseUrl, anonKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
    }
});

module.exports = authClient;
