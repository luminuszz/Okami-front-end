FROM node:alpine



COPY . .

RUN corepack enable

RUN corepack prepare pnpm@latest --activate

RUN pnpm install

RUN pnpm build

CMD ["pnpm", "preview"]



