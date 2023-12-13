FROM node:16-alpine3.15 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY ./ ./
RUN npm run build

FROM nginx:alpine AS frontend
WORKDIR /app
COPY --from=builder ./app/build /usr/share/nginx/html
COPY ./nginx/default.conf etc/nginx/conf.d


CMD [ "nginx", "-g", "deamon off;" ]
