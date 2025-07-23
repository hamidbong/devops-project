#!/bin/sh

# Crée config.js au démarrage du conteneur
cat <<EOF > /usr/share/nginx/html/config.js
window._env_ = {
  API_URL: "${API_URL:-http://localhost:5000}"
};
EOF

# Lancer NGINX
exec "$@"
