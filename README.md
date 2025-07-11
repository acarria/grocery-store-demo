# SaveGo Wholesale Web Application

A modern, full-stack wholesale grocery application built with FastAPI, React, and TypeScript.

## Features

### Customer Features
- Browse inventory with real-time stock levels
- Add items to cart (with out-of-stock prevention)
- Visual indicators for out-of-stock items
- Place orders with complete cart
- View order history and current order status
- Email notifications for order updates

### Admin Features
- Inventory management dashboard
- Order management and status tracking
- Real-time order notifications
- Analytics and reporting dashboards
- Team collaboration tools

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Primary database
- **Redis** - Caching and session management
- **Celery** - Background task processing
- **SQLAlchemy** - ORM
- **Pydantic** - Data validation
- **Alembic** - Database migrations

### Frontend
- **React 18** with **TypeScript**
- **Next.js 14** - Full-stack React framework
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **React Hook Form** - Form handling

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy
- **SendGrid** - Email service

## Project Structure

```
grocery-store/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── core/           # Configuration and utilities
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── main.py         # FastAPI application
│   ├── alembic/            # Database migrations
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities and configurations
│   │   ├── types/         # TypeScript type definitions
│   │   └── styles/        # Global styles
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Development environment
└── README.md
```

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grocery-store
   ```

2. **Start the development environment**
   ```bash
   docker-compose up -d
   ```

3. **Access the applications**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Admin Dashboard: http://localhost:3000/admin

### Local Development

1. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories:

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost/grocery_store
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
SENDGRID_API_KEY=your-sendgrid-key
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout`