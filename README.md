
# Project Name

## Prerequisites
Make sure you have the following installed on your local system:
- Docker
- Docker Compose

## Project Structure

```
├── client/                   # React frontend
│   ├── Dockerfile            # Dockerfile for React frontend
│   ├── package.json          # Frontend dependencies
│   └── src/                  # React source files
├── flask_postgres_app/       # Flask backend
│   ├── Dockerfile            # Dockerfile for Flask backend
│   ├── requirements.txt      # Backend dependencies
│   ├── app.py                # Main Flask application
│   ├── models.py             # Database models with SQLAlchemy
│   └── migrations/           # Migration folder managed by Flask-Migrate
├── docker-compose.yml        # Docker Compose file to orchestrate containers
└── README.md                 # Project documentation
```

## Getting Started

### 1. Clone the Repository
```bash
git clone git@bitbucket.org:estimate-ae-prod/estimate.git
cd estimate
```

### 2. Set Up Environment Variables
Update the environment variables in `docker-compose.yml` as needed:

```yaml
services:
  web:
    environment:
      - FLASK_ENV=development
      - FLASK_APP=app.py
      - POSTGRES_DB=estimatedb
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - DATABASE_URL=postgresql://postgres:password@db:5432/estimatedb
  db:
    environment:
      - POSTGRES_DB=estimatedb
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
```

### 3. Build and Start Containers
Build and start all services using Docker Compose:
```bash
docker-compose up --build -d
```
This command does the following:
- Builds the images for the Flask and React applications.
- Starts the PostgreSQL database and sets up the network.

### 4. Initialize the Database with Flask-Migrate
To set up the database tables, run migrations for the Flask backend:

**Create Migration Repository (First Time Only)**
```bash
docker-compose exec web flask db init
```

**Create and Apply Migrations**
```bash
docker-compose exec web flask db migrate -m "Initial migration."
docker-compose exec web flask db upgrade
```
The tables defined in your models should now be created in PostgreSQL.

### 5. Access the Application
- **React Frontend**: [http://localhost:3000](http://localhost:3000)
- **Flask Backend (API)**: [http://localhost:5000](http://localhost:5000)
- **PostgreSQL Database**: Port 5432 on your machine

### 6. Managing Dependencies

#### Adding New Python Packages (Backend)
- Add the package to `requirements.txt`.
- Rebuild the backend container:
```bash
docker-compose build web
docker-compose up -d
```

#### Adding New Node Packages (Frontend)
- Update `client/package.json` with the new package.
- Rebuild the frontend container:
```bash
docker-compose build client
docker-compose up -d
```

Alternatively, you can enter the client container:
```bash
docker-compose exec client sh
```
Then run `npm install <package-name>` directly, which will reflect in your local `package.json` file.

### 7. Common Commands  
In the `client/package.json` file, you can find scripts to manage Docker more conveniently:

```json
"scripts": {
  "docker:build": "docker-compose build",
  "docker:up": "docker-compose up",
  "docker:down": "docker-compose down",
  "docker:restart": "docker-compose restart",
  "docker:ui-build": "docker-compose build client",
  "start-docker": "docker-compose exec client npm start"
}
```
To use these commands, run them inside the `client` folder.

### 8. Updating Models and Database

When modifying database models in `models.py`:

**Create a New Migration:**
```bash
docker-compose exec web flask db migrate -m "Your migration message"
```

**Apply the Migration:**
```bash
docker-compose exec web flask db upgrade
```
This keeps your database structure in sync with your model definitions.

### 9. Troubleshooting
- **Port Conflicts**: Ensure that ports 5000, 3000, and 5432 are not used by other services.
- **Database Connection Issues**: Verify that `DATABASE_URL` is correctly set in `docker-compose.yml`.
- **Frontend Not Reflecting Changes**: Use `docker-compose down` to stop containers, then rebuild with `docker-compose up --build`.

### 10. Stopping the Project
To stop and remove all running containers, networks, and volumes:
```bash
docker-compose down
```
This will retain data in PostgreSQL. To delete all volumes (including database data), add `-v`: 
```bash
docker-compose down -v
```

### 11. Notes
- **Development**: For development, mount your local client directory into the Docker container to see code changes immediately.
- **Production**: For production, consider using `npm run build` for React to optimize assets, and serve them using a static file server.
