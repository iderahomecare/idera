# IDERA Residential Care Home website

## Files
- `index.html`: public website
- `admin.html`: private admin page (not linked from public navigation)
- `styles.css`: design and responsive layout
- `config.js`: Supabase project URL and publishable/anon key
- `app.js`, `admin.js`: website and admin behaviour
- `supabase-setup.sql`: initial database, access policies and gallery storage setup

## Important setup order
1. Create a Supabase project.
2. In Supabase Authentication, create the one administrator account yourself. Do not enable public sign-ups.
3. Copy the Project URL and publishable/anon key into `config.js`. Never put a service_role/secret key in browser files.
4. Run `supabase-setup.sql` in the Supabase SQL Editor.
5. In Supabase Authentication users, copy your admin user's UUID. Run:
   `insert into public.admin_users (user_id) values ('YOUR-ADMIN-USER-UUID');`
6. Publish these files with GitHub Pages.

## GitHub Pages
Upload the contents of this folder to the root of the `idera` repository. In repository Settings > Pages, choose Deploy from a branch, branch `main`, folder `/ (root)`, then Save.

## Security and launch checklist
- Keep the repository free of passwords and secret/service-role keys.
- The admin page URL is not secret security. Authentication, admin allow-list and database/storage policies enforce access.
- The gallery bucket is public for viewing images; only approved admins can upload, update or delete.
- Before launch, add CAPTCHA/rate limiting and server-side validation to public enquiry submissions.
- Confirm all phone numbers, email, physical address, service descriptions, qualifications wording, policies and legal/regulatory requirements before publishing.
- Do not collect residents' medical records or other sensitive health information through the public form.
- Use consented photographs only, especially for residents.
- The acronym values shown in the starter page are placeholders and must be replaced with IDERA's confirmed values.
