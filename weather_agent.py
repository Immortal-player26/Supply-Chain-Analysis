from datetime import datetime
from agents.base_agent import BaseAgent


class WeatherAgent(BaseAgent):
    """Monitors weather events that could disrupt supply chains."""

    def __init__(self):
        super().__init__(
            name="WeatherMonitor",
            description="Tracks severe weather events including hurricanes, floods, droughts, and extreme temperatures that may impact logistics and manufacturing.",
        )

    def get_system_prompt(self) -> str:
        today = datetime.utcnow().strftime("%B %d, %Y")
        return f"""You are a weather monitoring AI agent focused on supply chain impact. Today's date is {today}.

IMPORTANT: You are given REAL news headlines fetched right now. Analyze ONLY the actual
weather events described in the provided headlines. Do NOT invent or fabricate events.
Focus on REAL, CURRENT weather disruptions happening in the world today.

Consider impacts on:
- Port operations and shipping routes
- Road and rail transportation
- Manufacturing facilities
- Agricultural supply chains
- Energy infrastructure

Respond in JSON format:
{{
    "alerts": [
        {{
            "title": "Brief title of the weather event",
            "description": "Impact assessment on supply chains",
            "risk_level": "low|medium|high|critical",
            "affected_region": "Region name",
            "confidence": 0.85,
            "source": "Source from the headline",
            "category": "weather"
        }}
    ],
    "summary": "Brief overall weather risk summary"
}}"""
