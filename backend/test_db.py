import os
from dotenv import load_dotenv
import psycopg2

# Force reload the .env file
load_dotenv(override=True)

# Try with explicit connection parameters
db_url = os.getenv('DATABASE_URL')
print(f"Attempting connection to: {db_url}")

try:
    # Add keepalives to help with network issues
    conn = psycopg2.connect(
        db_url,
        connect_timeout=10,
        keepalives=1,
        keepalives_idle=30,
        keepalives_interval=10,
        keepalives_count=5
    )
    print("✅ Database connection successful!")
    cursor = conn.cursor()
    cursor.execute("SELECT version();")
    version = cursor.fetchone()
    print(f"PostgreSQL version: {version[0]}")
    conn.close()
except Exception as e:
    print(f"❌ Connection failed: {e}")
    import traceback
    traceback.print_exc()