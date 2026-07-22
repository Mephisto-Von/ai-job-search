# /portfolio - Generate Personal Portfolio Site

You are orchestrating a portfolio site generation workflow. The user wants to create a personal portfolio website to showcase their work and skills.

Follow these steps **exactly in order**.

---

## Step 1: Collect Portfolio Requirements

Gather the following from the user:

1. **Portfolio type**:
   - Single-page portfolio
   - Multi-page website
   - GitHub Pages site
   - Custom domain site

2. **Content to include**:
   - Projects (with descriptions, links, images)
   - Skills and technologies
   - Work experience
   - Education
   - Blog posts (optional)
   - Contact information

3. **Design preferences**:
   - Style (minimalist, colorful, dark mode, etc.)
   - Layout (grid, list, card-based)
   - Color scheme
   - Fonts

4. **Technical requirements**:
   - Static HTML/CSS/JS
   - Framework (React, Vue, plain HTML)
   - Hosting platform (GitHub Pages, Netlify, Vercel)

---

## Step 2: Read Candidate Profile

Read the candidate's profile from:
- `.claude/skills/job-application-assistant/01-candidate-profile.md`
- `CLAUDE.md` (Candidate Profile section)

Extract relevant information for the portfolio:
- Skills and technologies
- Work experience
- Education
- Projects (if listed)

---

## Step 3: Content Structure

### Standard Portfolio Sections

1. **Hero Section**
   - Name and title
   - Brief tagline (1-2 sentences)
   - Call to action (View Projects, Contact Me)

2. **About Section**
   - Professional summary
   - Key skills
   - What you're looking for

3. **Projects Section**
   - Project cards with:
     - Title
     - Description
     - Technologies used
     - Live demo link
     - GitHub link
     - Screenshots/images

4. **Skills Section**
   - Technical skills (grouped by category)
   - Tools and technologies
   - Proficiency levels (optional)

5. **Experience Section**
   - Work history (from profile)
   - Key achievements
   - Technologies used in each role

6. **Education Section**
   - Degrees
   - Certifications
   - Relevant coursework

7. **Contact Section**
   - Email
   - LinkedIn
   - GitHub
   - Other social links
   - Contact form (optional)

---

## Step 4: Generate Portfolio Code

### Option A: Simple HTML/CSS Portfolio

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Your Name] - Portfolio</title>
    <style>
        /* CSS styles */
    </style>
</head>
<body>
    <!-- Portfolio content -->
</body>
</html>
```

### Option B: GitHub Pages with Jekyll

Create a `_config.yml` and markdown files for easy updates.

### Option C: Modern Framework

Generate a React/Vue project with a template like:
- Vite + React
- Next.js
- Gatsby

---

## Step 5: Project Card Template

For each project, create a card with:

```html
<div class="project-card">
    <img src="project-screenshot.jpg" alt="Project Name">
    <h3>Project Name</h3>
    <p>Brief description of what this project does and what technologies were used.</p>
    <div class="technologies">
        <span class="tech-tag">React</span>
        <span class="tech-tag">Node.js</span>
        <span class="tech-tag">MongoDB</span>
    </div>
    <div class="links">
        <a href="live-demo-url">Live Demo</a>
        <a href="github-url">GitHub</a>
    </div>
</div>
```

---

## Step 6: Responsive Design

Ensure the portfolio is:
- Mobile-first
- Responsive on all screen sizes
- Accessible (proper headings, alt text, keyboard navigation)
- Fast loading (optimize images, lazy loading)

---

## Step 7: SEO and Meta Tags

Add proper meta tags:
- Title tag
- Meta description
- Open Graph tags (for social sharing)
- Twitter Card tags
- Canonical URL

---

## Step 8: Deployment Instructions

Provide deployment instructions for the chosen platform:

### GitHub Pages
1. Create a new repository named `username.github.io`
2. Push portfolio code to the repository
3. Enable GitHub Pages in repository settings
4. Your site will be live at `https://username.github.io`

### Netlify
1. Connect your GitHub repository
2. Set build command (if applicable)
3. Deploy automatically on push

### Vercel
1. Import your repository
2. Configure build settings
3. Deploy with zero configuration

---

## Step 9: Present Output

Format the output as:

### Portfolio Structure
[Directory structure and file list]

### Generated Files
- `index.html` (or main component)
- `styles.css` (if separate)
- `script.js` (if needed)
- `README.md` (deployment instructions)

### Customization Guide
- How to update projects
- How to change colors/fonts
- How to add new sections

### Next Steps
1. Review the generated portfolio
2. Add your own projects and images
3. Customize the design
4. Deploy to your chosen platform

---

## Step 10: Additional Assistance

Ask the user:
- "Would you like me to generate a specific type of portfolio (minimalist, creative, etc.)?"
- "Should I help you optimize your projects for specific job applications?"
- "Would you like me to create a custom domain setup guide?"
