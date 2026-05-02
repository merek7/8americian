# 🚀 Déployer le site avec Coolify

> Coolify = self-hosted Heroku/Vercel. Tu pointes un Dockerfile, il build et serve.

## Pré-requis

- Coolify déjà installé sur ton VPS (si non : `curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash`)
- Accès au dashboard Coolify (port 8000 par défaut)
- Un domaine ou sous-domaine pointant vers l'IP du VPS (ex. `8american.tondomaine.com`)

---

## Méthode A — Git (recommandé, mises à jour faciles)

### 1. Push le dossier `website/` sur un repo Git

```bash
cd /c/Users/kmere/Downloads/Godot/website
git init
git add .
git commit -m "v1.01.beta site"
git remote add origin git@github.com:tonuser/8american-site.git
git push -u origin main
```

> ⚠️ Le repo va contenir l'exe (103 Mo). Si GitHub bloque, utilise **GitLab** (limite 5 Go) ou **Gitea self-hosted**, ou retire l'exe du repo et upload-le séparément (voir Méthode B).

### 2. Créer une nouvelle ressource dans Coolify

1. Dashboard Coolify → **Projects** → **+ New Project** (ou ouvre un projet existant)
2. **+ New Resource** → **Public Repository** (ou Private + ajoute ta clé deploy)
3. Colle l'URL Git, branche = `main`
4. Build Pack = **Dockerfile**
5. Path = `/Dockerfile` (à la racine du repo)
6. Port exposé = **80**

### 3. Configurer le domaine

Dans Coolify → ta ressource → **Domains** :

```
https://8american.tondomaine.com
```

Coolify gère **Let's Encrypt automatiquement** dès que le domaine pointe vers le VPS.

### 4. Déployer

Clique **Deploy**. En 1-2 min ton site est live à `https://8american.tondomaine.com`.

### 5. Mises à jour

```bash
# sur ton PC après modifs
git add .
git commit -m "tweak"
git push
```

Dans Coolify → ta ressource → **Redeploy** (ou auto-deploy via webhook si tu l'actives).

---

## Méthode B — Upload manuel sans Git

Si tu préfères pas de Git, ou si l'exe pose souci pour GitHub :

### 1. Bundle le site

```bash
cd /c/Users/kmere/Downloads/Godot
tar -czf website-coolify.tar.gz -C website .
```

### 2. Upload sur le VPS

```bash
scp website-coolify.tar.gz root@TON_IP_VPS:/tmp/
ssh root@TON_IP_VPS
mkdir -p /opt/8american-site
tar -xzf /tmp/website-coolify.tar.gz -C /opt/8american-site
```

### 3. Dans Coolify → **+ New Resource** → **Docker Compose** (ou **Dockerfile**)

- Source : **Dockerfile in folder**
- Path : `/opt/8american-site`
- Port : **80**
- Domain : `https://8american.tondomaine.com`

Coolify build l'image localement et la lance.

### 4. Mises à jour

```bash
# sur PC : refait l'archive
tar -czf website-coolify.tar.gz -C website .
scp website-coolify.tar.gz root@VPS:/tmp/

# sur VPS
ssh root@VPS
tar -xzf /tmp/website-coolify.tar.gz -C /opt/8american-site --overwrite
```

Dans Coolify → **Redeploy** la ressource.

---

## Méthode C — Static Site (sans Docker)

Coolify supporte aussi les sites statiques sans Dockerfile :

1. **+ New Resource** → **Static Site**
2. Repo Git OU upload zip
3. Build command = (vide, fichiers déjà prêts)
4. Output directory = `/`
5. Domain + Deploy

C'est la méthode la plus simple si tu veux pas Docker.

---

## Coolify firewall / DNS

- DNS : ton enregistrement A doit pointer vers l'IP publique de ton VPS
- Firewall Hetzner : ouvre **TCP 80 + 443** dans le panel Hetzner Cloud Console
- UFW (sur le VPS) :
  ```bash
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw reload
  ```

---

## Vérifier que ça marche

```bash
curl -I https://8american.tondomaine.com
# Doit répondre 200 OK
```

Ouvre l'URL dans le navigateur. Si tu vois la landing page, c'est déployé.

---

## ⚡ TL;DR (méthode la plus rapide)

1. Push `website/` sur GitHub/GitLab
2. Coolify → New → Public Repo → Dockerfile → Port 80
3. Domaine + Deploy → 90 secondes

Coolify gère SSL, reverse proxy, restart automatique, logs, et redéploiements.
