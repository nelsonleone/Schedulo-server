import dotenv from "dotenv"

import { createClient } from "@supabase/supabase-js";

dotenv.config()



export async function createServerDbClient(accessToken?: string) {
    return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
      db: {
        schema: 'public',
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: accessToken ? {
          Authorization: `Bearer ${accessToken}`,
        } : {},
      },
    })
}