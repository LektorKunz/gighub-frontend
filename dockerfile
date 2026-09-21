FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN ls -la /app/dist && ls -la /app/dist/* 2>/dev/null || true

FROM nginx:alpine AS final
COPY --from=build /app/dist/gighub-frontend/browser /usr/share/nginx/html
EXPOSE 80
