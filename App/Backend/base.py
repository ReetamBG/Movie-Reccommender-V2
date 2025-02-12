from sqlalchemy.orm import declarative_base

# Base for sqlalchemy models (imported in models.py)
Base = declarative_base()


# keeping it in database.py was giving circular import error in models.py find the reason 
# and know about circular import error and partial dependency error