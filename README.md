# Task API

Professional REST API built with Node.js, Express.js, and PostgreSQL.

## Features

- User authentication with JWT
- Task management (CRUD operations)
- PostgreSQL database
- Docker containerization
- Input validation with Joi
- Error handling
- CORS support
- Security with Helmet

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Containerization**: Docker
- **Validation**: Joi

## Installation

### Local Setup

```bash
# Clone the repository
git clone https://github.com/axelcodeds/task-api.git
cd task-api

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your database credentials
```

### Docker Setup

```bash
docker-compose up -d
```

## Usage

### Start Development Server

```bash
npm run dev
```

Server will run on `http://localhost:3000`

### Health Check

```bash
curl http://localhost:3000/health
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users

- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

Note: user endpoints are self-only. The authenticated user can only access their own user id.

### Tasks

- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

## Testing

```bash
npm test
```

## Deployment

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## License

MIT
