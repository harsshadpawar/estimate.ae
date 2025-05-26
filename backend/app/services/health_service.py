
from psycopg2 import connect, OperationalError
from app.config.settings import Settings
settings = Settings()


class HealthCheckService:
    @staticmethod
    def check_database():
        try:
            connection = connect(settings.DATABASE_URL)
            connection.close()
            return True
        except OperationalError:
            return False

    @staticmethod
    def health_check():
        # Check if the database is healthy
        db_status = "healthy" if HealthCheckService.check_database() else "unhealthy"
        return {
            "status": "OK",
            "database": db_status,
            "message": "Application is healthy"
        }
