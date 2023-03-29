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
