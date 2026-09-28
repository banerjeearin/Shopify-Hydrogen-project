"""NARA AI Digital Office — Agent and Department Registry.
Preloads all canonical agents across 8 departments as specified in TAD v2.0 and BRD v2.1.
"""

from typing import Dict, List, Optional
from packages.contracts.enums import DepartmentId, AgentStatus, ModelPolicy
from packages.contracts.models import Agent, Department, AgentLimits
from .definition import AgentDefinition


DEFAULT_DEPARTMENTS: List[Department] = [
    Department(
        id=DepartmentId.EXECUTIVE,
        name="Executive & Strategy",
        description="Cross-departmental orchestration, business KPIs, and strategic alignment.",
        lead_agent_id="ceo_orchestrator",
        color="#8b5cf6",
    ),
    Department(
        id=DepartmentId.MARKETING,
        name="Marketing & Growth",
        description="Meta/Amazon advertising, customer acquisition, ROAS optimization, and cohort analytics.",
        lead_agent_id="campaign_manager",
        color="#ec4899",
    ),
    Department(
        id=DepartmentId.TREND_DESIGN,
        name="Trend & 3D Design",
        description="Fabric library management, trend forecasting, and 3D digital garment workflows.",
        lead_agent_id="trend_analyst",
        color="#06b6d4",
    ),
    Department(
        id=DepartmentId.SALES_ECOMMERCE,
        name="Sales & E-Commerce",
        description="Shopify storefront management, merchandising, promotions, and conversion rate optimization.",
        lead_agent_id="merchandiser",
        color="#3b82f6",
    ),
    Department(
        id=DepartmentId.PRODUCT_INVENTORY,
        name="Product & Inventory",
        description="Variant-level stock monitoring, replenishment triggers, and stockout mitigation.",
        lead_agent_id="inventory_monitor",
        color="#f97316",
    ),
    Department(
        id=DepartmentId.SUPPLY_CHAIN,
        name="Supply Chain & Production",
        description="Vendor management, quality scoring, manufacturing hubs, and purchase orders.",
        lead_agent_id="vendor_manager",
        color="#10b981",
    ),
    Department(
        id=DepartmentId.CUSTOMER_SUPPORT,
        name="Customer Experience",
        description="Query resolution, automated returns, recovery of abandoned carts, and feedback analytics.",
        lead_agent_id="query_resolver",
        color="#14b8a6",
    ),
    Department(
        id=DepartmentId.FINANCE_ACCOUNTING,
        name="Finance & Accounting",
        description="Invoice validation, bank reconciliations, GL mapping, and budget tracking.",
        lead_agent_id="financial_analyst",
        color="#a855f7",
    ),
]


DEFAULT_AGENT_DEFINITIONS: List[AgentDefinition] = [
    # 1. Executive
    AgentDefinition(
        id="ceo_orchestrator",
        name="CEO Orchestrator",
        department=DepartmentId.EXECUTIVE,
        purpose="Orchestrate cross-departmental workflows, monitor corporate KPIs, and assign high-level tasks.",
        role="Chief Executive Officer",
        model_policy=ModelPolicy.DEEP_REASONING,
        capabilities=["workflow_orchestration", "kpi_monitoring", "strategic_delegation"],
        tools=["workflow.create_run", "narawear_mcp.query", "alerts.create", "approval.request"],
        knowledge_sources=["company_strategy_sop", "operational_guidelines"],
        data_sources=[
            "monthly_plans",
            "meta_campaigns",
            "amazon_campaigns",
            "products",
            "supply_hubs",
            "performance_metrics",
        ],
        limits=AgentLimits(max_run_seconds=300, max_tool_calls=30, max_delegation_depth=3),
    ),
    # 2. Marketing
    AgentDefinition(
        id="campaign_manager",
        name="Campaign Manager",
        department=DepartmentId.MARKETING,
        purpose="Manage Meta and Amazon ad campaigns, optimize ROAS, and evaluate daily spend targets.",
        role="Marketing Lead",
        model_policy=ModelPolicy.BALANCED_REASONING,
        capabilities=["ad_budget_optimization", "roas_monitoring", "campaign_planning"],
        tools=["meta_ads.read", "meta_ads.write", "amazon_ads.read", "narawear_mcp.query", "alerts.trigger"],
        knowledge_sources=["paid_media_sop", "creative_guidelines"],
        data_sources=[
            "meta_campaigns",
            "amazon_campaigns",
            "state_performance",
            "monthly_plans",
            "tracking_events",
        ],
        approval_policy={"publish_campaign": "required"},
    ),
    AgentDefinition(
        id="audience_analyst",
        name="Audience Analyst",
        department=DepartmentId.MARKETING,
        purpose="Analyze customer cohorts, RFM segments, and behavioural traffic patterns.",
        role="Audience Intelligence Specialist",
        model_policy=ModelPolicy.BALANCED_REASONING,
        capabilities=["rfm_analysis", "cohort_retention", "funnel_analysis"],
        tools=["narawear_mcp.query", "narawear.insight_cache_write"],
        knowledge_sources=["segmentation_rules"],
        data_sources=[
            "customer_profiles",
            "customer_rfm",
            "cohort_retention",
            "sessions",
            "events",
        ],
    ),
    AgentDefinition(
        id="content_strategist",
        name="Content Strategist",
        department=DepartmentId.MARKETING,
        purpose="Develop content angles, gamification campaigns, and social ad copy.",
        role="Content Strategist",
        model_policy=ModelPolicy.BALANCED_REASONING,
        capabilities=["creative_copy", "gamification_analysis"],
        tools=["narawear_mcp.query"],
        data_sources=["meta_campaigns", "spinning_wheel_data", "products"],
    ),
    # 3. Trend & 3D Design
    AgentDefinition(
        id="trend_analyst",
        name="Trend Analyst",
        department=DepartmentId.TREND_DESIGN,
        purpose="Monitor fashion trends, fabric specifications, and digital product fit.",
        role="Design & Trend Specialist",
        model_policy=ModelPolicy.BALANCED_REASONING,
        capabilities=["trend_forecasting", "fabric_matching"],
        tools=["narawear_mcp.query"],
        data_sources=["fabric_library", "products", "render_jobs"],
    ),
    AgentDefinition(
        id="design_generator",
        name="3D Design Generator",
        department=DepartmentId.TREND_DESIGN,
        purpose="Manage asynchronous 3D rendering jobs and digital garment previews.",
        role="3D Garment Specialist",
        model_policy=ModelPolicy.FAST_LOW_COST,
        capabilities=["render_job_dispatch", "asset_cataloging"],
        tools=["narawear_mcp.query"],
        data_sources=["fabric_library", "render_jobs"],
    ),
    # 4. Sales & E-Commerce
    AgentDefinition(
        id="merchandiser",
        name="Store Merchandiser",
        department=DepartmentId.SALES_ECOMMERCE,
        purpose="Optimize Shopify collection layouts, monitor product detail page interaction, and catalog sorting.",
        role="Merchandising Lead",
        model_policy=ModelPolicy.BALANCED_REASONING,
        capabilities=["catalog_optimization", "conversion_tuning"],
        tools=["shopify.get_products", "narawear_mcp.query"],
        data_sources=["products", "product_variants", "product_events", "sessions"],
    ),
    AgentDefinition(
        id="promotion_optimizer",
        name="Promotion Optimizer",
        department=DepartmentId.SALES_ECOMMERCE,
        purpose="Evaluate flash sales, cart discount effectiveness, and campaign pricing.",
        role="Pricing & Promotion Analyst",
        model_policy=ModelPolicy.BALANCED_REASONING,
        capabilities=["promotion_pricing", "discount_elasticity"],
        tools=["narawear_mcp.query"],
        data_sources=["meta_campaigns", "cart_removals", "sessions", "monthly_plans"],
    ),
    # 5. Product & Inventory
    AgentDefinition(
        id="inventory_monitor",
        name="Inventory Monitor",
        department=DepartmentId.PRODUCT_INVENTORY,
        purpose="Monitor variant-level stockouts, reserve stock for orders, and raise replenishment alerts.",
        role="Inventory Operations Specialist",
        model_policy=ModelPolicy.BALANCED_REASONING,
        capabilities=["variant_stock_audit", "replenishment_trigger"],
        tools=["erpnext.get_stock", "shopify.get_order", "narawear_mcp.query", "alerts.trigger"],
        knowledge_sources=["inventory_sop"],
        data_sources=["products", "product_variants", "product_events"],
        limits=AgentLimits(max_run_seconds=180, max_tool_calls=20, max_mcp_query_rows=5000),
        approval_policy={"create_purchase_order": "required"},
    ),
    AgentDefinition(
        id="replenishment_planner",
        name="Replenishment Planner",
        department=DepartmentId.PRODUCT_INVENTORY,
        purpose="Calculate lead times and economic order quantities across regional supply hubs.",
        role="Demand Planner",
        model_policy=ModelPolicy.BALANCED_REASONING,
        capabilities=["eoq_calculation", "lead_time_estimation"],
        tools=["narawear_mcp.query", "erpnext.get_stock"],
        data_sources=["products", "product_variants", "supply_hubs", "production_vendors"],
    ),
    # 6. Supply Chain
    AgentDefinition(
        id="purchase_planner",
        name="Purchase Planner",
        department=DepartmentId.SUPPLY_CHAIN,
        purpose="Draft purchase orders for raw materials and finished goods based on production blueprints.",
        role="Procurement Specialist",
        model_policy=ModelPolicy.BALANCED_REASONING,
        capabilities=["po_drafting", "vendor_quote_analysis"],
        tools=["erpnext.create_draft_purchase_order", "narawear_mcp.query", "approval.request"],
        data_sources=["supply_hubs", "production_vendors", "performance_metrics"],
        approval_policy={"create_purchase_order": "required"},
    ),
    AgentDefinition(
        id="vendor_manager",
        name="Vendor Manager",
        department=DepartmentId.SUPPLY_CHAIN,
        purpose="Track vendor quality ratings, delivery punctuality, and risk scores.",
        role="Vendor Relations Manager",
        model_policy=ModelPolicy.BALANCED_REASONING,
        capabilities=["vendor_scorecard_eval", "risk_alerting"],
        tools=["narawear_mcp.query", "alerts.trigger"],
        data_sources=["production_vendors", "performance_metrics", "supply_hubs"],
    ),
    AgentDefinition(
        id="logistics_coordinator",
        name="Logistics Coordinator",
        department=DepartmentId.SUPPLY_CHAIN,
        purpose="Coordinate transit between regional warehouses and manufacturing hubs.",
        role="Logistics Officer",
        model_policy=ModelPolicy.FAST_LOW_COST,
        capabilities=["shipment_tracking", "hub_transfer"],
        tools=["narawear_mcp.query"],
        data_sources=["supply_hubs", "production_vendors"],
    ),
    # 7. Customer Support
    AgentDefinition(
        id="query_resolver",
        name="Query Resolver",
        department=DepartmentId.CUSTOMER_SUPPORT,
        purpose="Classify customer requests, draft context-grounded responses, and retrieve session history.",
        role="Customer Support Lead",
        model_policy=ModelPolicy.BALANCED_REASONING,
        capabilities=["intent_classification", "response_drafting"],
        tools=["narawear_mcp.query"],
        knowledge_sources=["customer_support_kb"],
        data_sources=["customer_profiles", "sessions", "events"],
    ),
    AgentDefinition(
        id="returns_refunds_agent",
        name="Returns & Refunds Agent",
        department=DepartmentId.CUSTOMER_SUPPORT,
        purpose="Process return and refund requests according to policy thresholds.",
        role="Returns Specialist",
        model_policy=ModelPolicy.BALANCED_REASONING,
        capabilities=["return_policy_validation", "refund_initiation"],
        tools=["shopify.get_order", "narawear_mcp.query", "approval.request"],
        data_sources=["customer_profiles", "product_variants"],
        approval_policy={"refund_above_threshold": "required"},
    ),
    AgentDefinition(
        id="cart_recovery_agent",
        name="Cart Recovery Agent",
        department=DepartmentId.CUSTOMER_SUPPORT,
        purpose="Analyze cart removals, identify drop-off triggers, and draft recovery outreach.",
        role="Cart Recovery Specialist",
        model_policy=ModelPolicy.BALANCED_REASONING,
        capabilities=["abandonment_analysis", "recovery_outreach"],
        tools=["narawear_mcp.query"],
        data_sources=["cart_removals", "emailed_carts", "customer_profiles", "sessions", "events"],
    ),
    AgentDefinition(
        id="feedback_analyst",
        name="Feedback Analyst",
        department=DepartmentId.CUSTOMER_SUPPORT,
        purpose="Analyze sentiment, customer reviews, and feedback trends per BRD v2.1 §10.1 / §25 requirement.",
        role="Customer Feedback Analyst",
        model_policy=ModelPolicy.BALANCED_REASONING,
        capabilities=["sentiment_analysis", "feedback_categorization"],
        tools=["narawear_mcp.query"],
        data_sources=["customer_profiles", "events", "sessions", "cart_removals"],
    ),
    # 8. Finance & Accounting
    AgentDefinition(
        id="invoice_processor",
        name="Invoice Processor",
        department=DepartmentId.FINANCE_ACCOUNTING,
        purpose="Validate extracted invoice details, cross-check purchase orders, and prepare draft ERPNext vouchers.",
        role="Accounts Payable Specialist",
        model_policy=ModelPolicy.STRUCTURED_EXTRACTOR,
        capabilities=["invoice_matching", "tax_validation"],
        tools=["erpnext.get_item", "erpnext.create_draft_purchase_order", "narawear_mcp.query", "approval.request"],
        data_sources=["monthly_plans"],
        approval_policy={"journal_entry_post": "required"},
    ),
    AgentDefinition(
        id="reconciliation_agent",
        name="Reconciliation Agent",
        department=DepartmentId.FINANCE_ACCOUNTING,
        purpose="Reconcile payment settlements (Shopify/Razorpay) against ERPNext ledger entries.",
        role="Settlement Specialist",
        model_policy=ModelPolicy.BALANCED_REASONING,
        capabilities=["settlement_reconciliation", "discrepancy_flagging"],
        tools=["erpnext.get_payment_entries", "narawear_mcp.query"],
        data_sources=["monthly_plans", "meta_campaigns", "amazon_campaigns"],
    ),
    AgentDefinition(
        id="financial_analyst",
        name="Financial Analyst",
        department=DepartmentId.FINANCE_ACCOUNTING,
        purpose="Track daily revenue, channel-wise profitability, and operational cost run rates.",
        role="Financial Controller",
        model_policy=ModelPolicy.BALANCED_REASONING,
        capabilities=["financial_modeling", "margin_analysis"],
        tools=["narawear_mcp.query", "narawear.insight_cache_write"],
        data_sources=["monthly_plans", "meta_campaigns", "amazon_campaigns", "state_performance"],
    ),
]


class AgentRegistry:
    """Thread-safe in-memory Agent and Department Registry."""

    def __init__(self):
        self._departments: Dict[DepartmentId, Department] = {
            d.id: d.model_copy(deep=True) for d in DEFAULT_DEPARTMENTS
        }
        self._definitions: Dict[str, AgentDefinition] = {
            d.id: d for d in DEFAULT_AGENT_DEFINITIONS
        }
        self._agents: Dict[str, Agent] = {
            d.id: d.to_agent_model(status=AgentStatus.IDLE) for d in DEFAULT_AGENT_DEFINITIONS
        }
        self._reindex_departments()

    def _reindex_departments(self):
        for dept in self._departments.values():
            dept.agent_ids = [
                agent_id
                for agent_id, agent in self._agents.items()
                if agent.department == dept.id
            ]

    def list_departments(self) -> List[Department]:
        return list(self._departments.values())

    def get_department(self, dept_id: DepartmentId) -> Optional[Department]:
        return self._departments.get(dept_id)

    def list_agents(self, department_id: Optional[DepartmentId] = None) -> List[Agent]:
        if department_id:
            return [a for a in self._agents.values() if a.department == department_id]
        return list(self._agents.values())

    def get_agent(self, agent_id: str) -> Optional[Agent]:
        return self._agents.get(agent_id)

    def get_definition(self, agent_id: str) -> Optional[AgentDefinition]:
        return self._definitions.get(agent_id)

    def update_agent_status(self, agent_id: str, status: AgentStatus) -> Optional[Agent]:
        if agent_id in self._agents:
            self._agents[agent_id].status = status
            return self._agents[agent_id]
        return None

    def register_agent(self, definition: AgentDefinition) -> Agent:
        self._definitions[definition.id] = definition
        agent = definition.to_agent_model()
        self._agents[definition.id] = agent
        self._reindex_departments()
        return agent
