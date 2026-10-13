from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.models import Notification

router = APIRouter(prefix="/api/v1/notifications", tags=["notifications"])


@router.get("/{farmer_id}")
def list_notifications(farmer_id: int, db: Session = Depends(get_db)):
    rows = (
        db.query(Notification)
        .filter(Notification.farmer_id == farmer_id)
        .order_by(Notification.created_at.desc())
        .all()
    )
    return [
        {"id": n.id, "type": n.type, "message": n.message, "is_read": n.is_read, "created_at": n.created_at}
        for n in rows
    ]


@router.patch("/{notification_id}/read")
def mark_read(notification_id: int, db: Session = Depends(get_db)):
    n = db.query(Notification).filter(Notification.id == notification_id).first()
    if n:
        n.is_read = True
        db.commit()
    return {"status": "ok"}
