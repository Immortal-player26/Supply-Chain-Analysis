from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class SupplierCreate(BaseModel):
    name: str
    country: str
    region: str
    tier: int = 1
    category: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class SupplierOut(BaseModel):
    id: int
    name: str
    country: str
    region: str
    tier: int
    category: Optional[str]
    risk_score: float
    latitude: Optional[float]
    longitude: Optional[float]
    created_at: datetime

    class Config:
        from_attributes = True


class RiskAlertOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    category: str
    risk_level: str
    affected_region: Optional[str]
    affected_suppliers: Optional[str]
    confidence: float
    source: Optional[str]
    source_url: Optional[str]
    detected_at: datetime
    resolved: int

    class Config:
        from_attributes = True


class AgentLogOut(BaseModel):
    id: int
    agent_name: str
    action: Optional[str]
    details: Optional[str]
    status: str
    timestamp: datetime

    class Config:
        from_attributes = True


class SupplyChainLinkOut(BaseModel):
    id: int
    source_supplier_id: int
    target_supplier_id: int
    material: Optional[str]
    criticality: float

    class Config:
        from_attributes = True


class DashboardStats(BaseModel):
    total_suppliers: int
    active_alerts: int
    critical_risks: int
    average_risk_score: float
    agents_active: int
    disruption_categories: dict


class AnalysisRequest(BaseModel):
    query: str
    region: Optional[str] = None
    category: Optional[str] = None
