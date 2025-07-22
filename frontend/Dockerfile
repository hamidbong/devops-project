# Étape 1 : Build l'app
FROM node:18 as builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Étape 2 : Serveur NGINX
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
