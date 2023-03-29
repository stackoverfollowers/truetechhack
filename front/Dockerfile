FROM node:18-alpine

WORKDIR /usr/src/app/client

COPY ./src .

ARG SERVER_HOST

RUN echo NEXT_PUBLIC_SERVER_URL=${SERVER_HOST} > .env.local

RUN yarn global add pnpm && pnpm i

RUN pnpm run build

CMD ["pnpm", "start"]