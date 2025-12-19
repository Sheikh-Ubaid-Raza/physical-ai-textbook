from setuptools import setup, find_packages

setup(
    name="physical-ai-textbook-backend",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.104.1",
        "uvicorn[standard]==0.24.0",
        "qdrant-client==1.9.1",
        "sqlalchemy==2.0.23",
        "openai>=1.66.5",
        "openai-agents==0.0.5",
        "google-generativeai==0.4.0",
        "pydantic>=2.10",
        "pydantic-settings==2.1.0",
        "python-dotenv==1.0.0",
        "pytest==7.4.3",
        "slowapi==0.1.9",
    ],
    python_requires=">=3.11",
)