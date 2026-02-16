<p align="center">
  <img src="./SpeechHelp-Logo.png" alt="SpeechHelp AI Logo" width="200">
</p>

<h1 align="center">SpeechHelp AI</h1>

<p align="center">
  <strong>The Ultimate AI-Powered Speech Writing Assistant</strong>
</p>

<p align="center">
  SpeechHelp AI transforms the daunting task of speech writing into a seamless, creative journey. By leveraging advanced GPT-4 models, it crafts personalized, high-impact speeches tailored to your unique audience, tone, and event.
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
  <a href="#why-speechhelp">Why SpeechHelp?</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#pricing">Pricing</a>
</p>

---

## 🌟 Why SpeechHelp AI?

- **Precision Craftsmanship**: Beyond simple templates, our AI understands context, emotion, and rhetorical devices to create speeches that resonate.
- **Empowerment**: Designed for everyone—from best men and bridesmaids to CEOs and public speakers—giving you the confidence to own the stage.
- **Speed & Quality**: Generate a professional, structured 10-minute speech in less than 3 minutes, saving you hours of writer's block.
- **Privacy First**: Your personal data, speech drafts, and sensitive information are secured with enterprise-grade encryption and Supabase Auth.

---

## ✨ Features

- **AI Speech Generation** - Create professional speeches in minutes using GPT-4 and custom prompt engineering.
- **Multi-step Wizard** - Intuitive guided interface for event type, audience analysis, tone selection, and key talking points.
- **Real-time Editing** - Seamlessly edit and preview speeches before saving to your personal library.
- **Export Options** - Download your creations in multiple formats including PDF, DOCX, PPTX, or HTML.
- **Subscription Management** - Flexible pricing tiers with secure Stripe integration for trial and pro access.
- **Multi-language Support** - Fully localized interface and generation for English, Spanish, and French.
- **Admin Dashboard** - Comprehensive suite for user management, analytics, and system monitoring.
- **Two-Factor Authentication** - Enhanced security protocols for admin access using TOTP.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | High-performance UI framework |
| **TypeScript** | Robust type safety and developer productivity |
| **Vite** | Modern build tool & blazing fast dev server |
| **Tailwind CSS** | Utility-first styling for beautiful, responsive layouts |
| **shadcn/ui** | Accessible, customizable component library |
| **Framer Motion** | Fluid animations and micro-interactions |
| **React Query** | Elegant server state management and caching |

### Backend & Services
| Technology | Purpose |
|------------|---------|
| **Supabase** | Backend-as-a-Service (Auth, DB, Storage) |
| **PostgreSQL** | Reliable, relational data storage |
| **Edge Functions** | Scalable, low-latency serverless API (Deno) |
| **OpenAI API** | Cutting-edge AI for natural language generation |
| **Stripe** | Global payment processing & subscriptions |
| **Resend** | High-deliverability transactional email |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd speech-helper-ai

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

### Prerequisites

- **Node.js 18+**
- **npm / pnpm / bun**
- **Supabase CLI** (for local backend development)

---

## 📂 Project Structure

```
speech-helper-ai/
├── src/
│   ├── components/          # Reusable UI, admin, and speech-specific components
│   ├── pages/               # Application routes and screen layouts
│   ├── contexts/            # Global state (Auth, Language, Admin)
│   ├── hooks/               # Custom React hooks for business logic
│   ├── services/            # API interaction layers
│   ├── lib/                 # Core utilities and business rules
│   ├── translations/        # i18n localization files
│   └── integrations/        # Initialized external clients
├── supabase/
│   ├── functions/           # 30+ specialized Edge Functions
│   └── migrations/          # Version-controlled database schema
└── docs/                    # Technical documentation and guides
```

---

## 🗺️ Roadmap

- [ ] **Voice Synthesis**: Preview your speech with high-fidelity AI-generated voice narrations.
- [ ] **Sentiment Analysis**: Real-time feedback on how your speech might be perceived by the audience.
- [ ] **Mobile Application**: Capture inspiration and edit your speeches on the go with a native mobile experience.
- [ ] **Collaboration Suite**: Invite friends or colleagues to review and polish your drafts in real-time.

---

## 💎 Subscription Plans

| Feature | Free Trial | Premium | Pro |
|---------|-----------|---------|-----|
| **Speeches/Month** | 1 total | 3 | Unlimited |
| **Storage** | 100 MB | 1 GB | Unlimited |
| **Team Members** | 1 | 5 | Unlimited |
| **AI Analysis** | ✅ | ✅ | ✅ |
| **Export Formats** | PDF | PDF, DOCX, PPTX | All + HTML |
| **Support** | Basic | Priority Email | Fast-track |
| **Price (Monthly)** | **$0** | **$9.99** | **$29.99** |

---

## 🛡️ Project Principles

1. **User Empowerment**: Every feature is designed to give users a voice and the confidence to speak.
2. **Quality Above All**: We prioritize the quality of AI output over generic generation.
3. **Privacy & Trust**: Your words are your own. We ensure they stay that way through rigorous security.

---

<p align="center">
  Built with ❤️ by the SpeechHelp Team using <a href="https://react.dev">React</a>, <a href="https://supabase.com">Supabase</a>, and <a href="https://openai.com">OpenAI</a>
</p>

