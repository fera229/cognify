# Cognify - Modern Learning Management System

## About Cognify

Cognify reimagines online education by providing a modern, intuitive platform where instructors can create and monetize courses while students enjoy an AI-enhanced learning experience. Built with Next.js 15, TypeScript and PostgreSQL.

## Key Features

Cognify delivers a comprehensive learning management solution with:

- Advanced course creation and management system with drag-and-drop organization
- Interactive video lessons with automatic transcription powered by Mux
- AI-powered learning assistance using Mistral AI
- Secure payment processing through Stripe integration
- Real-time progress tracking and analytics
- Custom session-based authentication system
- Responsive, modern UI built with shadcn/ui components

## Technology Stack

### Frontend

- **Next.js 15** with App Router for server-side rendering and routing
- **React 19** with TypeScript for type-safe component development
- **Tailwind CSS** with shadcn/ui for consistent, responsive design
- **React Hook Form** with Zod for robust form validation

### Backend

- **PostgreSQL** database with type-safe queries
- **Custom authentication** system with secure session management
- **RESTful API** endpoints for efficient data handling

### Third-Party Integrations

- **Mux** for video processing and streaming
- **Stripe** for secure payment processing
- **Mistral AI** for intelligent learning assistance
- **UploadThing** for file management

## Getting Started

```bash
# Clone the repository
git clone https://github.com/yourusername/cognify.git

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Run database migrations
pnpm migrate

# Start development server
pnpm dev
```

## Architecture Overview

Cognify implements a modern, modular architecture:

- Server-side rendering for optimal performance
- Type-safe database queries and API endpoints
- Secure session-based authentication
- Real-time data updates
- Responsive, mobile-first design

## Project Structure

```
/app                 # Next.js app directory
  /(auth)           # Authentication routes
  /(courseDisplay)  # Course viewing components
  /(dashboard)      # User dashboard
/components         # Reusable UI components
/database           # Database operations
/migrations         # Database migrations
/util               # Utility functions
```

## Environment Setup

### Required environment variables:

#### DB

```
PGHOST=localhost
PGDATABASE=xxxxxxxxxxx
PGUSERNAME=xxxxxxxxxxx
PGPASSWORD=xxxxxxxxxxx
```

#### UploadThing:

```
UPLOADTHING_TOKEN=XXXXXXXXXXXXXXXX
```

#### Mux

```
MUX_TOKEN_ID=XXXXXXXXXXXXXXXX
MUX_TOKEN_SECRET=XXXXXXXXXXXXXXXX
```

#### Mistral api

```
MISTRAL_API_KEY=XXXXXXXXXXXXXXXX
```

#### Stripe

```
STRIPE_PUBLISHABLE_KEY=XXXXXXXXXXXXXXXX
STRIPE_SECRET_KEY=XXXXXXXXXXXXXXXX
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or collaboration opportunities, reach out at [https://www.linkedin.com/in/feras-nasr-0999a633b/]

Built with ❤️ using Next.js, TypeScript, and PostgreSQL
