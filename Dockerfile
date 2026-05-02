# Dockerfile pour le site officiel 8 American
# Image légère nginx servant les fichiers statiques

FROM nginx:1.27-alpine

# Copie la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Supprime le contenu par défaut et copie le site
RUN rm -rf /usr/share/nginx/html/*
COPY index.html /usr/share/nginx/html/
COPY DEPLOY_VPS.html /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY script.js /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY downloads /usr/share/nginx/html/downloads

# Permissions correctes
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 9024

# Healthcheck pour Coolify
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD wget -q --spider http://localhost:9024/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
