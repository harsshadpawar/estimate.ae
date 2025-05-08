
# Order is Important for DB creation

# app.py or main.py

# from  app.models import user_model, company_model 
# from app.models import product_model
# from app.models import plan_limit_model
# from app.models import subscription_model
# from app.models import api_usage_model
# from app.models import country_model
# from app.models import subscription_plan_model
# from app.models import country_subscription_model
# app/models/__init__.py

from app.models.role_model import Role
from app.models.country_model import Country
from app.models.subscription_plan_model import SubscriptionPlan
from app.models.country_subscription_model import CountrySubscriptionPlan
from app.models.user_model import User
from app.models.company_model import Company
from app.models.product_model import Product
from app.models.plan_limit_model import PlanLimit
from app.models.subscription_model import Subscription
from app.models.api_usage_model import ApiUsage
from app.models.opt_model import OTP
from app.models.user_model import TokenBlacklist
