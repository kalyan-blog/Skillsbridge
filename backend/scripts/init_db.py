"""Initialize the SQLite database (create tables + seed data).

Usage:
    cd backend
    python scripts/init_db.py
"""
import os
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.database import init_db, SessionLocal
from app.utils import initialize_database


def main():
    print("Initializing database...")
    init_db()
    print("✓ Tables created (or already exist)")

    db = SessionLocal()
    try:
        initialize_database(db)
    finally:
        db.close()

    print("✓ Database ready at backend/data/skillbridge.db")


if __name__ == "__main__":
    main()
