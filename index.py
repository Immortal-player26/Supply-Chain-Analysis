import sys
import os

# Add backend directory to Python path
backend_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend')
sys.path.insert(0, backend_dir)

# On Vercel, use /tmp for SQLite (writable ephemeral storage)
if os.environ.get('VERCEL'):
    os.environ.setdefault('DATABASE_URL', 'sqlite+aiosqlite:////tmp/supply_chain.db')

# Load environment from backend/.env for local dev
from dotenv import load_dotenv
load_dotenv(os.path.join(backend_dir, '.env'))

from main import app
