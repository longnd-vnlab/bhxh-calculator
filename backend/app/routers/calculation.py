from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.calculation_request import CalculationRequest
from app.schemas.calculation_response import CalculationResponse
from app.services.calculation_engine import CalculationEngine
from app.services.coefficient_service import CoefficientService
from app.database import get_db
import logging

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/calculate", response_model=CalculationResponse)
async def calculate_bhxh(
    request: CalculationRequest,
    db: Session = Depends(get_db)
):
    """
    Calculate BHXH one-time payment amount.

    Formula:
    - Mức hưởng = (1.5 × Mbqtl × Years_Pre2014) + (2.0 × Mbqtl × Years_From2014)
    - Mbqtl = Average adjusted monthly salary
    """
    try:
        logger.info(f"Calculation requested with {len(request.periods)} periods")

        # Get coefficients
        coeff_service = CoefficientService(db)
        coefficients = coeff_service.get_all_active()

        if not coefficients:
            raise HTTPException(
                status_code=400,
                detail="No active coefficients found. Please contact administrator."
            )

        # Calculate
        engine = CalculationEngine()
        result = engine.calculate(request.periods, coefficients)

        logger.info(f"Calculation successful: {result.total_amount}")

        return result

    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        logger.error(f"Calculation failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")
