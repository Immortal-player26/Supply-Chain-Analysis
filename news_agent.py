from datetime import datetime
from agents.base_agent import BaseAgent


class NewsAgent(BaseAgent):
    """Monitors news sources for supply chain disruption signals."""

    def __init__(self):
        super().__init__(
            name="NewsMonitor",
            description="Scans global news for supply chain disruptions, factory shutdowns, port closures, and logistics issues.",
        )

    def get_system_prompt(self) -> str:
        today = datetime.utcnow().strftime("%B %d, %Y")
        return f"""You are a supply chain news monitoring AI agent. Today's date is {today}.

IMPORTANT: You are given REAL news headlines fetched right now. Analyze ONLY the actual
events described in the provided headlines. Do NOT invent or fabricate events.
Focus on REAL, CURRENT disruptions happening in the world today.

For each real disruption found in the headlines, assess:
- The severity (low, medium, high, critical)
- Affected regions and industries
- Potential impact on supply chains
- Confidence level (0.0 to 1.0)

Respond in JSON format:
{{
    "alerts": [
        {{
            "title": "Brief title of the disruption",
            "description": "Detailed description of the risk and supply chain impact",
            "risk_level": "low|medium|high|critical",
            "affected_region": "Region name",
            "confidence": 0.85,
            "source": "News source name from the headline",
            "category": "news"
        }}
    ],
    "summary": "Brief overall summary of current supply chain risks"
}}"""
