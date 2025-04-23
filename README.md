# Valmeekam Karthik's Personal Website

This is the source code for my personal website, showcasing my academic and professional journey.

## Project Structure

```
.
├── src/                    # Source files
│   ├── components/         # Reusable HTML components
│   │   ├── navbar.html
│   │   ├── hero.html
│   │   ├── about.html
│   │   ├── education.html
│   │   ├── learnings.html
│   │   └── research.html
│   ├── templates/          # Base templates
│   │   └── base.html
│   ├── index.html          # Main entry point
│   └── build.js            # Build script
├── css/                    # Stylesheets
├── js/                     # JavaScript files
├── images/                 # Image assets
└── index.html              # Generated output
```

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/karthikv792/karthikv792.github.io.git
   cd karthikv792.github.io
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Building

To build the website:

```bash
npm run build
```

This will process all HTML includes and generate the final `index.html` file in the root directory.

### Development Mode

To automatically rebuild when files change:

```bash
npm run watch
```

## Adding New Components

1. Create a new HTML file in the `src/components/` directory
2. Add the component to `src/index.html` using the include syntax:
   ```html
   <!--#include file="components/your-component.html" -->
   ```
3. Run the build process to see your changes

## Deployment

The website is automatically deployed to GitHub Pages when changes are pushed to the main branch.

## License

This project is licensed under the MIT License - see the LICENSE file for details.