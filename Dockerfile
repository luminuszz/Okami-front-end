FROM node:alpine



COPY . .

RUN corepack enable

RUN corepack prepare pnpm@latest --activate

RUN pnpm install

CMD ["pnpm", "dev"]



