import os
import json
import logging
from abc import ABC, abstractmethod
from openai import AsyncOpenAI

logger = logging.getLogger(__name__)

_api_key = (os.getenv("OPENAI_API_KEY") or "").strip()
_base_url = (os.getenv("OPENAI_BASE_URL") or "").strip() or None

client = AsyncOpenAI(
    api_key=_api_key,
    base_url=_base_url,
)


class BaseAgent(ABC):
    """Base class for all supply chain monitoring agents."""

    def __init__(self, name: str, description: str):
        self.name = name
        self.description = description

    @abstractmethod
    def get_system_prompt(self) -> str:
        pass

    async def analyze(self, context: str) -> dict:
        """Run AI analysis on the given context."""
        try:
            response = await client.chat.completions.create(
                model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                messages=[
                    {"role": "system", "content": self.get_system_prompt()},
                    {"role": "user", "content": context},
                ],
                temperature=0.3,
                response_format={"type": "json_object"},
            )
            content = response.choices[0].message.content
            return json.loads(content)
        except Exception as e:
            logger.error(f"Agent {self.name} analysis failed: {e}")
            return {"error": str(e), "alerts": []}
