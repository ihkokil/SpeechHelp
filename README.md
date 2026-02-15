<p align="center">
  <img src="./SpeechHelp-Logo.png" alt="SpeechHelp AI Logo" width="200">
</p>

<h1 align="center">SpeechHelp AI</h1>

<p align="center">
  <strong>AI-powered speech writing assistant</strong>
</p>

<p align="center">
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://vitejs.dev"><img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite"></a>
  <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind"></a>
  <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-2.50-3ECF8E?logo=supabase&logoColor=white" alt="Supabase"></a>
  <a href="https://stripe.com"><img src="https://img.shields.io/badge/Stripe-18-635BFF?logo=stripe&logoColor=white" alt="Stripe"></a>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#subscription-plans">Pricing</a>
</p>

---

## Features

- **AI Speech Generation** - Create professional speeches in minutes using GPT-5
- **Multi-step Wizard** - Guided interface for event type, audience, tone, and key points
- **Real-time Editing** - Edit and preview speeches before saving
- **Export Options** - Download as PDF, DOCX, PPTX, or HTML
- **Subscription Management** - Flexible pricing tiers with Stripe integration
- **Multi-language Support** - English, Spanish, and French translations
- **Admin Dashboard** - User management, analytics, and system monitoring
- **Two-Factor Authentication** - Enhanced security for admin access

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Subscription Plans](#subscription-plans)
- [API Integrations](#api-integrations)
- [Development](#development)
- [Deployment](#deployment)

---

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd speech-helper-ai

# Install dependencies
npm install

# Set up environment variables
cp sample.env .env
# Edit .env with your credentials

# Start development server
npm run dev
```

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ 
- [npm](https://www.npmjs.com/) / [pnpm](https://pnpm.io/) / [bun](https://bun.sh/)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (optional, for local development)

---

## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | Component library |
| **Radix UI** | Headless UI primitives |
| **Framer Motion** | Animations |
| **React Router v6** | Client-side routing |
| **React Query** | Server state management |
| **React Hook Form** | Form handling |
| **Zod** | Schema validation |

### Backend & Services
| Technology | Purpose |
|------------|---------|
| **Supabase** | Backend-as-a-Service (Auth, DB, Storage) |
| **PostgreSQL** | Primary database |
| **Supabase Edge Functions** | Serverless API (Deno) |
| **OpenAI API** | AI speech generation |
| **Stripe** | Payment processing |
| **Resend** | Email delivery |

### Development Tools
| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **PostCSS** | CSS processing |
| **tsx** | TypeScript execution |

---

## Project Structure

```
speech-helper-ai/
├── src/
│   ├── components/          # React components (ui, admin, layouts, speech)
│   ├── pages/               # Route pages
│   │   └── admin/           # Admin pages
│   ├── contexts/            # Auth, AdminAuth, Language contexts
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API service functions
│   ├── lib/                 # Utilities & plan rules
│   ├── types/               # TypeScript definitions
│   ├── translations/        # i18n files (en, es, fr)
│   └── integrations/        # Supabase client
├── supabase/
│   ├── functions/           # 30+ Edge Functions
│   └── migrations/          # Database migrations
├── docs/                    # Documentation
└── public/                  # Static assets
```

---

## Screenshots

<p align="center">
  <img src="./Speech%20Help%20-%20Hero%20Section%20Main%20Image.jpg" alt="SpeechHelp AI Hero" width="80%">
</p>

---

## Core Features

| Feature | Description |
|---------|-------------|
| **AI Speech Generation** | Multi-step wizard using GPT-4 to create personalized speeches |
| **Speech Management** | Save, edit, delete, and export speeches (PDF, DOCX, PPTX, HTML) |
| **Subscription System** | Three-tier pricing with Stripe integration |
| **User Dashboard** | Track usage, manage profile, view subscription status |
| **Admin Panel** | User management, speech oversight, analytics dashboard |
| **Multi-language** | i18n support for English, Spanish, and French |
| **2FA Security** | TOTP-based two-factor authentication for admins |
| **Soft Delete** | Data retention with soft delete for speeches |

---

## Database Schema

### Core Tables

| Table | Key Fields |
|-------|------------|
| **`profiles`** | User profile data with subscription info (plan, status, dates, stripe IDs) |
| **`speeches`** | Speech content with soft delete support (`is_deleted`, `deleted_at`) |
| **`admin_users`** | Admin accounts with 2FA settings (`two_factor_enabled`, `two_factor_secret`) |
| **`admin_audit_logs`** | Audit trail for admin actions |

### Key Relationships

```
auth.users (Supabase Auth)
    ├── 1:1 → profiles
    ├── 1:N → speeches
    └── 1:1 → admin_users (optional)
```

---

## Authentication

| Type | Features |
|------|----------|
| **User Auth** | Email/password via Supabase Auth, JWT tokens with auto-refresh, 7-day free trial on signup |
| **Admin Auth** | Separate auth context with mandatory 2FA (TOTP), role-based access (super_admin, admin), audit logging |

---

## Subscription Plans

| Feature | Free Trial | Premium | Pro |
|---------|-----------|---------|-----|
| **Speeches/Month** | 1 total | 3 | Unlimited |
| **Storage** | 100 MB | 1 GB | Unlimited |
| **Team Members** | 1 | 5 | Unlimited |
| **Duration** | 7 days | Unlimited | Unlimited |
| **AI Analysis** | ✅ | ✅ | ✅ |
| **Team Collaboration** | ❌ | ✅ | ✅ |
| **Custom Branding** | ❌ | ❌ | ✅ |
| **Export Formats** | PDF | PDF, DOCX, PPTX | All + HTML |
| **Support** | Basic | Priority Email | Fast-track |
| **Price (Monthly)** | $0 | $9.99 | $29.99 |
| **Price (Yearly)** | $0 | $99.99 | $299.99 |

---

## API Integrations

### Supabase Edge Functions (30+)

| Function | Purpose |
|----------|---------|
| `openai-gen` | Speech generation via GPT-4 |
| `stripe-checkout` / `stripe-verify` / `stripe-webhook` | Payment processing |
| `admin-auth` / `admin-*` | Admin management with 2FA |
| `send-email` / `send-contact-form` | Email delivery (Resend) |

### External APIs

- **OpenAI** - GPT-4 for AI speech generation
- **Stripe** - Payment processing & subscriptions
- **Resend** - Transactional email delivery

---

## Development

### Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> **Note:** OpenAI and Resend API keys are set via Supabase secrets: `supabase secrets set KEY=value`

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run stripe:setup` | Create Stripe products/prices |

---

## Deployment

```bash
# Build the application
npm run build

# Deploy to hosting (Netlify, Vercel, etc.)
# Upload dist/ folder and configure env variables

# Deploy Supabase Edge Functions
supabase functions deploy

# Run database migrations
supabase db push

# Set up Stripe products
npm run stripe:setup
```

---

## License

This project is proprietary software.

---

<p align="center">
  Built with ❤️ using <a href="https://react.dev">React</a>, <a href="https://supabase.com">Supabase</a>, and <a href="https://openai.com">OpenAI</a>
</p>
