from pydantic import BaseModel, Field
from datetime import datetime


class CoefficientSchema(BaseModel):
    """Schema for coefficient data"""
    id: int
    year: int
    month: int
    coefficient: float
    effective_from: datetime
    effective_to: datetime
    is_active: bool

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "year": 2024,
                "month": 1,
                "coefficient": 1.00,
                "effective_from": "2024-01-01T00:00:00",
                "effective_to": "2024-12-31T23:59:59",
                "is_active": True
            }
        }
