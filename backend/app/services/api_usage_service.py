from sqlalchemy.orm import Session
from app.models.api_usage_model import ApiUsage, ApiUsageCreate
from sqlalchemy import text
from typing import List, Any
from sqlalchemy.dialects import postgresql


def log_api_usage(db: Session, usage_data) -> ApiUsage:
    print("usage_dict",usage_data)
    new_log = ApiUsage(**usage_data)
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

def get_all_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ApiUsage).offset(skip).limit(limit).all()


def fetch_users_exceeding_daily_limit(db: Session, user_id: str, api_name: str) -> List[Any]:
    try:
        query = text("""
            SELECT 
                COUNT(*) AS usage_count,
                s.start_date,
                s.end_date,
                sp.name AS plan_name,
                sp.price,
                pl.period,
                a.api_name,
                pl.limit_count,
                s.user_id
            FROM 
                api_usage_logs a
            JOIN 
                subscriptions s ON a.user_id = s.user_id
            JOIN 
                subscription_plans sp ON sp.id = s.subscription_plan_id
            JOIN 
                plan_limits pl ON pl.subscription_plan_id = s.subscription_plan_id AND pl.api_name = a.api_name
            WHERE 
                s.status = 'active'
                AND a.called_at >= CURRENT_DATE
                AND a.called_at < CURRENT_DATE + INTERVAL '1 day'
                AND CURRENT_DATE BETWEEN s.start_date AND s.end_date
                AND pl.period = 'daily'
                AND pl.api_name = a.api_name
                AND s.user_id = :user_id
                AND a.api_name = :api_name
            GROUP BY 
                s.start_date, s.end_date, sp.name, sp.price, pl.period, a.api_name, pl.limit_count, s.user_id
            HAVING 
                COUNT(*) >= pl.limit_count;
        """)
       
        result = db.execute(query, {"user_id": user_id,"api_name":api_name}).fetchall()
        
        compiled = query.compile(
            dialect=postgresql.dialect(),
            compile_kwargs={"literal_binds": True}
        )
        print("Final SQL Query:\n", compiled)

        return result

    except Exception as e:
        print("fetch api",str(e))
        return e
        # logger.error(f"Error fetching exceeded API usage for user_id={user_id}", exc_info=True)
        # return []
