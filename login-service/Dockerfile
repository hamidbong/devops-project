FROM node:18-alpine

# Dossier de travail dans le container
WORKDIR /app

# Copie des dépendances
COPY package*.json ./

# Installation des dépendances en production
RUN npm ci --only=production

# Copie du reste des fichiers
COPY . .

# Exposition du port (par exemple 3000 si ton app écoute sur 3000)
EXPOSE 3000

# Commande de démarrage
CMD ["node", "app.js"]
