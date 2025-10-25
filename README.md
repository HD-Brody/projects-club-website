# UofT Projects Club Website

Website for the University of Toronto Projects Club.

**Live site**: [uoftprojects.com](https://uoftprojects.com)

## Running Locally

### Prerequisites
- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd projects-club-website
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The website will be available at `http://localhost:5173` (or another port if 5173 is occupied).

### Building for Production

Build the production-ready site:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

## Features

- Home page with club information and events
- Escape Room event registration (supports both team and individual sign-ups)
- Photo gallery from past events
- Sponsors showcase

## Tech Stack

- React + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
