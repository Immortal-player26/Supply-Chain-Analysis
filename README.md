# SupplyShield AI — Supply Chain Risk Analyzer

> AI-powered multi-agent system for real-time global supply chain risk monitoring.  
> Inspired by **RiskWise** — Microsoft AI Agents Hackathon 2025 Winner.

![Stack](https://img.shields.io/badge/Stack-Python%20%7C%20React%20%7C%20OpenAI%20%7C%20SQL-6366f1)

---

## Overview

SupplyShield AI uses **4 autonomous AI agents** to continuously monitor global supply chains and flag disruptions from news, weather, and geopolitical events in real time.

### Multi-Agent Architecture

| Agent | Role |
|---|---|
| **NewsMonitor** | Scans global news for factory shutdowns, port closures, logistics disruptions |
| **WeatherMonitor** | Tracks severe weather events impacting shipping, manufacturing, agriculture |
| **GeopoliticsMonitor** | Monitors trade wars, sanctions, conflicts, regulatory changes |
| **RiskScorer** | Aggregates signals from all agents, deduplicates, computes composite risk scores |

### Key Features

- **Parallax landing page** with animated risk indicators
- **Real-time dashboard** with live alerts, risk scores, and agent activity
- **Interactive world map** showing supplier locations with risk-colored markers
- **Supplier risk matrix** with sortable risk scores and tier badges
- **Disruption category breakdown** (news, weather, geopolitics, logistics, economic)
- **Agent activity log** showing real-time autonomous agent operations
- **Multi-agent orchestration** — all agents run in parallel, scored by aggregator

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python · FastAPI · SQLAlchemy · SQLite |
| **AI** | OpenAI API (GPT-4o-mini) · Multi-agent orchestration |
| **Frontend** | React 18 · TypeScript · Vite · Lucide Icons |
| **Database** | SQLite (dev) / PostgreSQL (prod) |
| **Styling** | Custom CSS with parallax effects, dark theme |

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- OpenAI API key (optional — app works with demo data without it)

### Backend

```bash
cd supply-chain-risk-analyzer/backend
pip install -r requirements.txt

# Copy and configure environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Start the API server
python main.py
```

The API will be available at `http://localhost:8000`.

### Frontend

```bash
cd supply-chain-risk-analyzer/frontend
npm install
npm run dev
```

The UI will be available at `http://localhost:3000`.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard` | Dashboard statistics |
| `GET` | `/api/suppliers` | List all suppliers by risk score |
| `POST` | `/api/suppliers` | Add a new supplier |
| `GET` | `/api/alerts` | Active risk alerts |
| `POST` | `/api/alerts/{id}/resolve` | Resolve an alert |
| `GET` | `/api/supply-chain` | Supply chain link graph |
| `GET` | `/api/agents/status` | Agent status overview |
| `GET` | `/api/agents/logs` | Recent agent activity logs |
| `POST` | `/api/agents/analyze` | Trigger full multi-agent analysis |
| `POST` | `/api/agents/{name}/run` | Run a specific agent |

---

## Project Structure

```
supply-chain-risk-analyzer/
├── backend/
│   ├── main.py              # FastAPI app, routes, seed data
│   ├── database.py           # Async SQLAlchemy setup
│   ├── models.py             # DB models (Supplier, RiskAlert, etc.)
│   ├── schemas.py            # Pydantic schemas
│   ├── requirements.txt
│   └── agents/
│       ├── base_agent.py     # Base agent with OpenAI integration
│       ├── news_agent.py     # News disruption monitor
│       ├── weather_agent.py  # Weather event monitor
│       ├── geopolitics_agent.py  # Geopolitical risk monitor
│       ├── risk_scorer.py    # Risk aggregation agent
│       └── orchestrator.py   # Multi-agent orchestrator
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx           # Main app component
│       ├── main.tsx          # Entry point
│       ├── styles.css        # Full UI styles with parallax
│       ├── lib/
│       │   └── api.ts        # API client + TypeScript types
│       ├── hooks/
│       │   └── useRiskData.ts # Data fetching hook
│       └── components/
│           ├── ParallaxHero.tsx    # Parallax landing section
│           ├── StatsBar.tsx        # KPI stat cards
│           ├── AlertFeed.tsx       # Live risk alert feed
│           ├── AgentPanel.tsx      # AI agent status & logs
│           ├── SupplierTable.tsx   # Supplier risk table
│           ├── WorldMap.tsx        # SVG world map visualization
│           └── DisruptionChart.tsx # Category breakdown chart
└── README.md
```

---

## Why It Wins

1. **Business Value** — Directly addresses a trillion-dollar problem (supply chain disruptions cost companies billions annually)
2. **Multi-Agent Architecture** — Four specialized AI agents run in parallel, each with domain expertise
3. **Real-Time Monitoring** — Continuous autonomous scanning with instant alert surfacing
4. **Polished UI** — Parallax landing page + professional dark-themed dashboard
5. **Production-Ready** — Clean architecture, async Python, typed React, proper data models
