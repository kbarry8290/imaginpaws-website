# ImaginPaws Static Site

A static website for ImaginPaws AI pet transformations built with Tailwind CSS.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the CSS (for development with watch mode):
```bash
npm run build:css
```

3. Build the CSS (for production):
```bash
npm run build
```

## Development

- Run `npm run build:css` to start the Tailwind CSS build process in watch mode
- This will automatically rebuild the CSS when you make changes
- Open `index.html` in your browser to view the site

## File Structure

```
├── index.html          # Main HTML file
├── src/
│   └── input.css      # Tailwind CSS input file
├── dist/
│   └── output.css     # Generated CSS (created after build)
├── tailwind.config.js # Tailwind configuration
└── package.json       # Dependencies and scripts
```

## Adding Images

Place your images in the `examples/` directory:
- `examples/pet-to-person.jpg`
- `examples/pet-portrait.jpg`
- `examples/fantasy-pet.jpg`

## Customization

- Edit `src/input.css` to add custom styles
- Modify `tailwind.config.js` to customize Tailwind settings
- Update `index.html` for content changes
