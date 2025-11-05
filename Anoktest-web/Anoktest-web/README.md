
# Anoktest Web

Event discovery and booking platform built with React and TypeScript.

## 🚀 Live Demo
[https://rauldiaz95.github.io/Anoktest-web/](https://rauldiaz95.github.io/Anoktest-web/)

## 🛠️ Technologies Used
- **React 18** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **pnpm** - Package manager

## 📋 Project Setup
1. Clone the repository
```bash
git clone https://github.com/RaulDiaz95/Anoktest-web.git
cd Anoktest-web
```

2. Install dependencies
```bash
pnpm install
```

3. Start development server
```bash
pnpm run dev
```

4. Build for production
```bash
pnpm run build
```

## 🌐 Deployment
The project is configured for automatic deployment to GitHub Pages.

### Deploy to GitHub Pages
```bash
pnpm run deploy
```

This command will:
- Build the project
- Deploy to GitHub Pages automatically

### Configuration
- Vite base path: `/Anoktest-web/`
- React Router basename: `/Anoktest-web`
- SPA routing support with 404.html redirect

## 📁 Project Structure
```
├── src/
│   ├── components/          # React components
│   ├── routes/              # Route components
│   ├── styles/              # CSS styles
│   └── main.tsx            # App entry point
├── public/
│   └── 404.html            # SPA routing handler
├── docs/                   # Documentation
└── dist/                   # Built assets
```
