from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.schemas.coefficient import CoefficientSchema
from app.services.coefficient_service import CoefficientService
from app.database import get_db

router = APIRouter()


@router.get("/coefficients", response_model=List[CoefficientSchema])
async def get_coefficients(db: Session = Depends(get_db)):
    """Get all active inflation coefficients"""
    coeff_service = CoefficientService(db)
    coefficients = coeff_service.get_all_active()
    return coefficients


@router.get("/coefficients/{year}", response_model=CoefficientSchema)
async def get_coefficient_by_year(
    year: int,
    db: Session = Depends(get_db)
):
    """Get coefficient for a specific year"""
    coeff_service = CoefficientService(db)
    coefficient = coeff_service.get_by_year(year)

    if not coefficient:
        raise HTTPException(
            status_code=404,
            detail=f"No coefficient found for year {year}"
        )

    return coefficient


@router.get("/coefficients/range", response_model=List[CoefficientSchema])
async def get_coefficients_by_range(
    start_year: int = Query(..., description="Start year"),
    end_year: int = Query(..., description="End year"),
    db: Session = Depends(get_db)
):
    """Get coefficients for a year range"""
    if start_year > end_year:
        raise HTTPException(
            status_code=400,
            detail="Start year must be less than or equal to end year"
        )

    coeff_service = CoefficientService(db)
    coefficients = coeff_service.get_by_year_range(start_year, end_year)

    return coefficients
