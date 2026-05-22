# Anki Xuyanki — Telegram Mini App для изучения английских слов

Современное minimalist-приложение в стиле Duolingo × Notion × Telegram.
Mobile-first, dark theme, glassmorphism, плавные анимации, интервальное повторение,
мини-игры и голосовое добавление слов через Gemini AI.

## Стек

- React 19 + TypeScript + Vite 6
- TailwindCSS v4 + Motion (Framer Motion) + Lucide Icons
- Telegram WebApp SDK
- Vercel Serverless Functions (`/api/*`) + Gemini AI

## Локальный запуск

```bash
npm install
cp .env.example .env.local   # вписать GEMINI_API_KEY (опционально)
npm run dev                  # express + vite dev на http://localhost:3000
```

Без `GEMINI_API_KEY` приложение работает на встроенной колоде слов.

## Деплой на Vercel (MVP)

1. Запушьте репозиторий на GitHub.
2. На [vercel.com](https://vercel.com) → **New Project** → импортируйте репозиторий.
3. Framework Preset: **Vite** (подхватится из `vercel.json`).
4. Environment Variables (опционально, для голосового AI):
   - `GEMINI_API_KEY` = ключ из Google AI Studio
5. Deploy. Получите URL вида `https://anki-xuyanki.vercel.app`.

## Подключение к Telegram

1. [@BotFather](https://t.me/BotFather) → `/newbot`.
2. `/newapp` → выберите бота → URL = ваш Vercel URL.
3. Готово — Mini App открывается прямо в Telegram.

## Структура

- `src/` — фронт (React, экраны, компоненты)
- `api/` — Vercel serverless endpoints (`/api/words/default`, `/api/ai/process-word`, `/api/health`)
- `server.ts` — локальный dev-сервер (используется только в `npm run dev`)
- `vercel.json` — конфиг для Vercel
