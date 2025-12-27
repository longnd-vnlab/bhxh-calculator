from pydantic import BaseModel, Field
from typing import List
from datetime import datetime


class Step(BaseModel):
    """A step in the calculation explanation"""
    step: int
    description: str
    calculation: str


class FormulaExplanation(BaseModel):
    """Explanation of the calculation formula"""
    formula: str
    steps: List[Step]


class PeriodBreakdown(BaseModel):
    """Breakdown of calculation for a single period"""
    start_date: str
    end_date: str
    months: int
    years: float
    original_salary: float
    coefficient: float
    adjusted_salary: float
    multiplier: float
    amount: float
    is_pre_2014: bool


class CalculationResponse(BaseModel):
    """Response schema for BHXH calculation"""
    total_amount: float = Field(..., description="Total BHXH amount to receive")
    average_salary: float = Field(..., description="Average adjusted monthly salary (Mbqtl)")
    total_months: int = Field(..., description="Total months of contribution")
    period_breakdowns: List[PeriodBreakdown] = Field(..., description="Detailed breakdown per period")
    explanation: FormulaExplanation = Field(..., description="Step-by-step calculation explanation")
    calculated_at: str = Field(default_factory=lambda: datetime.now().isoformat())

    class Config:
        json_schema_extra = {
            "example": {
                "total_amount": 287943812,
                "average_salary": 11074762,
                "total_months": 168,
                "period_breakdowns": [
                    {
                        "start_date": "2010-01-01",
                        "end_date": "2013-12-31",
                        "months": 48,
                        "years": 4.0,
                        "original_salary": 5000000,
                        "coefficient": 1.927,
                        "adjusted_salary": 9635000,
                        "multiplier": 1.5,
                        "amount": 66448572,
                        "is_pre_2014": True
                    }
                ],
                "explanation": {
                    "formula": "Mức hưởng = (1.5 × Mbqtl × Năm trước 2014) + (2.0 × Mbqtl × Năm từ 2014)",
                    "steps": [
                        {
                            "step": 1,
                            "description": "Điều chỉnh lương theo hệ số trượt giá",
                            "calculation": "Giai đoạn 1: 5,000,000 × 1.927 = 9,635,000 VNĐ"
                        }
                    ]
                },
                "calculated_at": "2025-12-25T10:30:00"
            }
        }
