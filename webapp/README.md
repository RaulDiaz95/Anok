# Anok Frontend

Event discovery and booking platform built with React and TypeScript.

## 🛠️ Technologies

- **React 18** - Frontend framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **TanStack React Query** - Data fetching and state management
- **React Hook Form + Zod** - Form handling and validation

## 📋 Development

### Install Dependencies

From the **root directory**:
```bash
npm run install:webapp
```

Or from **this directory**:
```bash
pnpm install
```

### Start Development Server

From the **root directory** (starts backend + frontend + database):
```bash
npm run dev
```

Or from **this directory** (frontend only):
```bash
pnpm dev
```

The application will be available at http://localhost:5173

### Build for Production

From the **root directory**:
```bash
npm run build:webapp
```

Or from **this directory**:
```bash
pnpm build
```

## 🔌 API Integration

The frontend connects to the backend API using the URL configured in `.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

For production deployments, update this to your production API URL.

## 📁 Project Structure

```
webapp/
├── src/
│   ├── components/          # React components
│   ├── routes/              # Route components
│   ├── styles/              # CSS styles
│   └── main.tsx            # App entry point
├── public/                 # Static assets
├── .env                    # Environment variables (local)
├── .env.example           # Environment template
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS config
└── package.json           # Dependencies and scripts
```

## 🚀 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build

## 📝 Notes

- This frontend is integrated into the Anok monorepo
- Use `npm run dev` from the root to start everything together
- The backend API must be running for full functionality
- See root README.md for complete setup instructions
