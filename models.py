import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Enum as SAEnum
from database import Base
import enum


class RiskLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class DisruptionCategory(str, enum.Enum):
    NEWS = "news"
    WEATHER = "weather"
    GEOPOLITICS = "geopolitics"
    LOGISTICS = "logistics"
    ECONOMIC = "economic"


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    country = Column(String(100), nullable=False)
    region = Column(String(100), nullable=False)
    tier = Column(Integer, default=1)
    category = Column(String(100))
    risk_score = Column(Float, default=0.0)
    latitude = Column(Float)
    longitude = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class RiskAlert(Base):
    __tablename__ = "risk_alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text)
    category = Column(SAEnum(DisruptionCategory), nullable=False)
    risk_level = Column(SAEnum(RiskLevel), nullable=False)
    affected_region = Column(String(200))
    affected_suppliers = Column(Text)  # JSON string of supplier IDs
    confidence = Column(Float, default=0.0)
    source = Column(String(200))
    source_url = Column(String(500))
    detected_at = Column(DateTime, default=datetime.datetime.utcnow)
    resolved = Column(Integer, default=0)


class SupplyChainLink(Base):
    __tablename__ = "supply_chain_links"

    id = Column(Integer, primary_key=True, index=True)
    source_supplier_id = Column(Integer, nullable=False)
    target_supplier_id = Column(Integer, nullable=False)
    material = Column(String(200))
    criticality = Column(Float, default=0.5)


class AgentLog(Base):
    __tablename__ = "agent_logs"

    id = Column(Integer, primary_key=True, index=True)
    agent_name = Column(String(100), nullable=False)
    action = Column(String(200))
    details = Column(Text)
    status = Column(String(50), default="completed")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
