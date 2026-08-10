# Aide — Setup Instructions

This folder contains your AI assistant app — the full version with file
uploads, Word/PDF/Excel export, and AI photo editing, ready to be hosted as a
website (PC) and installed as an app (Android).

## 1. Your API key
You already have a free Gemini API key from aistudio.google.com/apikey. Keep
it somewhere safe — you'll paste it into Netlify in step 3, not into any file
in this folder.

## 2. Update your GitHub repository
You already created a repository earlier. To update it with these new files:
1. Go to your repository on github.com.
2. Click into the repo, then click **Add file > Upload files**.
3. Open this aide-app folder on your computer, select everything inside it
   (index.html, manifest.json, netlify.toml, README.md, the icons folder,
   and the netlify folder), and drag them into the browser window.
4. GitHub will detect that files like `index.html` already exist and will
   ask to replace them — confirm this.
5. Scroll down and click **Commit changes**.

If you'd rather start fresh, you can also delete the old repository and
create a new one, then follow the original upload steps with these files.

## 3. Deploy on Netlify
1. Go to https://netlify.com and sign in (or sign up with your GitHub
   account if you haven't already).
2. If you already connected this repo to a Netlify site earlier: open that
   site, go to **Site configuration > Environment variables**, and update
   or add:
   - Key: `GEMINI_API_KEY`
   - Value: (paste your Gemini key)
   Then go to **Deploys > Trigger deploy** to rebuild with the new files
   and the new key.
3. If this is your first time deploying: click **Add new site > Import an
   existing project**, choose this repository, leave build settings as-is
   (Netlify reads `netlify.toml` automatically), and click **Deploy**. Then
   add the `GEMINI_API_KEY` environment variable as described above and
   redeploy.

You'll get a public link like `https://your-site-name.netlify.app` — this is
your website on any PC.

## 4. Install it on Android
1. Open your Netlify link in Chrome on your Android phone.
2. Tap the banner that says "Install Aide," or open the browser menu and
   choose **Add to Home screen**.
3. It now behaves like a normal app — its own icon, full-screen, no browser
   bar.

## 5. (Later) List it on the Google Play Store
1. Create a Google Play developer account (one-time $25 fee) at
   https://play.google.com/console
2. Use a free tool like **PWA Builder** (https://www.pwabuilder.com) — paste
   in your Netlify link, and it packages your site into an Android app file
   ready to upload to the Play Store. No rewriting required.

## What's included in this version
- Chat with Aide, powered by Gemini (free tier)
- Upload photos, PDFs, and text files for Aide to read
- Export any AI response as a Word document, PDF, or Excel spreadsheet
- AI photo editing — attach a photo, check "Edit this photo with AI,"
  describe the change, and download the result as PNG, JPG, or WebP
- Installable on Android and usable as a normal website on PC

## Notes
- Your API key never appears in the website's code — it's stored securely on
  Netlify and only used by the backend functions in `netlify/functions/`.
- Each message and image edit uses a small amount of your daily free Gemini
  usage, which resets every 24 hours.
- To change the app's name, colors, or wording, edit `index.html` and
  `manifest.json`.
- If Google ever retires the specific AI model this app uses (they do this
  periodically), you'll see an error mentioning "no longer available." Let
  your developer know so the model name in `netlify/functions/chat.js` and
  `netlify/functions/edit-image.js` can be updated.
