# syntax=docker/dockerfile:1.7

FROM node:20-alpine AS build
WORKDIR /app
COPY skyconnect-app/package.json skyconnect-app/package-lock.json ./
RUN npm ci
COPY skyconnect-app/ ./
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY skyconnect-app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
