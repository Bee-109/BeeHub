# 🐝 BeeHub

**The personal portfolio and creator hub of Bee.**

BeeHub is a personal portfolio website built to showcase my projects, games, skills, and creative work. It includes a private admin dashboard that allows me to manage portfolio content without manually editing the frontend every time something changes.

🌐 **Live Website:** [beehub-portfolio.vercel.app](https://beehub-portfolio.vercel.app/)

---

## ✨ Features

### 🎨 Personal Portfolio
- Personal introduction and creator profile
- Skills and technologies showcase
- Portfolio statistics
- Featured projects and games
- Additional projects section
- Contact information and social links
- Responsive layout for different screen sizes

### 🎮 Project Showcase
- Display projects with titles, descriptions, and images
- Organize projects by status and platform
- Assign projects to featured and additional-project slots
- Manage project information through the admin dashboard

### 🛠️ Admin Dashboard
- Email and password authentication
- Protected dashboard access
- Edit portfolio statistics
- Create, update, and delete project entries
- Upload project images
- Manage featured-project and other-project placements
- Sign out of the admin session

### ☁️ Backend Integration
- Supabase authentication
- PostgreSQL database integration
- Supabase Storage for project images
- Vercel deployment

---

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | User interface |
| TypeScript | Type safety |
| Vite | Development server and build tooling |
| React Router | Client-side routing |
| Supabase | Authentication, database, and storage |
| CSS | Styling and responsive layouts |
| Vercel | Deployment |

---

## 📂 Project Structure

```text
BeeHub/
├── public/                 # Static assets
├── src/
│   ├── lib/
│   │   └── supabase.ts     # Supabase client configuration
│   ├── pages/
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── FeaturedSlots.tsx
│   │   ├── OtherProjectSlots.tsx
│   │   ├── ProjectManager.tsx
│   │   └── ProtectedRoute.tsx
│   ├── App.tsx             # Main application and portfolio
│   ├── App.css             # Application styles
│   ├── index.css           # Global styles
│   └── main.tsx            # Application entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) — a version compatible with the project's dependencies
- npm
- A [Supabase](https://supabase.com/) project for backend functionality

### 1. Clone the repository

```bash
git clone https://github.com/Bee-109/BeeHub.git
cd BeeHub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Replace the placeholder values with your Supabase project's URL and publishable key.

**Security note:** Variables prefixed with `VITE_` are exposed to browser code. Never put service-role keys, database passwords, or other privileged secrets in this file. Configure appropriate database and storage access policies in Supabase.

### 4. Start the development server

```bash
npm run dev
```

Vite will provide a local URL in the terminal, usually `http://localhost:5173`.

### 5. Build for production

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

### Additional commands

```bash
npm run lint
```

Runs the project's configured lint checks.

---

## 🗄️ Backend Configuration

BeeHub uses Supabase for its backend services.

Before running the complete application, make sure your Supabase project has the database tables, columns, storage bucket, and access policies expected by the application.

The frontend expects portfolio project data, portfolio statistics, and project-image storage. Refer to the source code for the current schema and field requirements.

Admin access should be restricted through appropriate authentication and database authorization policies. Hiding an admin page behind a frontend route alone is not a security boundary.

> **Note:** This repository's README does not currently include a complete database schema or SQL setup script. A fresh Supabase project may require additional configuration before all features work.

---

## 🌍 Deployment

BeeHub is deployed through Vercel.

To deploy your own instance:

1. Import the repository into [Vercel](https://vercel.com/).
2. Configure the required Supabase environment variables in the project settings.
3. Deploy the application using the Vite build configuration.
4. Configure the appropriate Supabase authentication and authorization settings.

Your deployment may require additional configuration depending on the Supabase schema and authentication setup.

---

## 🛣️ Future Improvements

Potential improvements for future iterations include:

- Automated testing and stronger data validation
- Improved project management workflows
- Additional project categories and filtering
- More detailed game and development showcases
- Better documentation for database setup and deployment

---

## 👨‍💻 About the Creator

**Bee** — a developer and creator interested in game development, programming, 3D art, and building creative projects.

BeeHub is part of my personal creator ecosystem, providing a central place to showcase my work and share what I'm building.

- **GitHub:** [@Bee-109](https://github.com/Bee-109)
- **Portfolio:** [BeeHub](https://beehub-portfolio.vercel.app/)

---

## 📄 License

No license has been specified for this repository yet.

Until a license is added, others should not assume they have permission to redistribute or reuse the source code. If you intend to make BeeHub open source, consider adding a `LICENSE` file with your chosen license.

---

*Built with curiosity, creativity, and a little bit of honey. 🐝*
