FROM node:22-alpine AS test

ENV COVERAGE_DIR=/out/coverage

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY src ./src
COPY vite.config.js ./

CMD ["npm", "run", "test:coverage"]

FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
