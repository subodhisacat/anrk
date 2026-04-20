# ANRK Dental Care Clinic

A production-minded, beginner-friendly full-stack clinic appointment booking system built with Next.js App Router, Supabase, eSewa, and email notifications.

## Features

- Public homepage with clinic information
- Doctor listing page
- Dynamic appointment booking with slot availability
- eSewa test payment redirect and verification
- Appointment insert only after verified payment success
- Email notifications for booking, confirmation, cancellation, and rescheduling
- Protected admin dashboard using Supabase Auth
- Doctor management and appointment filtering
- Custom/manual email sending per appointment
- Responsive Tailwind CSS interface

## Folder Structure

```text
.
|-- app
|   |-- admin
|   |   |-- doctors/page.tsx
|   |   |-- layout.tsx
|   |   |-- login/page.tsx
|   |   `-- page.tsx
|   |-- api/appointments/availability/route.ts
|   |-- auth/callback/route.ts
|   |-- book/page.tsx
|   |-- doctors/page.tsx
|   |-- payment
|   |   |-- esewa/page.tsx
|   |   |-- failure/page.tsx
|   |   `-- success/page.tsx
|   |-- globals.css
|   |-- layout.tsx
|   `-- page.tsx
|-- components
|   |-- admin/sign-out-button.tsx
|   |-- booking-form.tsx
|   |-- doctor-card.tsx
|   |-- footer.tsx
|   |-- hero.tsx
|   |-- navbar.tsx
|   |-- payment-redirect-form.tsx
|   `-- section-heading.tsx
|-- lib
|   |-- actions
|   |   |-- admin.ts
|   |   `-- public.ts
|   |-- supabase
|   |   |-- admin.ts
|   |   |-- browser.ts
|   |   `-- server.ts
|   |-- auth.ts
|   |-- booking.ts
|   |-- constants.ts
|   |-- email.ts
|   |-- esewa.ts
|   |-- time-slots.ts
|   |-- types.ts
|   |-- utils.ts
|   `-- validations.ts
|-- supabase/clinic_setup.sql
|-- .env.example
|-- middleware.ts
`-- package.json
```

## Environment Setup

1. Copy `.env.example` to `.env.local`.
2. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - email provider values
3. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never use it in client components.

## Supabase Setup

1. Open your Supabase project.
2. Go to SQL Editor.
3. Paste the full file from [supabase/clinic_setup.sql](/C:/Users/Subodh/Desktop/New%20folder/ANRK/supabase/clinic_setup.sql) and run it.
4. In Authentication > Users, create an admin user manually.
5. In Authentication > URL Configuration, set:
   - Site URL: your deployed app URL
   - Redirect URL: `https://your-domain.com/auth/callback`

### Supabase Tables Created

- `doctors`
- `appointments`
- `payment_sessions`

`payment_sessions` is the helper table that keeps unpaid booking drafts. This lets the system avoid storing real appointments until the eSewa payment is verified.

## eSewa Integration

The project uses the eSewa ePay test environment.

- Test form POST URL: `https://rc-epay.esewa.com.np/api/epay/main/v2/form`
- Test status verification URL: `https://rc.esewa.com.np/api/epay/transaction/status/`
- Test product code: `EPAYTEST`
- Test secret key from official docs: `8gBm/:&EnhH.1/q(`
- Test OTP: `123456`

### Booking Flow

1. Patient submits the booking form.
2. Server creates a `payment_sessions` row with patient details and a unique `transaction_uuid`.
3. App redirects to `/payment/esewa`.
4. The page auto-posts signed fields to eSewa.
5. eSewa sends the user back to `/payment/success?data=...` or `/payment/failure`.
6. On success, the server:
   - decodes the Base64 payload
   - verifies the response signature
   - verifies status through eSewa transaction status API
   - creates the appointment only if payment is complete
7. On failure, no appointment is stored.

### Important Official eSewa References

- [eSewa ePay overview](https://developer.esewa.com.np/pages/Epay)
- [eSewa ePay V2 docs](https://developer.esewa.com.np/pages/Epay-V2)

## Email Setup

The app supports two email options:

### Option 1: Resend

1. Create a [Resend](https://resend.com/) account.
2. Add `RESEND_API_KEY` in `.env.local`.
3. Set `EMAIL_FROM`, for example:

```env
EMAIL_FROM=ANRK Dental Care Clinic <appointments@yourdomain.com>
```

### Option 2: SMTP / Nodemailer

Add these values in `.env.local`:

```env
SMTP_HOST=smtp.yourprovider.com
SMTP_PORT=587
SMTP_USER=your-user
SMTP_PASS=your-password
SMTP_SECURE=false
EMAIL_FROM=ANRK Dental Care Clinic <appointments@yourdomain.com>
```

The system automatically sends email when:

- appointment is booked after verified payment
- admin confirms the appointment
- admin cancels the appointment
- admin reschedules the appointment
- admin sends a custom email

## Local Development

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Deployment Guide

### Vercel

1. Push the project to GitHub.
2. Import it into [Vercel](https://vercel.com/).
3. Add all `.env.local` values into the Vercel project environment settings.
4. Deploy.
5. Update `NEXT_PUBLIC_SITE_URL` to the production domain.
6. Add the deployed URL in Supabase Auth redirect settings.

### Other Node Hosts

1. Install dependencies.
2. Set the environment variables.
3. Run `npm run build`.
4. Run `npm start`.

## Beginner Notes

- `app/` contains pages and route handlers.
- `components/` contains reusable UI components.
- `lib/` contains business logic for Supabase, eSewa, email, and validations.
- `supabase/clinic_setup.sql` contains the full paste-ready SQL.
- Use the Supabase anon key in the browser only.
- Use the service role key only in server files.

## Production Hardening Ideas

- Add rate limiting to the booking form.
- Add audit logs for admin actions.
- Add timezone-aware slot management if the clinic expands.
- Add a separate `profiles` or `roles` table for stricter admin role control.
- Add webhook-based payment verification if eSewa provides one for your merchant setup.
