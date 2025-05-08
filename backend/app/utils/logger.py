# import logging
# import uuid
# from app.database.db import get_db
# from sqlalchemy.orm import Session

# class DatabaseHandler(logging.Handler):
#     def __init__(self, db: Session):
#         super().__init__()
#         self.db = db

#     def emit(self, record):
#         try:
#             log_entry = Log(
#                 unique_id=str(uuid.uuid4()),  # Create a unique ID for the log entry
#                 level=record.levelname,
#                 message=self.format(record),
#             )
#             self.db.add(log_entry)
#             self.db.commit()
#         except Exception as e:
#             print(f"Error storing log in DB: {e}")
#             self.db.rollback()

# def setup_logger(db: Session):
#     logger = logging.getLogger("app")
#     logger.setLevel(logging.INFO)  # You can adjust the log level here

#     # Create a custom log formatter with the desired format
#     formatter = logging.Formatter('%(asctime)s [%(levelname)s] - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')

#     # Create and add the custom database handler to the logger
#     db_handler = DatabaseHandler(db)
#     db_handler.setFormatter(formatter)
#     logger.addHandler(db_handler)
    
#     return logger

# logger = setup_logger(get_db)