# StudioSpace - Peer-to-Peer Creative Workspace

**Live Site URL:** [https://studio-space-client.vercel.app](https://studio-space-client.vercel.app)

## Features

- **Discover & Book Studios** — Browse, filter, and reserve creative workspaces including photo studios, sound stages, podcast rooms, music suites, and art workshops with real-time availability and transparent hourly pricing.
- **Full CRUD Operations** — Studio owners can list, update, and delete their creative spaces with rich details including amenities, capacity, security deposits, and detailed overviews.
- **Secure Authentication** — Firebase-powered login/registration with Google social sign-in, password validation, JWT-secured API routes with HTTPOnly cookies, and persistent sessions across page reloads.
- **Smart Booking System** — Book studio time slots with automatic double-booking prevention, dynamic pricing calculator, status tracking (Pending, Confirmed, Completed, Cancelled), and one-click cancellation.
- **Dark/Light Theme Toggle** — Full system-wide theme customization with persistent user preference stored in localStorage, seamlessly switching between dark and light modes.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), Tailwind CSS v4, DaisyUI v5, TypeScript |
| Authentication | Firebase Auth, JWT (HTTPOnly Cookies) |
| Backend | Express.js, MongoDB, Node.js |
| Notifications | React Hot Toast, SweetAlert2 |
| UI Components | Swiper.js, React Icons |

## Local Setup

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env.local` with your Firebase and API credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000)

## Test Credentials

- **Email:** test@studiospace.com
- **Password:** Test123
