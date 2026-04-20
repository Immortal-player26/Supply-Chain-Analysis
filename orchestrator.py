import json
import asyncio
import logging
from datetime import datetime

from agents.news_agent import NewsAgent
from agents.weather_agent import WeatherAgent
from agents.geopolitics_agent import GeopoliticsAgent
from agents.risk_scorer import RiskScorer
from agents.news_fetcher import fetch_all_news, format_news_context

logger = logging.getLogger(__name__)


class AgentOrchestrator:
    """Coordinates all AI agents and manages the analysis pipeline."""

    def __init__(self):
        self.news_agent = NewsAgent()
        self.weather_agent = WeatherAgent()
        self.geopolitics_agent = GeopoliticsAgent()
        self.risk_scorer = RiskScorer()
        self.agents = [self.news_agent, self.weather_agent, self.geopolitics_agent]
        self.last_run: datetime | None = None
        self.is_running = False

    async def run_all_agents(self, context: str = "") -> dict:
        """Run all monitoring agents in parallel, then aggregate with risk scorer."""
        self.is_running = True
        try:
            # Fetch real news headlines
            logger.info("Fetching real-time news headlines...")
            news_data = await fetch_all_news()
            real_news_context = format_news_context(news_data)

            if context:
                monitoring_context = f"{real_news_context}\n\nADDITIONAL CONTEXT: {context}"
            else:
                monitoring_context = real_news_context

            # Run monitoring agents in parallel
            results = await asyncio.gather(
                self.news_agent.analyze(f"Analyze these real news headlines for supply chain disruptions:\n{monitoring_context}"),
                self.weather_agent.analyze(f"Analyze these real news headlines for weather-related supply chain risks:\n{monitoring_context}"),
                self.geopolitics_agent.analyze(f"Analyze these real news headlines for geopolitical supply chain risks:\n{monitoring_context}"),
                return_exceptions=True,
            )

            all_alerts = []
            agent_results = {}
            for agent, result in zip(self.agents, results):
                if isinstance(result, Exception):
                    logger.error(f"Agent {agent.name} failed: {result}")
                    agent_results[agent.name] = {"error": str(result), "alerts": []}
                else:
                    agent_results[agent.name] = result
                    all_alerts.extend(result.get("alerts", []))

            # Aggregate with risk scorer
            scorer_input = json.dumps({"all_alerts": all_alerts}, indent=2)
            risk_assessment = await self.risk_scorer.analyze(
                f"Aggregate and score these supply chain risk alerts:\n{scorer_input}"
            )

            self.last_run = datetime.utcnow()
            return {
                "agent_results": agent_results,
                "risk_assessment": risk_assessment,
                "total_alerts": len(all_alerts),
                "timestamp": self.last_run.isoformat(),
            }
        finally:
            self.is_running = False

    async def run_single_agent(self, agent_name: str, context: str) -> dict:
        """Run a specific agent with real news context."""
        agent_map = {
            "news": self.news_agent,
            "weather": self.weather_agent,
            "geopolitics": self.geopolitics_agent,
            "risk_scorer": self.risk_scorer,
        }
        agent = agent_map.get(agent_name)
        if not agent:
            return {"error": f"Unknown agent: {agent_name}"}

        # Enrich with real news
        news_data = await fetch_all_news()
        real_news_context = format_news_context(news_data)
        enriched = f"{real_news_context}\n\nADDITIONAL CONTEXT: {context}"
        return await agent.analyze(enriched)

    def get_status(self) -> dict:
        return {
            "agents": [
                {"name": a.name, "description": a.description, "status": "active"}
                for a in self.agents
            ],
            "orchestrator": {
                "is_running": self.is_running,
                "last_run": self.last_run.isoformat() if self.last_run else None,
            },
        }

    def _build_default_context(self) -> str:
        return """Monitor the following key supply chain regions and industries:
- East Asia (semiconductors, electronics manufacturing)
- Southeast Asia (textiles, automotive parts)
- Europe (automotive, pharmaceuticals, chemicals)
- North America (technology, agriculture, energy)
- Middle East (oil & gas, petrochemicals, shipping routes)
- South America (mining, agriculture)

Focus on: port disruptions, factory shutdowns, transportation delays,
raw material shortages, energy supply issues, trade policy changes,
severe weather events, military conflicts, and geopolitical tensions."""
