<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/77cbc32a-ff2b-4dac-b0cc-2aec6a7c411f

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to GitHub Pages (works in Chrome)

This project is a Vite SPA. For GitHub Pages repo deployments, assets must load from the correct base path.

Your GitHub Pages repository is named: **new-HB**

### Steps
1. Build:
   `npm run build`
2. GitHub → **Settings** → **Pages**
3. Source: **Deploy from a branch**
4. Publish the `dist/` contents to the Pages branch (commonly `gh-pages`) at **/(root)**
5. Verify in Chrome:
   - Open `https://<username>.github.io/new-HB/`

