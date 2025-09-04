# Static Site (GitHub Pages Ready)

## How to host on GitHub Pages
1. Create a new **public** repository on GitHub (e.g., `steel-site`).
2. Upload the contents of this folder to the repo root (`index.html` must be at the root).
3. Go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`. Save.
6. Your site will be available at `https://<your-username>.github.io/<repo-name>/`.

### Custom domain (optional)
- Add your domain in **Settings → Pages**.
- Create DNS CNAME record pointing `www` (or root) to `<your-username>.github.io`.

## Editing
- Update images inside `assets/`.
- Edit copy in the HTML files.
- Colors & layout live in `assets/style.css`.
