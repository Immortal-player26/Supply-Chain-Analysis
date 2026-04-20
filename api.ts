export interface Supplier {
  id: number;
  name: string;
  country: string;
  region: string;
  tier: number;
  category: string | null;
  risk_score: number;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export interface RiskAlert {
  id: number;
  title: string;
  description: string | null;
  category: string;
  risk_level: string;
  affected_region: string | null;
  affected_suppliers: string | null;
  confidence: number;
  source: string | null;
  source_url: string | null;
  detected_at: string;
  resolved: number;
}

export interface AgentLog {
  id: number;
  agent_name: string;
  action: string | null;
  details: string | null;
  status: string;
  timestamp: string;
}

export interface SupplyChainLink {
  id: number;
  source_supplier_id: number;
  target_supplier_id: number;
  material: string | null;
  criticality: number;
}

export interface DashboardStats {
  total_suppliers: number;
  active_alerts: number;
  critical_risks: number;
  average_risk_score: number;
  agents_active: number;
  disruption_categories: Record<string, number>;
}

export interface AgentInfo {
  name: string;
  description: string;
  status: string;
}

export interface AgentStatus {
  agents: AgentInfo[];
  orchestrator: {
    is_running: boolean;
    last_run: string | null;
  };
}

const BASE = "/api";

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, init);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export const api = {
  getDashboard: () => fetchJSON<DashboardStats>("/dashboard"),
  getSuppliers: () => fetchJSON<Supplier[]>("/suppliers"),
  getAlerts: (resolved = 0) => fetchJSON<RiskAlert[]>(`/alerts?resolved=${resolved}`),
  resolveAlert: (id: number) => fetchJSON<{ status: string }>(`/alerts/${id}/resolve`, { method: "POST" }),
  getSupplyChain: () => fetchJSON<SupplyChainLink[]>("/supply-chain"),
  getAgentStatus: () => fetchJSON<AgentStatus>("/agents/status"),
  getAgentLogs: () => fetchJSON<AgentLog[]>("/agents/logs"),
  runAnalysis: (query: string) =>
    fetchJSON<any>("/agents/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    }),
};
