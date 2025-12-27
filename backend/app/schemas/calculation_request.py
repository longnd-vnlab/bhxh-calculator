from pydantic import BaseModel, Field, model_validator
from typing import List
from datetime import datetime
from app.schemas.period import PeriodSchema


class CalculationRequest(BaseModel):
    """Request schema for BHXH calculation"""

    periods: List[PeriodSchema] = Field(..., min_length=1, description="List of contribution periods")
    calculation_year: str = Field(default="2025", description="Year to use for coefficients")

    @model_validator(mode='after')
    def validate_periods(self):
        """Validate periods don't overlap and dates are valid"""
        periods = self.periods

        # Sort periods by start date
        sorted_periods = sorted(periods, key=lambda p: datetime.strptime(p.start_date, '%Y-%m-%d'))

        # Check for overlaps and validate date ranges
        for i, period in enumerate(sorted_periods):
            start = datetime.strptime(period.start_date, '%Y-%m-%d')
            end = datetime.strptime(period.end_date, '%Y-%m-%d')

            # Check end is after start
            if end <= start:
                raise ValueError(f'Period {i+1}: End date must be after start date')

            # Check for overlap with next period
            if i < len(sorted_periods) - 1:
                next_period = sorted_periods[i + 1]
                next_start = datetime.strptime(next_period.start_date, '%Y-%m-%d')

                if end >= next_start:
                    raise ValueError(f'Periods {i+1} and {i+2} overlap')

        return self

    class Config:
        json_schema_extra = {
            "example": {
                "periods": [
                    {
                        "start_date": "01/2010",
                        "end_date": "12/2013",
                        "monthly_salary": 5000000
                    },
                    {
                        "start_date": "01/2014",
                        "end_date": "12/2023",
                        "monthly_salary": 10000000
                    }
                ],
                "calculation_year": "2025"
            }
        }
