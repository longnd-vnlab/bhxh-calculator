from sqlalchemy.orm import Session
from typing import List, Optional
from app.models.coefficient import Coefficient
from datetime import datetime


class CoefficientService:
    """Service for managing coefficient data"""

    def __init__(self, db: Session):
        self.db = db

    def get_all_active(self) -> List[Coefficient]:
        """Get all active coefficients"""
        return self.db.query(Coefficient).filter(
            Coefficient.is_active == True
        ).order_by(Coefficient.year.desc()).all()

    def get_by_year(self, year: int) -> Optional[Coefficient]:
        """Get coefficient for a specific year"""
        return self.db.query(Coefficient).filter(
            Coefficient.year == year,
            Coefficient.is_active == True
        ).first()

    def get_by_year_range(self, start_year: int, end_year: int) -> List[Coefficient]:
        """Get coefficients for a year range"""
        return self.db.query(Coefficient).filter(
            Coefficient.year >= start_year,
            Coefficient.year <= end_year,
            Coefficient.is_active == True
        ).order_by(Coefficient.year.desc()).all()

    def create(self, year: int, coefficient: float, month: int = 1) -> Coefficient:
        """Create a new coefficient"""
        effective_from = datetime(year, 1, 1)
        effective_to = datetime(year, 12, 31, 23, 59, 59)

        db_coefficient = Coefficient(
            year=year,
            month=month,
            coefficient=coefficient,
            effective_from=effective_from,
            effective_to=effective_to,
            is_active=True
        )

        self.db.add(db_coefficient)
        self.db.commit()
        self.db.refresh(db_coefficient)

        return db_coefficient

    def bulk_create(self, coefficients_data: List[dict]) -> List[Coefficient]:
        """Bulk create coefficients"""
        db_coefficients = []

        for data in coefficients_data:
            year = data['year']
            coefficient = data['coefficient']

            effective_from = datetime(year, 1, 1)
            effective_to = datetime(year, 12, 31, 23, 59, 59)

            db_coeff = Coefficient(
                year=year,
                month=data.get('month', 1),
                coefficient=coefficient,
                effective_from=effective_from,
                effective_to=effective_to,
                is_active=True
            )
            db_coefficients.append(db_coeff)

        self.db.add_all(db_coefficients)
        self.db.commit()

        return db_coefficients
