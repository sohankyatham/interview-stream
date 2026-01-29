# InterviewStream v1
InterviewStream is a full-stack mock interview platform that evaluates behavioral interview responses using AI.

AI Interviewer where users can:
- Start a mock interview
- Answer questions (text first, later video)
- Get feedback and improve their interview skills

## Features
- Multi-step interview flow
- Answer review & summary
- AI evaluation using Gemini 2.5 Flash
- Per-question scoring, strengths, and improvement feedback
- Robust JSON handling and error recovery

## Tech Stack
- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- AI: Google Gemini 2.5 Flash

## Why I Built This
I wanted to understand how AI-driven interview platforms work end-to-end, including frontend UX, API design, prompt engineering, and handling unreliable LLM outputs.

## What I Learned
- Designing clean component boundaries
- Enforcing structured AI outputs
- Handling real-world LLM failure modes
- Building production-style APIs in Next.js


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
