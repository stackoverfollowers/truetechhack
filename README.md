# truetechhack

## Run project

### Dev run

In dev version Docker Compose uses `Dockerfile.dev` for buildings and
maps `./back/src` as volume for autoreloading and postgres container hasn't volume.

```bash
cp .env.example .env
docker-compose -f docker-compose.dev.yaml up --build -d
```


### Production run

```bash
cp .env.example .env
docker-compose up --build -d
```

[![CI](https://github.com/stackoverfollowers/truetechhack/actions/workflows/main.yaml/badge.svg)](https://github.com/stackoverfollowers/truetechhack/actions/workflows/main.yaml)

## Front

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
