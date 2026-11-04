# HUSH ARCHIVE — A Catalogue of Internet Curiosities

> **Tagline:** A catalogue of internet curiosities.  
> **Personality:** Mysterious, intelligent, curious, editorial and welcoming.  
> **Visual Direction:** Modern digital archive / underground library.

HUSH ARCHIVE is a global digital discovery platform that curates unusual websites, independent digital creations, interactive experiences, browser experiments, and overlooked corners of the internet.

---

## 1. Technology Stack

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4 with custom archival palette tokens
- **Database:** PostgreSQL
- **ORM:** Prisma ORM 6.19
- **Authentication:** Secure cookie session using `jose` (JWT) + `bcryptjs` password hashing
- **Icons:** Lucide React
- **Validation:** Zod
- **Image Handling:** Next.js Image component with responsive optimization

---

## 2. Design System & Brand Identity

### Palette Hex Codes

| Token | Hex Code | Usage |
|---|---|---|
| **Archive Paper** | `#E9D5CA` | Cards, dossier panels, accents |
| **Dusty Violet** | `#827397` | Secondary accents, subtle borders |
| **Archive Indigo**| `#4D4C7D` | Headings, metadata, badges |
| **Deep Archive**  | `#363062` | Primary text, navigation, dark surfaces |
| **Cold Paper**    | `#F5FEFF` | Main page background, light surfaces |
| **Discovery Orange** | `#DC552C` | Highlights, new badges, CTA accents |

### Typography

- **Display Font:** `Bahnschrift SemiBold` (with DIN Alternate, system fallbacks)
- **Body Font:** `Inter` (loaded via `next/font/google`)
- **Metadata Font:** `IBM Plex Mono` (loaded via `next/font/google`)

### Geometric Monogram (H+A)

A custom SVG monogram featuring two strong structural pillars (H) interconnected with an inverted V gable (A), a horizontal archival beam, and a central Discovery Orange diamond.

---

## 3. Project Structure

```
husharchives/
├── prisma/
│   ├── schema.prisma            # Prisma schema (Discovery, Category, AdminUser, NewsletterSubscriber)
│   ├── migrations/              # Tracked PostgreSQL migrations
│   └── seed.ts                  # Database seed script for 6 categories, 13 discoveries, admin user
├── public/                      # Static assets & favicon
├── src/
│   ├── actions/                 # Next.js Server Actions
│   │   ├── authActions.ts       # Admin login and logout actions
│   │   ├── categoryActions.ts   # Category CRUD with safe delete validation
│   │   ├── discoveryActions.ts  # Discovery CRUD, sequential FILE number generator, toggles
│   │   └── newsletterActions.ts # Newsletter subscription handler
│   ├── app/                     # Next.js App Router routes
│   │   ├── layout.tsx           # Global HTML layout with fonts and metadata
│   │   ├── globals.css          # Tailwind CSS v4 tokens and archival utility styles
│   │   ├── not-found.tsx        # Custom archival 404 page
│   │   ├── loading.tsx          # Vault loading skeleton state
│   │   ├── error.tsx            # Global diagnostic error fallback
│   │   ├── page.tsx             # Homepage (Hero, Featured, Categories, Recent, Newsletter)
│   │   ├── explore/
│   │   │   ├── page.tsx         # Directory with search, category filter, sort, pagination
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # Discovery details dossier, curation notes, external link
│   │   ├── categories/
│   │   │   └── page.tsx         # All 6 Subject Cabinets with discovery counts
│   │   ├── about/
│   │   │   └── page.tsx         # Editorial charter, manifesto, and archival philosophy
│   │   └── admin/               # Protected administrative dashboard
│   │       ├── layout.tsx       # Admin header bar, session check, logout
│   │       ├── page.tsx         # Overview metrics, total counts, recent entries
│   │       ├── login/
│   │       │   └── page.tsx     # Admin authentication portal
│   │       ├── discoveries/
│   │       │   ├── page.tsx     # Discoveries table with live toggles and search
│   │       │   ├── new/         # Accession form with auto-generated FILE numbers
│   │       │   └── [id]/edit/   # Edit existing archival record
│   │       ├── categories/
│   │       │   └── page.tsx     # Category taxonomy manager with safe delete
│   │       └── subscribers/
│   │           └── page.tsx     # Newsletter subscriber roster
│   ├── components/
│   │   ├── brand/
│   │   │   └── Logo.tsx         # Geometric H+A monogram & wordmark
│   │   ├── cards/
│   │   │   ├── DiscoveryCard.tsx# Discovery preview card
│   │   │   └── CategoryCard.tsx # Subject cabinet card
│   │   ├── common/
│   │   │   └── NewsletterForm.tsx# Client subscription form
│   │   ├── explore/
│   │   │   └── FilterBar.tsx    # Search, category pills, sort selector
│   │   ├── admin/
│   │   │   ├── DiscoveriesTable.tsx
│   │   │   ├── DiscoveryForm.tsx
│   │   │   └── CategoriesManager.tsx
│   │   └── layout/
│   │       ├── Header.tsx       # Responsive navigation with search
│   │       └── Footer.tsx       # Archival directory footer
│   ├── lib/
│   │   ├── auth.ts              # JWT signing, verification, and cookie session utils
│   │   ├── prisma.ts            # Prisma client singleton
│   │   └── validations.ts       # Zod schemas, slug generator, archive number formatter
│   └── middleware.ts            # Route protection for /admin and /api/admin
├── .env                         # Local environment configuration
├── .env.example                 # Example environment template
└── package.json
```

---

## 4. Setup and Installation

### Prerequisites

- **Node.js**: v20+ (tested on Node.js v26)
- **PostgreSQL**: v14+ (running locally on port 5432 or remote URL)
- **npm** or **pnpm**

### Step 1: Clone and Install Dependencies

```bash
cd husharchives
npm install
```

### Step 2: Configure Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Ensure `DATABASE_URL` matches your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/husharchive?schema=public"
JWT_SECRET="husharchive_super_secret_jwt_key_2026_modern_digital_archive"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Step 3: Run Database Migrations & Seed

Initialize the database schema and seed realistic discoveries, the 6 core categories, default admin user, and sample subscribers:

```bash
# Push database schema & apply migrations
npx prisma db push
npx prisma migrate resolve --applied 20261104000000_init

# Seed initial categories and realistic sample discoveries
npm run seed
```

---

## 5. Running the Application

### Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your web browser.

### Production Build

```bash
npm run build
npm start
```

---

## 6. Administrative Portal & Credentials

The administrative interface is available at `/admin`. Any unauthenticated attempt to access `/admin` or its subroutes is automatically redirected to `/admin/login`.

### Default Admin Credentials (from Seed)

- **Email:** `admin@husharchive.com`
- **Password:** `husharchive2026!`

### Admin Features

1. **Dashboard Overview (`/admin`):**
   - High-level metric counts: Total Discoveries, Published entries, Draft queue, Cabinets, and Newsletter Subscribers.
   - Quick table of recent submissions with one-click edit and live preview.

2. **Discoveries Management (`/admin/discoveries`):**
   - Search by title, archive file number (`FILE 0001`), or slug.
   - Filter by subject cabinet or publication status (`DRAFT` vs `PUBLISHED`).
   - One-click status toggle button.
   - One-click Featured toggle.
   - Delete discovery with safety confirmation dialog.

3. **Discovery Accession & Editing (`/admin/discoveries/new` & `edit`):**
   - Automatically generates the next sequential archive number (e.g., `FILE 0014`).
   - Automatic title-to-slug generation with custom override option.
   - Full description, why interesting, and what to explore editorial sections.
   - Live preview of website screenshot / cover image URL.
   - Tag taxonomy input.

4. **Category Management (`/admin/categories`):**
   - Create and edit subject cabinets.
   - Safe delete protection: Prevents accidental deletion of categories that have discoveries assigned to them.

5. **Subscribers Roster (`/admin/subscribers`):**
   - View all registered newsletter subscribers stored in PostgreSQL.

---

## 7. Curated Categories Seeded

1. **Digital Experiments:** Interactive sandboxes, WebGL shaders, audiovisual generators, and computational curiosities.
2. **Hidden Websites:** Enigmatic digital realms, surreal secret portals, and eccentric micro-sites.
3. **Learn Something:** Illuminating visual essays, interactive explanations, and cosmic zoom scales.
4. **Internet Playground:** Playful micro-games, tactile digital toys, and kinetic simulations.
5. **Indie Creations:** Artisanal solo-developer projects, unconventional homepages, and boutique webcraft.
6. **Digital Archives:** Living repositories of computing history, ephemeral net art, and forgotten digital culture.

---

## 8. License

All curated trademarks, projects, and websites belong to their respective original creators. HUSH ARCHIVE is provided as an open-source curation index.
