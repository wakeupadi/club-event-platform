# EventHub: The Ultimate Campus Club Platform


EventHub is a modern, high-performance web application built for university campuses. It seamlessly connects students with club events, automates attendance tracking using live QR code scanning, and uses the university's academic calendar to intelligently suggest optimal dates for new events.

Built during the **Buildathon**, this project solves the critical issue of event clashes and manual, tedious attendance tracking.

## 🚀 Key Features

### For Students
- **Event Discovery:** Browse a beautiful timeline of upcoming campus events.
- **Instant RSVP:** Register for events with a single click.
- **Entry Passes:** Automatically generate a unique QR code entry pass for every registered event.
- **Student Portfolio:** Automatically build a resume-ready exportable portfolio of attended events, leadership roles, and club achievements.

### For Clubs
- **Smart Event Creation:** Our algorithm scrapes the university's academic calendar to flag exams and holidays, and suggests the optimal (weekend/free) dates for your next event.
- **Live QR Scanner Kiosk:** Turn any laptop into a kiosk. Scan student entry passes using your webcam to mark physical attendance in real-time.
- **Analytics Dashboard:** Track your club's total events, registration numbers, and view a live-updating list of verified physical attendees.

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Prisma
- **Styling:** Tailwind CSS v4 & custom OKLCH "Midnight Slate" theme
- **QR Tech:** `@yudiel/react-qr-scanner` & `react-qr-code`
- **Scraping:** Cheerio (for Academic Calendar parsing)

## 📦 Running Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables (`.env`):
   ```env
   DATABASE_URL="your_supabase_pooler_url"
   DIRECT_URL="your_supabase_direct_url"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```
4. Push the database schema and generate the client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Deployment (Vercel)

This project is configured for 1-click deployment on Vercel. 
- A `postinstall` script (`prisma generate`) is already included in `package.json`.
- Simply import the repository into Vercel, paste your `.env` variables, and deploy! No manual build steps required.

## 👥 Hackathon Notes
For the purpose of the live demo, we implemented a seamless **"Role Switcher"**. This allows judges to instantly swap between the `Student` perspective and the `Club` perspective with zero friction, demonstrating the full lifecycle of an event without dealing with OAuth popups on stage!
