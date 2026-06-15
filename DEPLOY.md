# Deploy to Vercel + Connect Custom Domain

## Step 1: Push to GitHub

1. Create a new repo on GitHub (e.g. `coming-soon`)
2. In the project folder, run:

```bash
cd /path/to/this-project
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/coming-soon.git
git push -u origin main
```

## Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repo
4. Vercel will auto-detect the Vite setup — just click **"Deploy"**
5. Your site will be live at `https://your-project.vercel.app`

## Step 3: Connect Your Purchased Domain

### In Vercel:
1. Go to your project → **Settings** → **Domains**
2. Enter your domain (e.g. `yourdomain.com`) and click **Add**
3. Vercel will show you DNS records to add

### In GoDaddy:
1. Log in → **My Products** → **Domains** → click your domain
2. Go to **DNS** (or **Manage DNS**)
3. Delete any existing A, CNAME, or ALIAS records for `@` and `www`
4. Add these records:

For **apex domain** (`yourdomain.com`):
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 600 seconds
```

For **www** (`www.yourdomain.com`):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: 600 seconds
```

5. Save changes

### Back in Vercel:
- Wait a few minutes, then click **Refresh**
- Vercel will validate the DNS and issue an SSL certificate automatically
- Your custom domain is now live!

## Notes

- SSL/HTTPS is automatically handled by Vercel (free)
- Every push to your GitHub repo will auto-deploy
- The `vercel.json` file handles SPA routing so all paths work correctly
