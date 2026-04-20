import httpx
import logging
from xml.etree import ElementTree
from datetime import datetime

logger = logging.getLogger(__name__)

RSS_FEEDS = {
    "supply_chain": "https://news.google.com/rss/search?q=supply+chain+disruption+OR+shipping+delay+OR+port+closure&hl=en-US&gl=US&ceid=US:en",
    "geopolitics": "https://news.google.com/rss/search?q=trade+war+OR+sanctions+OR+military+conflict+OR+geopolitical+tension+OR+tariff&hl=en-US&gl=US&ceid=US:en",
    "weather": "https://news.google.com/rss/search?q=hurricane+OR+typhoon+OR+earthquake+OR+flood+OR+drought+supply+chain&hl=en-US&gl=US&ceid=US:en",
    "energy": "https://news.google.com/rss/search?q=oil+price+OR+energy+crisis+OR+OPEC+OR+natural+gas+shortage&hl=en-US&gl=US&ceid=US:en",
    "conflict": "https://news.google.com/rss/search?q=Iran+war+OR+Middle+East+conflict+OR+Red+Sea+shipping+OR+Ukraine+Russia&hl=en-US&gl=US&ceid=US:en",
}

TIMEOUT = 15.0


async def fetch_rss_headlines(url: str, max_items: int = 10) -> list[dict]:
    """Fetch headlines from an RSS feed URL."""
    try:
        async with httpx.AsyncClient(timeout=TIMEOUT) as client:
            resp = await client.get(url)
            resp.raise_for_status()
        root = ElementTree.fromstring(resp.text)
        items = []
        for item in root.iter("item"):
            title = item.findtext("title", "")
            desc = item.findtext("description", "")
            pub_date = item.findtext("pubDate", "")
            source_el = item.find("source")
            source = source_el.text if source_el is not None else ""
            items.append({
                "title": title,
                "description": desc,
                "published": pub_date,
                "source": source,
            })
            if len(items) >= max_items:
                break
        return items
    except Exception as e:
        logger.warning(f"Failed to fetch RSS feed {url}: {e}")
        return []


async def fetch_all_news() -> dict[str, list[dict]]:
    """Fetch headlines from all configured RSS feeds."""
    results = {}
    for category, url in RSS_FEEDS.items():
        results[category] = await fetch_rss_headlines(url)
    return results


def format_news_context(news: dict[str, list[dict]]) -> str:
    """Format fetched news into a context string for LLM agents."""
    today = datetime.utcnow().strftime("%B %d, %Y")
    sections = [f"TODAY'S DATE: {today}\n\nBELOW ARE REAL NEWS HEADLINES FROM TODAY. Analyze these for supply chain risks:\n"]

    for category, items in news.items():
        if not items:
            continue
        sections.append(f"\n--- {category.upper().replace('_', ' ')} NEWS ---")
        for item in items:
            line = f"• {item['title']}"
            if item.get("source"):
                line += f" (Source: {item['source']})"
            if item.get("published"):
                line += f" [{item['published']}]"
            sections.append(line)

    return "\n".join(sections)
