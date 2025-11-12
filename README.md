# Christina's Personal Website

A modern personal portfolio website built with Astro, featuring web development projects, UI/UX design work, and blog content.

## Tech Stack

- Framework: Astro 4.0
- Styling: CSS with responsive design
- Content: Markdown for blog posts
- Deployment: Ready for Netlify, Vercel, or any static hosting

## Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:4321`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |

## Content Management

### Blog Posts
Add new blog posts as `.md` files in `src/data/blog-posts/` with frontmatter:

```markdown
---
title: "Your Post Title"
pubDate: 2024-01-01
description: "A brief description of your post"
layout: "../../layouts/BlogPostLayout.astro"
---

Your blog content here...
```

### Projects
Update projects in `src/pages/about.astro` by modifying the projects list section.

## Customization

- Colors: Modify CSS variables in `src/styles/global.css`
- Fonts: Update font imports in `src/styles/fonts.css`
- Layout: Edit components in `src/components/`
- Content: Update pages in `src/pages/`
