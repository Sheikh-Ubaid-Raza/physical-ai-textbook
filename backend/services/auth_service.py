from typing import Optional
from sqlalchemy.orm import Session
from models.user import User
import hashlib
import secrets

class AuthService:
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email"""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
        """Get user by ID"""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify password against hash"""
        return hashed_password == hashlib.sha256(plain_password.encode()).hexdigest()

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using SHA256"""
        return hashlib.sha256(password.encode()).hexdigest()

    @staticmethod
    def create_user(
        db: Session,
        email: str,
        password: str,
        name: str,
        software_background: str,
        hardware_background: str,
        learning_goal: Optional[str] = None
    ) -> User:
        """Create a new user with hashed password"""
        hashed_password = AuthService.hash_password(password)

        user = User(
            email=email,
            password_hash=hashed_password,
            name=name,
            software_background=software_background,
            hardware_background=hardware_background,
            learning_goal=learning_goal
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    @staticmethod
    def update_user_profile(
        db: Session,
        user_id: str,
        software_background: Optional[str] = None,
        hardware_background: Optional[str] = None,
        learning_goal: Optional[str] = None
    ) -> Optional[User]:
        """Update user profile information"""
        user = AuthService.get_user_by_id(db, user_id)

        if not user:
            return None

        if software_background:
            user.software_background = software_background
        if hardware_background:
            user.hardware_background = hardware_background
        if learning_goal:
            user.learning_goal = learning_goal

        db.commit()
        db.refresh(user)

        return user