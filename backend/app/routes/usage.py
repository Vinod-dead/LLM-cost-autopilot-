from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.db.models import UsageLog

router = APIRouter(prefix="/usage", tags=["Usage"])


class UsageRequest(BaseModel):
    model: str
    provider: str
    input_tokens: int
    output_tokens: int
    cost: float
    latency_ms: float | None = None


@router.post("")
def create_usage(
    request: UsageRequest,
    db: Session = Depends(get_db),
):
    usage = UsageLog(
        model=request.model,
        provider=request.provider,
        input_tokens=request.input_tokens,
        output_tokens=request.output_tokens,
        cost=request.cost,
        latency_ms=request.latency_ms,
    )

    db.add(usage)
    db.commit()
    db.refresh(usage)

    return {
        "message": "Usage recorded successfully",
        "usage_id": usage.id,
    }
@router.get("")
def get_usage(
    db: Session = Depends(get_db),
):
    usage_records = (
        db.query(UsageLog)
        .order_by(UsageLog.created_at.desc())
        .all()
    )

    return [
        {
            "id": usage.id,
            "model": usage.model,
            "provider": usage.provider,
            "input_tokens": usage.input_tokens,
            "output_tokens": usage.output_tokens,
            "cost": usage.cost,
            "latency_ms": usage.latency_ms,
            "created_at": usage.created_at,
        }
        for usage in usage_records
    ]
@router.get("/stats")
def get_usage_stats(
    db: Session = Depends(get_db),
):
    usage_records = db.query(UsageLog).all()

    total_requests = len(usage_records)
    total_cost = sum(record.cost for record in usage_records)
    total_input_tokens = sum(
        record.input_tokens for record in usage_records
    )
    total_output_tokens = sum(
        record.output_tokens for record in usage_records
    )

    return {
        "total_requests": total_requests,
        "total_cost": round(total_cost, 8),
        "total_input_tokens": total_input_tokens,
        "total_output_tokens": total_output_tokens,
    }