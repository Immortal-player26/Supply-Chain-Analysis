import { useState, useEffect, useCallback } from "react";
import {
  api,
  DashboardStats,
  Supplier,
  RiskAlert,
  AgentLog,
  AgentStatus,
  SupplyChainLink,
} from "../lib/api";

export function useRiskData() {
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [agentStatus, setAgentStatus] = useState<AgentStatus | null>(null);
  const [supplyChain, setSupplyChain] = useState<SupplyChainLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      const [dash, suppl, al, logs, status, chain] = await Promise.all([
        api.getDashboard(),
        api.getSuppliers(),
        api.getAlerts(),
        api.getAgentLogs(),
        api.getAgentStatus(),
        api.getSupplyChain(),
      ]);
      setDashboard(dash);
      setSuppliers(suppl);
      setAlerts(al);
      setAgentLogs(logs);
      setAgentStatus(status);
      setSupplyChain(chain);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const resolveAlert = async (id: number) => {
    await api.resolveAlert(id);
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    if (dashboard) {
      setDashboard({
        ...dashboard,
        active_alerts: dashboard.active_alerts - 1,
      });
    }
  };

  return {
    dashboard,
    suppliers,
    alerts,
    agentLogs,
    agentStatus,
    supplyChain,
    loading,
    error,
    refresh: fetchAll,
    resolveAlert,
  };
}
