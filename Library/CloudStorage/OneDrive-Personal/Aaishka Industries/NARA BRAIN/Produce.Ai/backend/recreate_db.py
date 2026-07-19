import asyncio
from app.db.session import engine, Base
import app.models

async def recreate():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("All tables dropped and recreated.")

asyncio.run(recreate())
