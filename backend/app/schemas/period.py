from pydantic import BaseModel, Field, field_validator, model_validator
from datetime import datetime
from calendar import monthrange
from typing import Optional


class PeriodSchema(BaseModel):
    """Schema for a single contribution period"""

    start_date: str = Field(..., description="Start month in MM/YYYY format (e.g., 01/2021)")
    end_date: str = Field(..., description="End month in MM/YYYY format (e.g., 12/2021)")
    monthly_salary: float = Field(..., gt=0, description="Monthly salary amount")

    @field_validator('start_date', 'end_date')
    @classmethod
    def validate_and_convert_date_format(cls, v: str) -> str:
        """
        Validate and convert date format from MM/YYYY to YYYY-MM-DD
        Accepts: MM/YYYY (e.g., 01/2021)
        Converts to: YYYY-MM-DD for internal use
        """
        # Try MM/YYYY format first
        try:
            date_obj = datetime.strptime(v, '%m/%Y')
            # Convert to YYYY-MM-DD format
            # For start date: use day 1
            # For end date: use last day of month (will be handled in model_validator)
            return date_obj.strftime('%Y-%m-01')
        except ValueError:
            pass

        # Also accept YYYY-MM-DD format for backward compatibility
        try:
            datetime.strptime(v, '%Y-%m-%d')
            return v
        except ValueError:
            raise ValueError('Date must be in MM/YYYY format (e.g., 01/2021) or YYYY-MM-DD format')

    @model_validator(mode='after')
    def adjust_end_date_to_last_day(self):
        """Adjust end_date to be the last day of the month"""
        # Parse the end_date
        end_date_obj = datetime.strptime(self.end_date, '%Y-%m-%d')

        # Get the last day of the month
        year = end_date_obj.year
        month = end_date_obj.month
        last_day = monthrange(year, month)[1]

        # Update end_date to last day of month
        self.end_date = f"{year:04d}-{month:02d}-{last_day:02d}"

        return self

    @field_validator('monthly_salary')
    @classmethod
    def validate_salary(cls, v: float) -> float:
        """Validate salary is positive"""
        if v <= 0:
            raise ValueError('Monthly salary must be positive')
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "start_date": "01/2021",
                "end_date": "12/2021",
                "monthly_salary": 5000000
            }
        }
