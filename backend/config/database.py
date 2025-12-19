from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from backend.config.settings import settings
import urllib.parse

# Database URL from settings
DATABASE_URL = settings.neon_database_url

# Parse the database URL to add connection parameters
parsed_url = urllib.parse.urlparse(DATABASE_URL)

# Add connection parameters to handle SSL and connection pooling
# For Neon database, we need to ensure proper SSL settings
if parsed_url.scheme.startswith('postgresql'):
    # Add query parameters for connection pooling and SSL handling
    if parsed_url.query:
        DATABASE_URL = f"{DATABASE_URL}&sslmode=require&pool_pre_ping=true&pool_recycle=300"
    else:
        DATABASE_URL = f"{DATABASE_URL}?sslmode=require&pool_pre_ping=true&pool_recycle=300"

# Create engine with connection pooling and SSL settings
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=300,    # Recycle connections every 5 minutes
    pool_size=20,        # Number of connection objects to keep pooled
    max_overflow=30,     # Additional connections beyond pool_size
    echo=False           # Set to True for SQL debugging
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

def get_db():
    """
    Dependency to get database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()