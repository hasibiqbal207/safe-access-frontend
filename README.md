# SafeAccess Frontend

A modern, secure authentication and session management system built with Next.js 15, featuring multi-factor authentication (MFA), comprehensive session management, and a beautiful, responsive user interface.

## 🚀 Features

### Authentication & Security
- **User Authentication**: Secure login and registration with email verification
- **Multi-Factor Authentication (MFA)**: TOTP-based 2FA with QR code setup and backup codes
- **Password Management**: Forgot password, reset password, and change password functionality
- **Session Management**: View all active sessions, revoke individual sessions, or logout from all devices
- **Protected Routes**: Middleware-based route protection with automatic redirects

### User Experience
- **Responsive Design**: Mobile-first design that works seamlessly across all devices
- **Dark Mode Support**: Built-in theme switching with next-themes
- **Toast Notifications**: Real-time feedback for user actions
- **Form Validation**: Client-side validation with React Hook Form and Zod
- **Modern UI Components**: Radix UI primitives with custom styling

### Developer Experience
- **TypeScript**: Full type safety across the application
- **Docker Support**: Development and production Docker configurations
- **API Client**: Centralized Axios client with authentication handling
- **Custom Hooks**: Reusable hooks for authentication, mobile detection, and toasts
- **Context Providers**: Organized state management with React Context

## 🛠️ Technology Stack

### Core Framework
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety

### Styling & UI
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible UI primitives
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

### Data & Forms
- **[TanStack Query](https://tanstack.com/query)** - Data fetching and caching
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Zod](https://zod.dev/)** - Schema validation
- **[Axios](https://axios-http.com/)** - HTTP client

### Utilities
- **[date-fns](https://date-fns.org/)** - Date manipulation
- **[ua-parser-js](https://github.com/faisalman/ua-parser-js)** - User agent parsing
- **[cookies-next](https://github.com/andreizanik/cookies-next)** - Cookie management
- **[input-otp](https://input-otp.rodz.dev/)** - OTP input component

## 📁 Project Structure

```
safe-access-frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Authentication routes group
│   │   │   ├── page.tsx         # Login page
│   │   │   ├── signup/          # Registration
│   │   │   ├── confirm-account/ # Email verification
│   │   │   ├── forgot-password/ # Password recovery
│   │   │   ├── reset-password/  # Password reset
│   │   │   └── verify-mfa/      # MFA verification
│   │   ├── (main)/              # Protected routes group
│   │   │   ├── home/            # Dashboard
│   │   │   └── sessions/        # Session management
│   │   ├── components/          # Shared UI components
│   │   ├── globals.css          # Global styles
│   │   └── layout.tsx           # Root layout
│   ├── context/                 # React Context providers
│   │   ├── auth-provider.tsx    # Authentication context
│   │   ├── query-provider.tsx   # TanStack Query provider
│   │   └── theme-provider.tsx   # Theme context
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-auth.ts          # Authentication hook
│   │   ├── use-mobile.tsx       # Mobile detection hook
│   │   └── use-toast.ts         # Toast notification hook
│   ├── lib/                     # Utility libraries
│   │   ├── api.ts               # API endpoint functions
│   │   ├── axios-client.ts      # Axios configuration
│   │   ├── parse-useragent.ts   # User agent parser
│   │   └── utils.ts             # Utility functions
│   └── middleware.ts            # Next.js middleware for route protection
├── docker/                      # Docker configurations
│   ├── Dockerfile.dev           # Development Dockerfile
│   └── Dockerfile.prod          # Production Dockerfile
├── public/                      # Static assets
├── .env                         # Environment variables
├── compose.yaml                 # Docker Compose configuration
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # TailwindCSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

## 🚦 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher (see `.nvmrc`)
- **npm**: Version 9 or higher
- **Docker** (optional): For containerized development

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd safe-access-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:6003/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:6004](http://localhost:6004)

### Available Scripts

- `npm run dev` - Start development server on port 6004
- `npm run build` - Build production bundle
- `npm run start` - Start production server on port 6004
- `npm run lint` - Run ESLint

## 🐳 Docker Deployment

### Development Environment

```bash
# Build and run development container
docker-compose up development

# Access at http://localhost:6004
```

The development container includes:
- Hot reload enabled
- Volume mounting for live code updates
- Node modules cached in container

### Production Environment

```bash
# Build and run production container
docker-compose up production

# Access at http://localhost:6004
```

The production container:
- Optimized build with `next build`
- Minimal image size
- Production-ready configuration

### Docker Compose Configuration

Both environments connect to the `safe-access-network` network, allowing communication with backend services.

## 🔌 API Integration

### API Client Configuration

The application uses a centralized Axios client (`src/lib/axios-client.ts`) with:
- Base URL configuration from environment variables
- Automatic cookie handling
- Request/response interceptors
- Error handling

### Authentication Flow

1. **Login**: User submits credentials → Receives access token → Stored in cookies
2. **MFA (if enabled)**: Redirected to MFA verification → Submits TOTP code → Authenticated
3. **Protected Routes**: Middleware checks for access token → Allows/denies access
4. **Token Refresh**: Automatic token refresh on expiration
5. **Logout**: Clears tokens and redirects to login

### Available API Endpoints

#### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - Logout current session
- `POST /auth/logout-all` - Logout all sessions
- `POST /auth/verify-email` - Verify email address
- `POST /auth/resend-verification` - Resend verification email

#### Password Management
- `POST /auth/password/forgot` - Request password reset
- `POST /auth/password/reset` - Reset password with token
- `PUT /auth/password/change` - Change password (authenticated)

#### Multi-Factor Authentication
- `GET /auth/mfa/setup` - Get MFA setup QR code
- `POST /auth/mfa/enable` - Enable MFA
- `POST /auth/mfa/disable` - Disable MFA
- `POST /auth/mfa/verify-login` - Verify MFA during login
- `POST /auth/mfa/generate-backup-codes` - Generate backup codes

#### Session Management
- `GET /auth/sessions/` - Get current session
- `GET /auth/sessions/all` - Get all user sessions
- `DELETE /auth/sessions/:id` - Delete specific session
- `DELETE /auth/sessions/all` - Delete all sessions

#### User Profile
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update user profile
- `PUT /users/change-email` - Change user email
- `DELETE /users/delete/:id` - Delete user account

## 🔐 Authentication & Security Features

### Route Protection

The middleware (`src/middleware.ts`) automatically:
- Redirects unauthenticated users from protected routes to login
- Redirects authenticated users from auth pages to home
- Validates access tokens from cookies

**Protected Routes**: `/home`, `/sessions`  
**Public Routes**: `/`, `/signup`, `/confirm-account`, `/forgot-password`, `/reset-password`, `/verify-mfa`

### MFA Implementation

1. **Setup**: User navigates to MFA settings → Scans QR code with authenticator app
2. **Enable**: User enters TOTP code → MFA enabled on account
3. **Login**: After credentials → Redirected to MFA verification → Enters TOTP code
4. **Backup Codes**: Generated during setup for account recovery

### Session Management

Users can:
- View all active sessions with device information (parsed from user agent)
- See session creation and expiration times
- Identify current session
- Revoke individual sessions
- Logout from all devices simultaneously

## 🎨 UI Components

The application uses a custom component library built on Radix UI primitives:

- **Form Components**: Input, Label, Form (with React Hook Form integration)
- **Feedback**: Toast, Toaster, Skeleton
- **Navigation**: Sidebar, Dropdown Menu, Sheet
- **Overlays**: Dialog, Tooltip
- **Display**: Avatar, Button, Separator
- **Specialized**: Input OTP (for MFA codes)

All components support:
- Dark mode theming
- Accessibility (ARIA attributes)
- Keyboard navigation
- Custom styling with TailwindCSS

## 🎯 Key Features Explained

### Context Providers

**AuthProvider** (`src/context/auth-provider.tsx`)
- Manages authentication state
- Provides user information across the app
- Handles token storage and retrieval

**QueryProvider** (`src/context/query-provider.tsx`)
- Configures TanStack Query
- Manages data fetching and caching

**ThemeProvider** (`src/context/theme-provider.tsx`)
- Handles light/dark mode switching
- Persists theme preference

### Custom Hooks

**useAuth** (`src/hooks/use-auth.ts`)
- Access authentication context
- Get current user information

**useMobile** (`src/hooks/use-mobile.tsx`)
- Detect mobile viewport
- Responsive UI adjustments

**useToast** (`src/hooks/use-toast.ts`)
- Display toast notifications
- Manage toast queue

## 🤝 Contributing

### Code Style

- Use TypeScript for all new files
- Follow the existing component structure
- Use Tailwind utility classes for styling
- Implement proper error handling
- Add loading states for async operations

### Component Patterns

1. **Server Components**: Default for pages and layouts
2. **Client Components**: Use `"use client"` for interactive components
3. **Form Handling**: Use React Hook Form with Zod validation
4. **Data Fetching**: Use TanStack Query for API calls
5. **Styling**: Use Tailwind with the custom theme system

### Best Practices

- Keep components small and focused
- Extract reusable logic into custom hooks
- Use TypeScript types from `src/lib/api.ts`
- Handle loading and error states
- Provide user feedback with toasts
- Ensure mobile responsiveness
- Test authentication flows thoroughly

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:6003/api` |

> **Note**: Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## 🔗 Related Documentation

- **Backend Documentation**: See the backend repository's README for API details
- **Next.js Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **Radix UI Documentation**: [https://www.radix-ui.com/docs](https://www.radix-ui.com/docs)
- **TanStack Query Documentation**: [https://tanstack.com/query/latest](https://tanstack.com/query/latest)

## 📄 License

This project is part of the SafeAccess application suite.

---

**Built with ❤️ using Next.js 15 and modern web technologies**
