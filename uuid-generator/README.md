# UUID Generator

A modern, feature-rich UUID generator web application built with React, TypeScript, and Vite.

## Features

- **Multiple UUID Versions**: Support for UUID v1, v3, v4, v5, v6, v7, and v8
- **Bulk Generation**: Generate up to 1000 UUIDs at once
- **Multiple Output Formats**:
  - Normal (with hyphens)
  - No hyphens
  - Uppercase
  - Lowercase
  - JSON
  - CSV
  - Newline separated
- **Copy & Download**: Copy individual UUIDs or all at once, download as TXT/CSV/JSON
- **Dark Mode**: Toggle between light and dark themes (persisted in localStorage)
- **Responsive Design**: Works on desktop and mobile devices
- **RFC 4122 Compliant**: All generated UUIDs follow the RFC 4122 standard

## Quick Start

### Development

```bash
cd uuid-generator
npm install
npm run dev
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Deploy to GitHub Pages

1. Build the project: `npm run build`
2. Push the `dist/` folder to your `gh-pages` branch
3. Configure GitHub Pages to use the `gh-pages` branch

### Deploy to Cloudflare Pages

1. Build the project: `npm run build`
2. Connect your repository to Cloudflare Pages
3. Set build command: `npm run build`
4. Set build output directory: `dist`

## Project Structure

```
uuid-generator/
├── src/
│   ├── components/
│   │   └── UUIDGenerator.tsx    # Main generator component
│   ├── utils/
│   │   └── uuid.ts              # UUID generation utilities
│   ├── App.tsx                  # Root component with theme toggle
│   ├── main.tsx                 # Entry point
│   └── index.css                # Global styles
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── dist/                        # Production build output
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## API (Future)

For Cloudflare Workers integration, add an API endpoint:

```typescript
// /api/uuid
export default {
  async fetch(request: Request) {
    const url = new URL(request.url);
    const version = parseInt(url.searchParams.get('v') || '4');
    const count = parseInt(url.searchParams.get('count') || '1');
    
    // Generate UUIDs and return JSON
    return Response.json({ uuids: generateUUIDs({ version, count }) });
  }
};
```

## License

MIT
