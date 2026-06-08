# Rushd Platform - Frontend

<div align="center">
  <h3>AI-Driven Business Decision Dashboard</h3>
  <p>Empowering investors and executives with actionable insights</p>
</div>

## 🚀 Overview

Rushd Platform is a comprehensive dashboard application built with modern web technologies. It provides real-time data analysis, AI-driven insights, and multi-module dashboards designed for executive-level decision making.

## ✨ Features Overview

- **Executive Dashboard** - Real-time KPIs with AI-powered summaries
- **Department Modules** - Sales, Marketing, HR, Operations, Inventory dashboards
- **Collaboration Tools** - Project management and team coordination
- **Compliance Tools** - Risk assessment and regulatory compliance
- **Charity Management** - Donor databases and onboarding flows
- **AI Analysis** - Advanced data analysis with natural language processing

## 📦 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.x | UI Framework |
| TypeScript | 5.x | Type Safety |
| Vite | 6.x | Build Tool |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | latest | UI Components |
| Recharts | latest | Charts |
| Lucide React | latest | Icons |
| React Router | v7 | Routing |

## 🏗 Architecture

### Clean Architecture Layers

```
rushd-platform/
├── src/
│   ├── api/                    # API Layer (Clean Architecture)
│   │   ├── client.ts           # Base HTTP client with auth, retries, interceptors
│   │   ├── config.ts           # API configuration from environment variables
│   │   ├── types.ts            # Shared request/response types
│   │   └── services/               # Domain-specific service classes
│   │       ├── auth-service.ts       # Authentication operations (OAuth, refresh tokens)
│   │       ├── dashboard-service.ts   # Dashboard data fetching
│   │       └── index.ts               # Service registry
│   ├── app/                    # Application Layer
│   │   ├── components/         # React components with reusable UI
│   │   │   ├── ui/             # shadcn/ui primitive components
│   │   │   │   ├── stat-card.tsx      # Reusable KPI card component
│   │   │   │   ├── chart-card.tsx     # Chart container component
│   │   │   │   ├── alert-item.tsx     # Reusable alert card
│   │   │   │   ├── recommendation-item.tsx   # Recommendation item component
│   │   │   │   ├── page-header.tsx    # Page header component
│   │   │   │   ├── dashboard-section.tsx   # Grid section layout
│   │   │   │   └── faq-section.tsx    # FAQ/collapsible section
│   │   │   └── ...             # Feature-specific components
│   │   ├── layouts/            # Page layout components
│   │   ├── App.tsx             # Root application component
│   │   └── routes.tsx           # Route definitions
│   ├── lib/                    # Utility Libraries
│   │   ├── env.ts              # Environment configuration manager (OOP singleton)
│   │   └── utils.ts            # Shared utilities
│   └── styles/                 # Global styles and themes
├── .env                        # 🚫 Environment variables (DO NOT COMMIT)
├── .env.example                # ✅ Environment template (COMMIT THIS)
├── Dockerfile                  # Multi-stage production Docker build
├── docker-compose.yml           # Docker orchestration with environment variables
├── nginx.conf                  # Production Nginx configuration
└── package.json
```

### Design Patterns Used

1. **Singleton Pattern** - `EnvManager` ensures single source of truth for configuration
2. **Service Layer** - Domain-specific API services encapsulate business logic
3. **Registry Pattern** - `ServiceRegistry` manages service dependencies
4. **Component-Oriented** - Each UI element is a reusable, composable unit

## 🔧 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher (or pnpm)
- Git

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/rushd-platform.git
   cd rushd-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Create production environment file**
   ```bash
   cp .env.example .env.production
   # Edit .env.production with production values
   ```

2. **Build and run**
   ```bash
   docker-compose up --build -d
   ```

3. **Access the application**
   Navigate to `http://localhost:80`

### Using Docker Directly

```bash
# Build the Docker image with build arguments from .env
docker build \
  --build-arg VITE_API_BASE_URL=https://api.your-domain.com \
  --build-arg VITE_APP_NAME="Rushd Platform" \
  -t rushd-frontend:latest .

# Run the container
docker run -d \
  -p 80:80 \
  --name rushd-frontend \
  --restart unless-stopped \
  rushd-frontend:latest
```

### Docker Environment Variables

The Docker build accepts all `VITE_` prefixed environment variables as build arguments. These are defined in `.env.example` and loaded via `docker-compose.yml`.

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://api.rushd-platform.com/v1` |
| `VITE_API_TIMEOUT` | Request timeout (ms) | `30000` |
| `VITE_ENABLE_AI_ANALYSIS` | Toggle AI features | `true` |

## ⚙ Environment Variables

All configuration is managed through `.env` files. The `EnvManager` class in `src/lib/env.ts` provides type-safe access with defaults.

### Core Variables

| Variable | Description | Type | Default |
|----------|-------------|------|---------|
| `VITE_APP_NAME` | Application display name | string | Rushd Platform |
| `VITE_API_BASE_URL` | Backend API base URL | string | http://localhost:3000/api |
| `VITE_AUTH_TOKEN_KEY` | LocalStorage auth key | string | rushd_auth_token |
| `VITE_ENABLE_AI_ANALYSIS` | Enable AI features | boolean | true |
| `VITE_ENABLE_DARK_MODE` | Default theme mode | boolean | true |
| `VITE_API_RETRY_ATTEMPTS` | Network retry count | number | 3 |

See `.env.example` for the complete list of all available variables.

## 🧪 Development

### Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Adding New Features

1. Create a new component in `src/app/components/`
2. Add routes in `src/app/routes.tsx`
3. Add navigation link in `src/app/components/Sidebar.tsx`
4. Create API service in `src/api/services/`
5. Register service in `src/api/services/index.ts`
6. Update `.env.example` if new environment variables are needed

## 📄 License

[License information to be added]

## 🤝 Contributing

[Contributing guidelines to be added]

## 📞 Support

For support, email support@rushd-platform.com or join our community.

---

Built with ❤️ for better business decisions.
