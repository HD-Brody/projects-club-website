# Frontend Source Structure

This document describes the organization of the frontend source code.

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Main navigation header
│   ├── Footer.tsx      # Site footer with social links
│   ├── Lightbox.tsx    # Image lightbox component
│   └── index.ts        # Component exports
│
├── pages/              # Page components (routes)
│   ├── HomePage.tsx    # Main landing page
│   ├── EscapeRoomPage.tsx   # Escape room registration page
│   ├── LoginSignupPage.tsx  # Login and signup page
│   └── index.ts        # Page exports
│
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Component Guidelines

### Components (`components/`)
- **Purpose**: Reusable UI components that can be used across multiple pages
- **Examples**: Header, Footer, Lightbox, Buttons, Forms
- **Best Practice**: Keep components generic and configurable through props

### Pages (`pages/`)
- **Purpose**: Top-level page components that represent different routes
- **Examples**: HomePage, LoginSignupPage, EscapeRoomPage
- **Best Practice**: Pages should compose smaller components and handle page-specific logic

## Usage Examples

### Importing Components
```tsx
import { Header, Footer, Lightbox } from '../components';
// or
import Header from '../components/Header';
```

### Importing Pages
```tsx
import { HomePage, EscapeRoomPage } from './pages';
// or
import HomePage from './pages/HomePage';
```

## Adding New Components

1. **Create the component file** in the appropriate directory
   - `components/` for reusable UI elements
   - `pages/` for new routes/pages

2. **Export the component** as default:
   ```tsx
   export default function MyComponent() {
     // ...
   }
   ```

3. **Add to index.ts** for cleaner imports:
   ```tsx
   export { default as MyComponent } from './MyComponent';
   ```

## Routing

The app uses hash-based routing in `App.tsx`:
- `#/` or no hash → HomePage
- `#/login` → LoginSignupPage
- `#/escape` → EscapeRoomPage

To add a new route:
1. Create the page component in `pages/`
2. Import it in `App.tsx`
3. Add a new route condition in the App component
