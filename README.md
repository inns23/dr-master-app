# Hosting DR Master on GitHub Pages

This folder is a complete static site — `index.html` + `manifest.json` +
`service-worker.js` + `icons/`. GitHub Pages serves static files for free over
HTTPS, which is exactly what's needed for the iOS "Add to Home Screen" trick
to work properly (standalone mode + service worker both require HTTPS).

## 1. Create the GitHub repo

1. Go to [github.com](https://github.com) and log in (or sign up — it's free).
2. Click the **+** in the top-right → **New repository**.
3. Name it something like `dr-master-app`. Keep it **Public** (Pages on a free
   plan needs the repo to be public). Don't add a README/gitignore — leave it
   empty. Click **Create repository**.

## 2. Upload the files

Easiest way, no command line needed:

1. On the new repo's page, click **uploading an existing file** (or drag files
   onto the page).
2. Drag in `index.html`, `manifest.json`, `service-worker.js`, and the whole
   `icons` folder, keeping the folder structure — `icons/icon-192.png` etc.
   should stay inside an `icons` folder, not loose at the top level.
3. Scroll down, write a commit message like "initial upload", click
   **Commit changes**.

Your repo should now look like:
```
dr-master-app/
├── index.html
├── manifest.json
├── service-worker.js
├── README.md
└── icons/
    ├── icon-32.png
    ├── icon-180.png
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-192.png
    └── icon-maskable-512.png
```

## 3. Turn on GitHub Pages

1. In the repo, go to **Settings** (top tab bar).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Under **Branch**, choose `main` and folder `/ (root)`, click **Save**.
5. Wait ~1 minute, then refresh the Pages settings page. A green box will show
   your live URL, something like:
   `https://your-username.github.io/dr-master-app/`

That link is what you send to friends.

## 4. Adding to the Home Screen on iOS

Send them the link above and have them:

1. Open the link in **Safari** (must be Safari, not Chrome/LINE's in-app
   browser — iOS only allows "Add to Home Screen" standalone mode from Safari).
2. Tap the **Share** button (square with an arrow, bottom toolbar).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add** (top-right).

The app now sits on their home screen with the red "DR" icon. Opening it from
there launches full-screen, with no address bar, and status bar text drawn
over the app's own background — exactly like a native app.

**On Android**, Chrome will usually just show an "Install app" / "Add to Home
screen" banner or menu item automatically once the manifest + service worker
are detected — same result.

## 5. Updating the app later

Whenever you edit `index.html` (or anything else) and want to push a new
version:

1. On GitHub, open the file, click the pencil (✏️) icon to edit directly, or
   delete + re-upload it.
2. If you touch `service-worker.js`'s cache list or logic, bump
   `CACHE_NAME` (e.g. `v1` → `v2`) inside that file — this forces installed
   copies to fetch the fresh version instead of serving a stale cached one.
3. Friends who already added it to their home screen just need to relaunch
   the app with an internet connection once to pick up the update.

## Notes

- Everything here is static (no backend, no build step) — GitHub Pages is a
  perfect fit, and it's free indefinitely for public repos.
- If you'd rather keep the repo private, GitHub Pages on private repos
  requires GitHub Pro — public is the free path.
- The custom domain option (Settings → Pages → Custom domain) works too if
  you own a domain and want a nicer URL than `github.io`.
