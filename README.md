# Foundation Stack

This project was generated to provide a zero-configuration "hitting the ground running" starter based on the **ShipMait** proven workflows. This means all of our learned architectural choices, safety guards, and APIs have been preemptively seeded.

## Built-In Workflows
1. **Next.js 16 (React 19, Tailwind v4)**: The core modern framework.
2. **Supabase Integration (`lib/supabaseClient.ts`)**: Includes both the public `supabase` client for frontend operations and the admin `supabaseAdmin` client leveraging the secure Service Role Key (vital for server-side operations that must bypass unpredictable RLS failures like in ShipMait).
3. **Resend Lead Pipeline (`app/api/send/route.ts`)**: A pre-wired API handler demonstrating exactly how to securely log a lead into the database using `supabaseAdmin` and trigger an email via Resend in a single bound without complex client-auth loops.
4. **Database Scaffolding (`SUPABASE_SCHEMA.sql`)**: A ready-to-copy-paste SQL block containing the `profiles` table (for roles/admin workflow) and `submissions` structure. 

## Next Steps To Start Developing
1. Copy `.env.local.example` to `.env.local` and add your new app's API keys (Database URL, Service Key, Resend API key).
2. Execute `SUPABASE_SCHEMA.sql` in your Supabase SQL Editor.
3. Start the Next.js dev server:
   ```bash
   npm run dev
   ```

*Happy coding.*
