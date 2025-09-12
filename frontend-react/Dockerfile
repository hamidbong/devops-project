# Étape 1 : Build du frontend avec Node.js
FROM node:18 AS build

WORKDIR /app

# Copier les fichiers package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier tout le code et build
COPY . .
RUN npm run build

# Étape 2 : NGINX pour servir les fichiers statiques
FROM nginx:1.25

# Supprimer la conf par défaut de NGINX
RUN rm /etc/nginx/conf.d/default.conf

# Copier notre conf personnalisée (que tu as écrite : nginx.conf)
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers du build React vers NGINX
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
