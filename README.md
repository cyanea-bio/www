# Cyanea Marketing Website

Marketing website for Cyanea, built with [Zola](https://www.getzola.org/).

## Prerequisites

- [mise](https://mise.jdx.dev/) for dependency management

## Setup

```bash
# Install dependencies
mise install

# Start development server
mise exec -- zola serve
```

The site will be available at http://127.0.0.1:1111

## Build

```bash
mise exec -- zola build
```

Output will be in the `public/` directory.

## Structure

```
www/
├── config.toml          # Zola configuration
├── content/             # Markdown content
│   ├── _index.md        # Homepage
│   ├── blog/            # Blog posts
│   └── ...              # Other pages
├── sass/                # SCSS stylesheets
├── static/              # Static assets
├── templates/           # Tera templates
└── themes/              # Zola themes (if any)
```

## Deployment

Build the site and deploy the `public/` directory to your hosting provider.
