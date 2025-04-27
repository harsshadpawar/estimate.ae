# app/utils/auth_utils.py
import bcrypt

def hash_password(password: str) -> bytes:
    """
    Hash a password using bcrypt
    
    Args:
        password: Plain text password
        
    Returns:
        bytes: Hashed password
    """
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Previously hashed password
        
    Returns:
        bool: True if password matches, False otherwise
    """
    return bcrypt.checkpw(
        plain_password.encode('utf-8'), 
        hashed_password.encode('utf-8')
    )