FROM node:alpine as base
WORKDIR /app

FROM base as dependencies
RUN mkdir -p /tmp/dependencies
COPY package.json package-lock.json prisma /tmp/dependencies/
WORKDIR /tmp/dependencies
RUN npm ci && npx prisma generate

FROM base as prod_dependencies
RUN mkdir -p /tmp/prod_dependencies
COPY package.json package-lock.json prisma /tmp/prod_dependencies/
WORKDIR /tmp/prod_dependencies
RUN npm ci --omit=dev && npx prisma generate

FROM base as build
COPY --from=dependencies /tmp/dependencies/node_modules node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM base as release
COPY --from=build /app/package.json .
COPY --from=prod_dependencies /tmp/prod_dependencies/node_modules node_modules
COPY --from=build /app/dist dist
COPY --from=build /app/prisma prisma
EXPOSE 4000/tcp
CMD ["dist/src/main.js"]