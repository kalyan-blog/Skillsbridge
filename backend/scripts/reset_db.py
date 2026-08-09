"""RESET the database - DEVELOPMENT ONLY.

This deletes the SQLite file and re-creates it with fresh seed data.
All user data will be LOST. Do not run this in production.

Usage:
    cd backend
    python scripts/reset_db.py
"""
import os
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.database import init_db, SessionLocal, engine
from app.utils import initialize_database


def main():
    print("⚠️  WARNING: This will DELETE the entire database (development only).")
    confirm = input("Type 'yes' to continue: ")
    if confirm.strip().lower() != "yes":
        print("Aborted.")
        return

    db_path = os.path.join(os.path.dirname(__file__), "..", "data", "skillbridge.db")
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"✓ Deleted {db_path}")

    print("Re-creating database...")
    init_db()

    db = SessionLocal()
    try:
        initialize_database(db)
    finally:
        db.close()

    print("✓ Database reset complete")


if __name__ == "__main__":
    main()
