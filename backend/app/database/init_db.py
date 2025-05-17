from sqlalchemy.orm import Session
from app.models.role_model import Role
import uuid
from app.models.plan_limit_model import PlanLimit
from app.models.country_model import Country       
from app.models.subscription_plan_model import SubscriptionPlan, PlanName  
from app.models.country_subscription_model import CountrySubscriptionPlan
from sqlalchemy import text

from app.database.db import Base,engine


def init_db():
    print("Tables being registered:", Base.metadata.tables.keys())
    Base.metadata.create_all(bind=engine)



DEFAULT_ROLES = [
    {"id": str(uuid.uuid4()), "name": "user", "description": "Default user role"},
    {"id": str(uuid.uuid4()), "name": "editor", "description": "Content editor role"},
    {"id": str(uuid.uuid4()), "name": "admin", "description": "Administrator role"},
    {"id": str(uuid.uuid4()), "name": "super-admin", "description": "Super Administrator role"},
]



def seed_countries(db: Session):
    existing_codes = {
        country.code for country in db.query(Country.code).all()
    }

    countries_to_seed = [
        {
            "code": "US",
            "name": "United States",
            "iso3_code": "USA",
            "currency_code": "USD",
            "currency_symbol": "$",
            "phone_code": "+1",
            "continent": "North America",
            "timezone": "America/New_York",
            "language_code": "en"
        },
        {
            "code": "IN",
            "name": "India",
            "iso3_code": "IND",
            "currency_code": "INR",
            "currency_symbol": "₹",
            "phone_code": "+91",
            "continent": "Asia",
            "timezone": "Asia/Kolkata",
            "language_code": "hi"
        },
        {
            "code": "AE",
            "name": "United Arab Emirates",
            "iso3_code": "ARE",
            "currency_code": "AED",
            "currency_symbol": "د.إ",
            "phone_code": "+971",
            "continent": "Asia",
            "timezone": "Asia/Dubai",
            "language_code": "ar"
        },
        {
            "code": "DE",
            "name": "Germany",
            "iso3_code": "DEU",
            "currency_code": "EUR",
            "currency_symbol": "€",
            "phone_code": "+49",
            "continent": "Europe",
            "timezone": "Europe/Berlin",
            "language_code": "de"
        },
        {
            "code": "JP",
            "name": "Japan",
            "iso3_code": "JPN",
            "currency_code": "JPY",
            "currency_symbol": "¥",
            "phone_code": "+81",
            "continent": "Asia",
            "timezone": "Asia/Tokyo",
            "language_code": "ja"
        },
    ]

    new_countries = [
        Country(**data)
        for data in countries_to_seed
        if data["code"] not in existing_codes
    ]

    if not new_countries:
        return "All countries already seeded."

    db.add_all(new_countries)
    db.commit()

    return f"{len(new_countries)} country(ies) seeded successfully."



def seed_products(db: Session):
    sql = """
    INSERT INTO products (name, description, is_active, created_by, updated_by, created_at, updated_at)
    SELECT :name, :description, true, 'system', 'system', now(), now()
    WHERE NOT EXISTS (
        SELECT 1 FROM products WHERE name = :name
    );
    """

    db.execute(text(sql), {"name": "CNC Machine", "description": "CNC Machine description"})
    db.execute(text(sql), {"name": "VMC Machine", "description": "VMC Machine description"})
    db.commit()

def seed_roles(db: Session):
    for role_data in DEFAULT_ROLES:
        role = db.query(Role).filter_by(name=role_data["name"]).first()
        if not role:
            db.add(Role(**role_data))
    db.commit()

def seed_subscription_plans(db: Session):
    existing_names = {
        plan.name for plan in db.query(SubscriptionPlan.name).all()
    }

    required_names = {PlanName.free, PlanName.premium, PlanName.enterprise}

    if required_names.issubset(existing_names):
        return "All plans already seeded."

    plans_to_add = []

    if PlanName.free not in existing_names:
        plans_to_add.append(SubscriptionPlan(
            name=PlanName.free,
            price=0.00,
            features="Basic access with limited API usage"
        ))

    if PlanName.premium not in existing_names:
        plans_to_add.append(SubscriptionPlan(
            name=PlanName.premium,
            price=49.99,
            features="Access to premium APIs and increased limits"
        ))

    if PlanName.enterprise not in existing_names:
        plans_to_add.append(SubscriptionPlan(
            name=PlanName.enterprise,
            price=199.99,
            features="Full API access, priority support, custom SLAs"
        ))

    db.add_all(plans_to_add)
    db.commit()

    return f"{len(plans_to_add)} plan(s) seeded successfully."




def seed_plan_limits(db: Session):
    # Fetch all subscription plans using raw SQL with text()
    result = db.execute(text("SELECT id, name FROM subscription_plans"))
    plans = result.fetchall()

    if not plans:
        return "No subscription plans found. Seed those first."

    existing_limits = db.execute(text("SELECT COUNT(*) FROM plan_limits")).scalar()
    if existing_limits > 0:
        return "Plan limits already seeded."


    # Map plan name to id
    plan_ids = {plan[1].lower(): plan[0] for plan in plans}

    # Define limits using raw SQL INSERT statements
    limits = [
        ("dfm_analysis", "daily", plan_ids.get("free"), 3),
        ("cnc_analysis", "daily", plan_ids.get("free"), 5),
        ("download_report", "monthly", plan_ids.get("free"), 10),
    ]

    # Filter out any limits with None (in case plan was missing)
    limits = [limit for limit in limits if limit[2] is not None]

    # Execute raw SQL insert for each limit
    for limit in limits:
        db.execute(
            text("""
                INSERT INTO plan_limits (subscription_plan_id, period, api_name, limit_count)
                VALUES (:subscription_plan_id, :period, :api_name, :limit_count)
            """),
            {
                "subscription_plan_id": limit[2],
                "period": limit[1],
                "api_name": limit[0],
                "limit_count": limit[3],
            },
        )

    db.commit()
    return f"{len(limits)} plan limits seeded successfully."


def seed_country_subscription_plans(db: Session):
    
    plan_result = db.execute(text("""
        SELECT name, id FROM subscription_plans
        WHERE name IN (:free, :premium, :enterprise)
    """), {
        'free': PlanName.free.value,        
        'premium': PlanName.premium.value,  
        'enterprise': PlanName.enterprise.value  
    }).fetchall()

    plan_map = {row.name: row.id for row in plan_result}
    if not plan_map:
        return "No subscription plans found to seed country pricing."

    pricing_matrix = {
        "US": {
            "Free": (0.00, "Basic access with limited API usage"),
            "Premium": (49.99, "Premium access with more API limits and features"),
            "Enterprise": (199.99, "Enterprise SLA, support, and full access")
        },
        "IN": {
            "Free": (0.00, "Basic access with limited API usage"),
            "Premium": (29.99, "Premium access for Indian users"),
            "Enterprise": (149.99, "Enterprise support and full access in India")
        },
        "AE": {
            "Free": (0.00, "Basic access with limited API usage"),
            "Premium": (45.99, "Premium access for UAE users"),
            "Enterprise": (179.99, "Enterprise support and full access in UAE")
        },
        "DE": {
            "Free": (0.00, "Basic access with limited API usage"),
            "Premium": (55.99, "Premium access for German users"),
            "Enterprise": (210.00, "Full API access and enterprise features in Germany")
        }
    }

    
    existing_entries = db.execute(text("""
        SELECT subscription_plan_id, country_code FROM country_subscription_plans
    """)).fetchall()
    existing_set = set((row.subscription_plan_id, row.country_code) for row in existing_entries)

    
    inserts = []
    for country_code, plans in pricing_matrix.items():
        for plan_name, (price, features) in plans.items():
            plan_id = plan_map.get(plan_name)
            if not plan_id or (plan_id, country_code) in existing_set:
                continue

            inserts.append({
                "subscription_plan_id": plan_id,
                "country_code": country_code,
                "price": price,
                "features": features
            })

    
    if inserts:
        db.execute(
            text("""
                INSERT INTO country_subscription_plans (subscription_plan_id, country_code, price, features)
                VALUES (:subscription_plan_id, :country_code, :price, :features)
            """),
            inserts
        )
        db.commit()
        return f"{len(inserts)} country subscription plan(s) seeded successfully."
    else:
        return "All country-specific subscription plans are already seeded."
