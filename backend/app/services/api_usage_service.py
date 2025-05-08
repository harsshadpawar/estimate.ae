from sqlalchemy.orm import Session
from app.models.api_usage_model import ApiUsage, ApiUsageCreate
from sqlalchemy import text
from typing import List, Any

def log_api_usage(db: Session, usage_data: ApiUsageCreate) -> ApiUsage:
    new_log = ApiUsage(**usage_data.dict())
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

def get_all_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ApiUsage).offset(skip).limit(limit).all()


def fetch_users_exceeding_daily_limit(db: Session, user_id: str) -> List[Any]:
    try:
        query = text("""
            SELECT 
                COUNT(*) AS usage_count,
                s.start_date,
                s.end_date,
                sp.name AS plan_name,
                sp.price,
                pl.period,
                pl.api_name,
                pl.limit_count,
                s.user_id
            FROM 
                api_usage_logs a
            JOIN 
                subscriptions s ON a.user_id = s.user_id
            JOIN 
                subscription_plans sp ON sp.id = s.subscription_plan_id
            JOIN 
                plan_limits pl ON pl.subscription_plan_id = s.subscription_plan_id
            WHERE 
                s.status = 'active'
                AND a.called_at >= CURRENT_DATE
                AND a.called_at < CURRENT_DATE + INTERVAL '1 day'
                AND CURRENT_DATE BETWEEN s.start_date AND s.end_date
                AND pl.period = 'daily'
                AND s.user_id = :user_id
            GROUP BY 
                s.start_date, s.end_date, sp.name, sp.price, pl.period, pl.api_name, pl.limit_count, s.user_id
            HAVING 
                COUNT(*) > pl.limit_count;
        """)

        result = db.execute(query, {"user_id": user_id}).fetchall()
        return result

    except Exception as e:
        # logger.error(f"Error fetching exceeded API usage for user_id={user_id}", exc_info=True)
        return []
