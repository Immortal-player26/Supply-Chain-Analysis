import json
import os
import asyncio
import logging
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
import random

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, func, delete
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_db, init_db, async_session
from models import Supplier, RiskAlert, SupplyChainLink, AgentLog, RiskLevel, DisruptionCategory
from schemas import (
    SupplierCreate, SupplierOut, RiskAlertOut, AgentLogOut,
    SupplyChainLinkOut, DashboardStats, AnalysisRequest,
)
from agents.orchestrator import AgentOrchestrator

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

orchestrator = AgentOrchestrator()

# Map LLM risk_level strings to our enum
RISK_LEVEL_MAP = {
    "low": RiskLevel.LOW,
    "medium": RiskLevel.MEDIUM,
    "high": RiskLevel.HIGH,
    "critical": RiskLevel.CRITICAL,
}

# Map LLM category strings to our enum
CATEGORY_MAP = {
    "news": DisruptionCategory.NEWS,
    "weather": DisruptionCategory.WEATHER,
    "geopolitics": DisruptionCategory.GEOPOLITICS,
    "logistics": DisruptionCategory.LOGISTICS,
    "economic": DisruptionCategory.ECONOMIC,
}


async def persist_analysis(result: dict):
    """Save agent analysis results into the database as real alerts and logs."""
    async with async_session() as db:
        now = datetime.utcnow()
        agent_results = result.get("agent_results", {})
        saved_count = 0

        for agent_name, agent_data in agent_results.items():
            alerts = agent_data.get("alerts", [])
            for alert_data in alerts:
                risk_str = alert_data.get("risk_level", "medium").lower()
                cat_str = alert_data.get("category", "news").lower()

                risk_level = RISK_LEVEL_MAP.get(risk_str, RiskLevel.MEDIUM)
                category = CATEGORY_MAP.get(cat_str, DisruptionCategory.NEWS)

                alert = RiskAlert(
                    title=alert_data.get("title", "Unknown Alert")[:500],
                    description=alert_data.get("description", ""),
                    category=category,
                    risk_level=risk_level,
                    affected_region=alert_data.get("affected_region", "Global"),
                    confidence=min(max(alert_data.get("confidence", 0.5), 0.0), 1.0),
                    source=alert_data.get("source", agent_name),
                    detected_at=now,
                )
                db.add(alert)
                saved_count += 1

            # Log agent activity
            summary = agent_data.get("summary", f"Analyzed and found {len(alerts)} alerts.")
            log = AgentLog(
                agent_name=agent_name,
                action="real_time_scan",
                details=f"{summary} ({len(alerts)} alerts generated)",
                status="completed",
                timestamp=now,
            )
            db.add(log)

        # Log risk scorer
        risk_assessment = result.get("risk_assessment", {})
        scorer_summary = risk_assessment.get("summary", "Risk assessment completed.")
        top_risks = risk_assessment.get("top_risks", [])
        db.add(AgentLog(
            agent_name="RiskScorer",
            action="aggregate_risks",
            details=f"{scorer_summary} ({len(top_risks)} top risks identified)",
            status="completed",
            timestamp=now,
        ))

        # Update supplier risk scores based on regional risk assessment
        risk_scores = risk_assessment.get("risk_scores", {})
        if risk_scores:
            suppliers_result = await db.execute(select(Supplier))
            suppliers = suppliers_result.scalars().all()
            for supplier in suppliers:
                for region, score_data in risk_scores.items():
                    if region.lower() in supplier.region.lower() or supplier.region.lower() in region.lower():
                        new_score = score_data.get("score", supplier.risk_score)
                        supplier.risk_score = min(max(float(new_score), 0.0), 100.0)
                        break

        await db.commit()
        logger.info(f"Persisted {saved_count} real-time alerts to database.")


async def seed_suppliers():
    """Seed the supplier network (only if empty)."""
    async with async_session() as db:
        existing = await db.scalar(select(func.count(Supplier.id)))
        if existing > 0:
            return

        suppliers = [
            Supplier(name="Taiwan Semiconductor Co.", country="Taiwan", region="East Asia", tier=1, category="Semiconductors", risk_score=50, latitude=25.03, longitude=121.56),
            Supplier(name="Shanghai Electronics Ltd.", country="China", region="East Asia", tier=1, category="Electronics", risk_score=50, latitude=31.23, longitude=121.47),
            Supplier(name="Bavaria Auto Parts GmbH", country="Germany", region="Europe", tier=1, category="Automotive", risk_score=30, latitude=48.14, longitude=11.58),
            Supplier(name="Rhine Chemicals AG", country="Germany", region="Europe", tier=2, category="Chemicals", risk_score=25, latitude=50.94, longitude=6.96),
            Supplier(name="Gujarat Textiles Pvt.", country="India", region="South Asia", tier=2, category="Textiles", risk_score=40, latitude=23.02, longitude=72.57),
            Supplier(name="São Paulo Mining Corp.", country="Brazil", region="South America", tier=1, category="Mining", risk_score=35, latitude=-23.55, longitude=-46.63),
            Supplier(name="Lagos Logistics Hub", country="Nigeria", region="West Africa", tier=3, category="Logistics", risk_score=50, latitude=6.52, longitude=3.38),
            Supplier(name="Texas Energy Solutions", country="USA", region="North America", tier=1, category="Energy", risk_score=20, latitude=29.76, longitude=-95.37),
            Supplier(name="Osaka Precision Mfg.", country="Japan", region="East Asia", tier=1, category="Electronics", risk_score=30, latitude=34.69, longitude=135.50),
            Supplier(name="Rotterdam Port Services", country="Netherlands", region="Europe", tier=2, category="Logistics", risk_score=20, latitude=51.92, longitude=4.48),
            Supplier(name="Ho Chi Minh Textiles", country="Vietnam", region="Southeast Asia", tier=2, category="Textiles", risk_score=40, latitude=10.82, longitude=106.63),
            Supplier(name="Dubai Trade Hub", country="UAE", region="Middle East", tier=2, category="Logistics", risk_score=45, latitude=25.20, longitude=55.27),
            Supplier(name="Seoul Battery Tech", country="South Korea", region="East Asia", tier=1, category="Electronics", risk_score=35, latitude=37.57, longitude=126.98),
            Supplier(name="Chilean Copper Mining", country="Chile", region="South America", tier=1, category="Mining", risk_score=30, latitude=-33.45, longitude=-70.67),
            Supplier(name="Melbourne Agri Export", country="Australia", region="Oceania", tier=2, category="Agriculture", risk_score=20, latitude=-37.81, longitude=144.96),
            Supplier(name="Tehran Petrochemical Co.", country="Iran", region="Middle East", tier=2, category="Energy", risk_score=70, latitude=35.69, longitude=51.39),
            Supplier(name="Jeddah Port Authority", country="Saudi Arabia", region="Middle East", tier=2, category="Logistics", risk_score=55, latitude=21.49, longitude=39.19),
            Supplier(name="Shenzhen Tech Manufacturing", country="China", region="East Asia", tier=1, category="Electronics", risk_score=55, latitude=22.54, longitude=114.06),
        ]
        db.add_all(suppliers)
        await db.flush()

        links = [
            SupplyChainLink(source_supplier_id=1, target_supplier_id=2, material="Silicon Wafers", criticality=0.95),
            SupplyChainLink(source_supplier_id=2, target_supplier_id=9, material="Display Panels", criticality=0.8),
            SupplyChainLink(source_supplier_id=3, target_supplier_id=4, material="Chemical Coatings", criticality=0.6),
            SupplyChainLink(source_supplier_id=6, target_supplier_id=3, material="Iron Ore", criticality=0.85),
            SupplyChainLink(source_supplier_id=8, target_supplier_id=3, material="Petroleum Products", criticality=0.7),
            SupplyChainLink(source_supplier_id=5, target_supplier_id=11, material="Raw Cotton", criticality=0.55),
            SupplyChainLink(source_supplier_id=14, target_supplier_id=13, material="Copper Cathode", criticality=0.9),
            SupplyChainLink(source_supplier_id=10, target_supplier_id=7, material="Shipping Routes", criticality=0.75),
            SupplyChainLink(source_supplier_id=12, target_supplier_id=7, material="Trade Facilitation", criticality=0.65),
            SupplyChainLink(source_supplier_id=1, target_supplier_id=13, material="Chip Components", criticality=0.88),
            SupplyChainLink(source_supplier_id=16, target_supplier_id=12, material="Crude Oil", criticality=0.85),
            SupplyChainLink(source_supplier_id=17, target_supplier_id=12, material="Port Services", criticality=0.7),
            SupplyChainLink(source_supplier_id=18, target_supplier_id=1, material="IC Packaging", criticality=0.8),
        ]
        db.add_all(links)
        await db.commit()
        logger.info("Supplier network seeded.")


async def run_initial_analysis():
    """Run agents on startup to populate real-time alerts."""
    logger.info("Running initial real-time analysis with live news feeds...")
    try:
        result = await orchestrator.run_all_agents()
        await persist_analysis(result)
        logger.info("Initial real-time analysis complete.")
    except Exception as e:
        logger.error(f"Initial analysis failed: {e}")


async def periodic_analysis(interval_minutes: int = 30):
    """Periodically run agents to keep data fresh."""
    while True:
        await asyncio.sleep(interval_minutes * 60)
        logger.info("Running periodic real-time analysis...")
        try:
            result = await orchestrator.run_all_agents()
            await persist_analysis(result)
            logger.info("Periodic analysis complete.")
        except Exception as e:
            logger.error(f"Periodic analysis failed: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    await seed_suppliers()
    if not os.environ.get('VERCEL'):
        # Background tasks only work in long-running server, not serverless
        asyncio.create_task(run_initial_analysis())
        task = asyncio.create_task(periodic_analysis(30))
        yield
        task.cancel()
    else:
        yield


app = FastAPI(
    title="Supply Chain Risk Analyzer",
    description="AI-powered multi-agent supply chain risk monitoring system",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Dashboard ──────────────────────────────────────────────────────────

@app.get("/api/dashboard", response_model=DashboardStats)
async def get_dashboard(db: AsyncSession = Depends(get_db)):
    total_suppliers = await db.scalar(select(func.count(Supplier.id)))
    active_alerts = await db.scalar(
        select(func.count(RiskAlert.id)).where(RiskAlert.resolved == 0)
    )
    critical_risks = await db.scalar(
        select(func.count(RiskAlert.id)).where(
            RiskAlert.resolved == 0, RiskAlert.risk_level == RiskLevel.CRITICAL
        )
    )
    avg_risk = await db.scalar(select(func.avg(Supplier.risk_score))) or 0

    # Category breakdown
    categories = {}
    for cat in DisruptionCategory:
        count = await db.scalar(
            select(func.count(RiskAlert.id)).where(
                RiskAlert.resolved == 0, RiskAlert.category == cat
            )
        )
        categories[cat.value] = count or 0

    return DashboardStats(
        total_suppliers=total_suppliers or 0,
        active_alerts=active_alerts or 0,
        critical_risks=critical_risks or 0,
        average_risk_score=round(avg_risk, 1),
        agents_active=4,
        disruption_categories=categories,
    )


# ── Suppliers ──────────────────────────────────────────────────────────

@app.get("/api/suppliers", response_model=list[SupplierOut])
async def list_suppliers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Supplier).order_by(Supplier.risk_score.desc()))
    return result.scalars().all()


@app.post("/api/suppliers", response_model=SupplierOut)
async def create_supplier(data: SupplierCreate, db: AsyncSession = Depends(get_db)):
    supplier = Supplier(**data.model_dump())
    db.add(supplier)
    await db.commit()
    await db.refresh(supplier)
    return supplier


# ── Risk Alerts ────────────────────────────────────────────────────────

@app.get("/api/alerts", response_model=list[RiskAlertOut])
async def list_alerts(resolved: int = 0, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(RiskAlert)
        .where(RiskAlert.resolved == resolved)
        .order_by(RiskAlert.detected_at.desc())
    )
    return result.scalars().all()


@app.post("/api/alerts/{alert_id}/resolve")
async def resolve_alert(alert_id: int, db: AsyncSession = Depends(get_db)):
    alert = await db.get(RiskAlert, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.resolved = 1
    await db.commit()
    return {"status": "resolved"}


# ── Supply Chain Graph ─────────────────────────────────────────────────

@app.get("/api/supply-chain", response_model=list[SupplyChainLinkOut])
async def get_supply_chain(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(SupplyChainLink))
    return result.scalars().all()


# ── Agent Operations ──────────────────────────────────────────────────

@app.get("/api/agents/status")
async def agent_status():
    return orchestrator.get_status()


@app.get("/api/agents/logs", response_model=list[AgentLogOut])
async def agent_logs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(AgentLog).order_by(AgentLog.timestamp.desc()).limit(50)
    )
    return result.scalars().all()


@app.post("/api/agents/analyze")
async def run_analysis(request: AnalysisRequest):
    """Trigger a full multi-agent analysis and persist results."""
    result = await orchestrator.run_all_agents(request.query)
    await persist_analysis(result)
    return result


@app.post("/api/agents/{agent_name}/run")
async def run_single_agent(agent_name: str, request: AnalysisRequest):
    """Run a specific agent."""
    result = await orchestrator.run_single_agent(agent_name, request.query)
    return result


# ── Health ─────────────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
