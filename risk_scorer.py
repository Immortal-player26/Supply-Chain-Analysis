from agents.base_agent import BaseAgent


class RiskScorer(BaseAgent):
    """Aggregates signals from all agents and computes composite risk scores."""

    def __init__(self):
        super().__init__(
            name="RiskScorer",
            description="Synthesizes alerts from all monitoring agents, deduplicates, and produces final risk assessments with composite scores.",
        )

    def get_system_prompt(self) -> str:
        return """You are a risk aggregation AI agent. You receive alerts from multiple
monitoring agents (news, weather, geopolitics) and must:

1. Deduplicate overlapping alerts
2. Assess compound risks (multiple disruptions affecting the same region)
3. Calculate an overall risk score (0-100) for each affected region
4. Prioritize alerts by business impact

Respond in JSON format:
{
    "risk_scores": {
        "region_name": {
            "score": 75,
            "factors": ["factor1", "factor2"],
            "trend": "increasing|stable|decreasing"
        }
    },
    "top_risks": [
        {
            "title": "Highest priority risk",
            "description": "Combined risk assessment",
            "risk_level": "critical",
            "affected_region": "Region",
            "confidence": 0.9,
            "contributing_factors": ["news", "weather"]
        }
    ],
    "summary": "Executive risk summary"
}"""
