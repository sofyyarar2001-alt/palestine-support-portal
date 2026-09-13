# متعثرين فلسطين — Arabic RTL complaints platform

A full Arabic (right-to-left) website where people can file a complaint, follow its progress with a reference number, and where two authorized administrators can review and manage everything.

## Public pages

- **الرئيسية (/)** — hero with the official title, two main buttons (تقديم شكوى، متابعة شكوى), "كيف يعمل الموقع؟" in 4 steps, info section, privacy notice, footer.
- **تقديم شكوى (/complaint)** — 5 steps: personal info → complaint details → attachments → hand-drawn signature → review with a required agreement checkbox. On submit the person sees a success screen with a reference number like `MP-2026-XXXXXXXX`.
- **متابعة شكوى (/track)** — reference number + last 4 digits of the phone, then a status timeline: تم الاستلام → قيد المراجعة → تحتاج معلومات → تمت المعالجة → مغلقة. No personal details or internal notes are shown.
- **من نحن (/about)** — independent platform tied to the page, clearly not a government body.
- **الأسئلة الشائعة (/faq)** — accordion answers about filing and tracking.
- **الشروط والأحكام (/terms)** — 15 detailed points (accuracy, responsibility, review).
- **سياسة الخصوصية (/privacy)** — what is collected, why, how long it is kept, how it is protected.
- **اتصل بنا (/contact)** — WhatsApp +972568000119 and the Facebook page.
- **المطور (/developer)** — minimal premium credit for أف تسعين / F90 Web Development, Instagram @f90.xd.

## Admin area

- **/admin/login** — sign-in for the two authorized emails only; anyone else is refused.
- **/admin** — dashboard: counts for إجمالي الشكاوى، جديدة، قيد المراجعة، تحتاج معلومات، تمت المعالجة، مغلقة, plus latest complaints with search and filters.
- **/admin/complaints** — full table with filters and actions.
- **/admin/complaints/:id** — everything about one complaint: data, attachments, signature, status change, status history, internal notes.

## Design

- Arabic typography (IBM Plex Sans Arabic for text, a display Arabic face for headings), full RTL layout, mobile-first with large tap targets and clear Arabic error messages.
- A temporary logo drawn as a clean vector badge — shield + document, subtle Palestinian colors — kept in one file so it can later be swapped for a transparent PNG.
- Floating WhatsApp and Facebook buttons placed so they never cover form fields (they shift out of the way on the complaint form).

## Technical notes

- Routing uses TanStack Router (this project's router) with file-based routes; React Router is not used.
- Backend is Lovable Cloud (enabled as part of this work). Tables: `complaints`, `attachments`, `signatures`, `admin_profiles`, `admin_notes`, `status_history`. Public writes/reads go only through two database functions: `submit_complaint` (insert + reference generation) and `track_complaint` (reference + last-4-phone → safe status data only). Row-level security denies anonymous reads of complaint rows; admin access is gated by an active row in `admin_profiles`, checked with a security-definer helper.
- Attachments upload to a private storage bucket; admin views them through short-lived signed links.
- Signature is captured on a canvas and stored as an image.
- Email sign-in is enabled for admins; the two allowed emails are seeded into `admin_profiles`.
- Every public page gets its own Arabic title/description metadata.

## Order of work

1. Enable Lovable Cloud, create schema, policies, RPCs, storage bucket, seed admins.
2. Design system (RTL, fonts, colors, logo, shared layout, floating contact buttons).
3. Public pages and the multi-step complaint form + tracking.
4. Admin login, dashboard, complaints table, detail view with notes and history.
