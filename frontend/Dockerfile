FROM node:22.2.0-alpine as build
WORKDIR /app/frontend
COPY package*.json ./
RUN npm ci
RUN npm install -g @angular/cli
COPY . .
RUN npm run build --prod
FROM nginx:1.15.8-alpine
COPY --from=build app/frontend/dist/card-game/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf