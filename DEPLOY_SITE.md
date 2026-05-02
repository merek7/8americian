# Déployer le site sur le VPS Hetzner (nginx)

## Sur ton PC

```bash
cd /c/Users/kmere/Downloads/Godot
tar -czf website.tar.gz -C website .
scp website.tar.gz root@TON_IP_VPS:/tmp/
```

## Sur le VPS (SSH root@)

### 1. Installer nginx

```bash
sudo apt install -y nginx
sudo systemctl enable --now nginx
```

### 2. Déployer le site

```bash
sudo mkdir -p /var/www/8american
sudo tar -xzf /tmp/website.tar.gz -C /var/www/8american
sudo chown -R www-data:www-data /var/www/8american
```

### 3. Configurer nginx

Crée `/etc/nginx/sites-available/8american` :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name TON_IP_VPS;  # ou ton-domaine.com si tu en as un

    root /var/www/8american;
    index index.html;

    # Permettre les gros téléchargements (l'exe fait 103 Mo)
    client_max_body_size 200M;

    location / {
        try_files $uri $uri/ =404;
    }

    location /downloads/ {
        # Force le téléchargement plutôt que l'affichage
        add_header Content-Disposition "attachment";
        add_header X-Content-Type-Options nosniff;
    }

    # Cache des assets statiques
    location ~* \.(css|js|svg|png|jpg|jpeg|webp|woff2)$ {
        expires 7d;
        add_header Cache-Control "public, immutable";
    }

    # Sécurité basique
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Log
    access_log /var/log/nginx/8american.access.log;
    error_log /var/log/nginx/8american.error.log;
}
```

### 4. Activer

```bash
sudo ln -sf /etc/nginx/sites-available/8american /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Ouvrir HTTP

```bash
sudo ufw allow 80/tcp
sudo ufw reload
```

Côté Hetzner Cloud Console, ouvre aussi **TCP 80** (et 443 si tu prévois HTTPS).

### 6. Tester

Va sur `http://TON_IP_VPS` dans ton navigateur. Le site doit s'afficher.

---

## (Optionnel) HTTPS avec Let's Encrypt

Si tu as un nom de domaine pointant vers ton VPS :

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d ton-domaine.com
```

Ça configure auto + renouvelle tout seul.

---

## Mettre à jour le site

Quand tu modifies le site sur ton PC :

```bash
cd /c/Users/kmere/Downloads/Godot
tar -czf website.tar.gz -C website .
scp website.tar.gz root@TON_IP_VPS:/tmp/

ssh root@TON_IP_VPS
sudo tar -xzf /tmp/website.tar.gz -C /var/www/8american --overwrite
sudo chown -R www-data:www-data /var/www/8american
```

Pas besoin de redémarrer nginx (les fichiers statiques sont rechargés à chaque requête).

---

## Mettre à jour l'exe distribué

```bash
# Sur PC : reconstruire l'exe
"/c/Users/kmere/Downloads/Godot_v4.6.2-stable_win64.exe" --headless --path C:/Users/kmere/Downloads/Godot/game --export-release "Windows Desktop" C:/Users/kmere/Downloads/Godot/website/downloads/8American_v1.01.beta.exe

# Régénérer les checksums
cd /c/Users/kmere/Downloads/Godot/website/downloads
sha256sum 8American_v1.01.beta.exe server-package.tar.gz > SHA256SUMS.txt

# Re-uploader (juste le dossier downloads)
cd /c/Users/kmere/Downloads/Godot/website
scp -r downloads root@TON_IP_VPS:/var/www/8american/
```
