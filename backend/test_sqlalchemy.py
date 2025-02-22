from sqlalchemy import create_engine, text

engine = create_engine("sqlite:///:memory:")

with engine.connect() as conn:
    result = conn.execute(text("select 'hello world'"))
    print(result.scalar())