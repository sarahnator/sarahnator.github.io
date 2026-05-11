# Research Experiments Website Starter

A static GitHub Pages template for a research/project portfolio inspired by:

- Experiments with Google: searchable/filterable experiment cards
- Grant Kot: compact project-first demo links
- Benedikt Bitterli: clean research portfolio with selected projects

## Files

```text
index.html              # Main experiment collection page
project.html            # Reusable detail page for each project
scripts/projects.js     # Your project data lives here
scripts/main.js         # Renders/filter projects on the homepage
scripts/project-page.js # Renders individual project pages
styles/site.css         # Visual design
assets/projects/        # Images, GIFs, videos, thumbnails
```

## Customize

1. Replace `Your Name` in `index.html`, `project.html`, and `styles/site.css` comments if desired.
2. Replace `https://github.com/YOUR-USERNAME` links.
3. Edit `scripts/projects.js`.
4. Put images, GIFs, or short videos in `assets/projects/`.
5. Add your CV as `assets/cv.pdf`, or remove the CV link.

## Add a project

In `scripts/projects.js`, copy an object in `window.PROJECTS` and change:

```js
{
  id: "unique-url-slug",
  title: "Project title",
  date: "Spring 2026",
  year: "2026",
  category: "simulation",
  tags: ["MPM", "fluids"],
  image: "assets/projects/my-image.gif",
  featured: false,
  description: "One-line card description.",
  summary: "Longer project-page summary.",
  links: [
    { label: "Code", url: "https://github.com/..." },
    { label: "Paper", url: "..." }
  ],
  sections: [
    { heading: "Motivation", body: "..." },
    { heading: "Method", body: "..." }
  ]
}
```

Then open:

```text
project.html?id=unique-url-slug
```

## GitHub Pages setup with a new default branch

From your existing repository:

```bash
git checkout --orphan new-site
git rm -rf .
# copy these files into the repo root
git add .
git commit -m "Create new research website"
git push origin new-site
```

Then in GitHub:

1. Go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Pick `new-site` and `/root`.
4. Optionally set `new-site` as the default branch under **Settings → Branches**.

## Notes on images/GIFs

- Use `.webp`, `.jpg`, or `.png` for thumbnails.
- Use optimized `.gif` only for short loops.
- For smoother/lighter animations, use `.mp4` or `.webm`; the template supports those too.
- Keep thumbnails around 1200 px wide or smaller for faster loading.
