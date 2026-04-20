import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

# Use /tmp for SQLite on Vercel serverless (ephemeral but writable)
if os.environ.get('VERCEL'):
    _default_url = 'sqlite+aiosqlite:////tmp/supply_chain.db'
else:
    _default_url = 'sqlite+aiosqlite:///./supply_chain.db'

DATABASE_URL = os.getenv("DATABASE_URL", _default_url)

engine = create_async_engine(DATABASE_URL, echo=False)
async_session = async_sessionmaker(engine, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncSession:
    async with async_session() as session:
        yield session


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
