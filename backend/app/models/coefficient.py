from sqlalchemy import Column, Integer, Float, Boolean, DateTime, String
from sqlalchemy.sql import func
from app.database import Base


class Coefficient(Base):
    """Coefficient model for inflation adjustments"""

    __tablename__ = "coefficient"

    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer, nullable=False, index=True)
    month = Column(Integer, nullable=False, default=1)
    coefficient = Column(Float, nullable=False)
    effective_from = Column(DateTime, nullable=False)
    effective_to = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True, index=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<Coefficient(year={self.year}, coefficient={self.coefficient})>"
