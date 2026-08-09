"""Seed the database with career roles, skills and demo data.

This is safe to re-run - it skips data that already exists.

Usage:
    cd backend
    python scripts/seed_db.py
"""
import os
import sys

try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.database import SessionLocal
from app.utils import initialize_database


def main():
    db = SessionLocal()
    try:
        initialize_database(db)
        print("✓ Seed data complete")
    finally:
        db.close()


if __name__ == "__main__":
    main()
