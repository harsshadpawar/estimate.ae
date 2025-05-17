from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
import os
from dotenv import load_dotenv


ENVIRONMENT = os.getenv("ENV", "dev")
env_file_path = f".env.{ENVIRONMENT}"  
default_env_file = ".env"

# Load environment file: prefer specific, fallback to default
if os.path.exists(env_file_path):
    load_dotenv(env_file_path)
else:
    load_dotenv(default_env_file)

class Settings(BaseSettings):
    APP_NAME: str
    environment: str = ENVIRONMENT
    debug: bool = True
    
    #API KEY
    X_API_KEY: str

    # JWT Settings
    JWT_SECRET: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    REFRESH_TOKEN_EXPIRE_DAYS: int
    
    #Email 
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    
    # Company 
    COMPANY_NAME: str 
    COMPANY_LOGO_URL: str

    # Database Settings
    DATABASE_URL: str
   
    # Elasticsearch 
    ELASTIC_URL: str
    ELASTIC_USER: str
    ELASTIC_PASSWORD: str
    ENABLE_ELASTIC_LOGGING: str

    # Configuration
    model_config = SettingsConfigDict(env_file=env_file_path, env_file_encoding="utf-8")

@lru_cache()
def get_settings() -> Settings:
    return Settings()
