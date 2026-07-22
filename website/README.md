# AI Job Search Website

This directory contains the static website for AI Job Search.

## GitHub Pages Deployment

The website is deployed automatically to GitHub Pages when changes are pushed to the `main` branch.

### Setup Instructions

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Select the `main` branch and `/website` folder
5. Click **Save**

The website will be available at: `https://madslorentzen.github.io/ai-job-search/`

### Local Development

To preview the website locally:

```bash
cd website
python3 -m http.server 8000
# or
npx serve .
```

Then open http://localhost:8000 in your browser.

### Files

- `index.html` - Main landing page
- `download.html` - Download page for executables
- `docs.html` - Documentation page
- `css/style.css` - Stylesheet
- `js/main.js` - JavaScript for interactivity

### Custom Domain

To use a custom domain:

1. Create a `CNAME` file in the `website/` directory
2. Add your domain (e.g., `aijobsearch.dev`)
3. Configure DNS to point to `madslorentzen.github.io`
