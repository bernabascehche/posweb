# POS Frontend Application

A modern Point of Sale (POS) frontend application built with Next.js, React, and TypeScript.

## 🚀 Tech Stack

- **Framework**: Next.js 16.0.3
- **UI Library**: React 19.2.0
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1.9
- **UI Components**: Radix UI
- **Form Handling**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React

## 📁 Project Structure

```
posapi/
├── app/              # Next.js app directory (pages & layouts)
├── components/       # Reusable React components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and helpers
├── public/          # Static assets
├── styles/          # Global styles
└── package.json     # Project dependencies
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm (recommended) or npm

### Installation

1. Install dependencies:
```bash
pnpm install
# or
npm install
```

2. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📜 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🎨 Features

- Modern, responsive UI with Radix UI components
- Dark mode support with next-themes
- Form validation with Zod
- Data visualization with Recharts
- Optimized performance with Next.js 16

## 📝 Notes

This is a frontend-only application. If you need backend functionality, you'll need to integrate with a separate API service.

---

Built with ❤️ using Next.js
