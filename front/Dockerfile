FROM node:18-alpine

WORKDIR /usr/src/app/client

COPY ./src .

RUN yarn global add pnpm && pnpm i

RUN pnpm run build

CMD ["pnpm", "start"]