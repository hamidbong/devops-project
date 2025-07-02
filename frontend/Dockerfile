# Étape 1 : Builder
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : Serveur NGINX pour servir les fichiers statiques
FROM nginx:alpine

# Copie la configuration NGINX si besoin (facultatif)
# COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
