FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:22-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY package.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY src ./src

EXPOSE 3000

CMD ["npm", "start"]
