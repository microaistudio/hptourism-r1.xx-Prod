# Setup New HTTPS Domain (The "No-HSTS-Trap" Method)

This guide documents the **fastest, safest path** to setting up a new domain (e.g., `dev.osipl.dev`) on this server. Follow these steps strictly to avoid "Connection Not Private" errors and HSTS blocking loops.

## Phase 1: Pre-Check (CRITICAL)

**Before touching any code**, verify the "Public Path":
1.  **DNS Record**: Does the domain point to this server's Public IP?
    ```bash
    ping dev.osipl.dev
    # Should reply from the server's public IP
    ```
2.  **Firewall**: Are ports 80 (HTTP) and 443 (HTTPS) open?
    *   *If Yes*: You **MUST** use [Let's Encrypt](#phase-4-ssl-the-golden-path).
    *   *If No (Localhost only)*: Only then use self-signed certs (and DISABLE HSTS in code).

---

## Phase 2: Application Setup (PM2)

Do not run "naked" Node processes. Use PM2 with a clear name.

1.  **Build**:
    ```bash
    npm run build
    ```
2.  **Start (Production Mode)**:
    *   **IMPORTANT**: Set `NODE_ENV=production`. This prevents Vite/Dev middlewares from crashing the app.
    *   **Name**: matches folder name for clarity.
    ```bash
    NODE_ENV=production pm2 start dist/index.js --name "hptourism-rc6" --update-env
    # Check it:
    pm2 save
    pm2 status
    ```
3.  **Verify Local Port**:
    ```bash
    curl -v http://127.0.0.1:5050
    # Should return 200 OK (HTML content)
    ```

---

## Phase 3: Nginx (HTTP First)

Don't configure SSL manually. Let the tool do it. Start with a basic HTTP setup.

1.  **Create Config**: `/etc/nginx/sites-available/dev.osipl.dev.conf`
    ```nginx
    server {
        listen 80;
        server_name dev.osipl.dev;

        location / {
            proxy_pass http://127.0.0.1:5050; # Match your App Port
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```
2.  **Symlink & Test**:
    ```bash
    ln -s /etc/nginx/sites-available/dev.osipl.dev.conf /etc/nginx/sites-enabled/
    nginx -t
    systemctl reload nginx
    ```
3.  **Verify HTTP**:
    *   Open `http://dev.osipl.dev` in browser. It should load (Not Secure).

---

## Phase 4: SSL (The "Golden Path")

**DO NOT manualy copy CRT/KEY files.**
**DO NOT manually edit Nginx for 443.**

Use **Certbot** to automate verification and config. behaviors.

1.  **Run Certbot**:
    ```bash
    sudo certbot --nginx -d dev.osipl.dev
    ```
2.  **Follow Prompts**:
    *   Select the domain.
    *   Certbot will **automatically**:
        *   Obtain a valid Trusted Certificate.
        *   Update your Nginx config to `listen 443 ssl`.
        *   Configure certificate paths correctly.
        *   Setup auto-renewal.

---

## Phase 5: Verification

1.  **Browser Check**:
    *   Go to `https://dev.osipl.dev`.
    *   **Result**: Valid Lock Icon. No warnings.
2.  **HSTS Check**:
    *   Since the cert is valid, HSTS headers (even if sent) are fine and won't block you.

---

## Summary of Pitfalls to Avoid
1.  **The "Self-Signed HSTS" Trap**: Installing a self-signed cert on a public domain + enabling HSTS => Permanent browser block. **Solution**: Use Let's Encrypt.
2.  **The "Wrong Port" Trap**: Nginx listening on port 80 for SSL traffic. **Solution**: Let Certbot configure Nginx.
3.  **The "Zombie Process" Trap**: Running `npm start` or unnamed PM2 processes. **Solution**: Use named PM2 processes and `pm2 delete` duplicates.
