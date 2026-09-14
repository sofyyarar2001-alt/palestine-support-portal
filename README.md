# Build a complete, professional Arabic RTL multi-page web application for متعثرين فلسطين (الموقع...

Build a complete, professional Arabic RTL multi-page web application for "متعثرين فلسطين" (الموقع الرسمي لصفحة متعثرين فلسطين).

Core Requirements:
1. Multi-page routing (React Router) with strict RTL layout and professional Arabic typography (Amiri or Cairo or IBM Plex Sans Arabic):
   - / : Home page (hero with "الموقع الرسمي لصفحة متعثرين فلسطين", "تقديم شكوى" -> /complaint, "متابعة شكوى" -> /track, "كيف يعمل الموقع؟" 4 steps, info section, privacy notice, clean footer)
   - /complaint : Multi-step complaint form (Step 1: Personal info, Step 2: Complaint details, Step 3: Attachments upload, Step 4: Electronic signature canvas, Step 5: Review & required terms checkbox, submit via secure RPC submit_complaint or mock fallback, submission success screen with reference ID e.g. MP-2026-XXXXXXXX)
   - /track : Tracking page (inputs: order reference + last 4 digits of phone; calls track_complaint RPC; displays safe status timeline: تم الاستلام -> قيد المراجعة -> تحتاج معلومات -> تمت المعالجة -> مغلقة, hiding sensitive personal info and internal notes)
   - /about : "من نحن" (independent platform associated with page, clear non-governmental purpose)
   - /faq : Clean accordion FAQ answering key submission & tracking questions
   - /terms : Detailed Arabic terms and conditions (15 points covering accuracy, liability, review)
   - /privacy : Thorough Arabic privacy policy detailing collected data, purpose, retention, security
   - /contact : Direct WhatsApp (+972568000119 / https://wa.me/972568000119) and Facebook (https://www.facebook.com/share/1bUrp2SxBd/)
   - /developer : Minimalist premium developer credit for F90 ("تم تطوير هذا الموقع بواسطة أف تسعين", F90 Web Development, Instagram @f90.xd -> https://www.instagram.com/f90.xd/)
   - /admin/login : Supabase Auth login for authorized administrators (f90gimme@gmail.com, ararsofy@gmail.com) checking active record in admin_profiles
   - /admin : Admin dashboard with statistics cards (إجمالي الشكاوى, جديدة, قيد المراجعة, تحتاج معلومات, تمت المعالجة, مغلقة), recent complaints list, search & filters
   - /admin/complaints : Full complaints management table with filters and actions
   - /admin/complaints/:id : Complaint detail view with full data, attachments, signature, status update dropdown, status history, and internal notes

2. UI & Design:
   - Dedicated temporary logo for "متعثرين فلسطين" using a clean vector/SVG badge (document / shield / balanced trust theme with subtle Palestinian colors) easily swappable for transparent PNG
   - Floating safe contact buttons for WhatsApp (+972568000119) and Facebook (https://www.facebook.com/share/1bUrp2SxBd/) positioned carefully without obstructing forms
   - Mobile-first, responsive, large touch targets, accessible inputs, clear Arabic validation errors
   - Ready to bind to existing Supabase project schema (tables: complaints, attachments, signatures, admin_profiles, admin_notes, status_history; RPCs: submit_complaint, track_complaint)

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9d37c7fc-c505-4679-aa5e-bbec6dd69b78).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
