# Conju — Deployment

Static site (HTML + CSS + JS), no build step required.

## First-time VPS setup

```bash
# 1. Install nginx
sudo apt update && sudo apt install nginx -y

# 2. Create the site directory
sudo mkdir -p /var/www/conju
sudo chown $USER:$USER /var/www/conju

# 3. Copy files
scp -r /Users/ethan/Personal/Conju/* user@your-vps:/var/www/conju/

# 4. Create nginx config
sudo nano /etc/nginx/sites-available/conju
```

Paste this in the config file:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name conju.eowinstudio.com;
    root /var/www/conju;
    index index.html;
}
```

```bash
# 5. Enable the site
sudo ln -s /etc/nginx/sites-available/conju /etc/nginx/sites-enabled/
sudo nginx -t && sudo nginx -s reload

# 6. Enable HTTPS
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d conju.eowinstudio.com
```

> **Before step 6**, make sure the DNS A record is set on Infomaniak:
> Manager → Domains → eowinstudio.com → DNS zone → Add record
> Type: `A` | Name: `conju` | Value: `<your VPS IP>`
> Wait a few minutes for propagation before running certbot.

## GitHub Actions (auto-deploy on push)

Every push to `main` will rsync the files to the VPS and reload nginx automatically.

### Required GitHub secrets

Go to **Settings → Secrets and variables → Actions** in your repo and add:

| Secret | Value |
|---|---|
| `VPS_HOST` | Your VPS IP or domain (e.g. `123.45.67.89`) |
| `VPS_USER` | SSH user (e.g. `ubuntu` or `root`) |
| `VPS_SSH_KEY` | Your private SSH key (the full content of `~/.ssh/id_ed25519`) |
| `VPS_PATH` | Destination path on the VPS (e.g. `/var/www/conju/`) |

### Generate an SSH key for the workflow (if needed)

```bash
# On your machine
ssh-keygen -t ed25519 -C "github-actions-conju" -f ~/.ssh/conju_deploy

# Add the public key to the VPS
ssh-copy-id -i ~/.ssh/conju_deploy.pub user@your-vps

# Copy the private key content into the VPS_SSH_KEY secret
cat ~/.ssh/conju_deploy
```

### Allow nginx reload without password (on the VPS)

```bash
echo "$USER ALL=(ALL) NOPASSWD: /usr/sbin/nginx -s reload" | sudo tee /etc/sudoers.d/nginx-reload
```
