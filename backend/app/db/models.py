from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String

from .database import Base


class UsageLog(Base):
    __tablename__ = "usage_logs"

    id = Column(Integer, primary_key=True, index=True)

    model = Column(String, nullable=False)
    provider = Column(String, nullable=False)

    input_tokens = Column(Integer, default=0)
    output_tokens = Column(Integer, default=0)

    cost = Column(Float, default=0.0)

    latency_ms = Column(Float, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
    )