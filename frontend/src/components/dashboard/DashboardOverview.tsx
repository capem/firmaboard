import * as React from 'react';
import { Card } from '@/components/ui/card';

// TODO: Django API Integration
// - Fetch KPI data from /api/dashboard/kpis
// - Implement periodic refresh using polling or WebSocket
// - Endpoints needed:
//   * GET /api/dashboard/kpis
//   * GET /api/dashboard/summary
//   * WebSocket: ws://domain/ws/dashboard/live-updates/

interface KPICardProps {
  title: string;
  value: string;
  description: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, description }) => (
  <Card className="p-4 shadow-sm rounded-lg">
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
    <span className="text-sm text-muted-foreground">{description}</span>
  </Card>
);

export const DashboardOverview: React.FC = () => {
  // TODO: Implement API hooks
  // const { data: kpiData } = useQuery('dashboardKPIs', fetchDashboardKPIs)
  // const { data: summaryData } = useQuery('dashboardSummary', fetchDashboardSummary)
  // useWebSocket('ws://domain/ws/dashboard/live-updates/')

  const kpis = [
    { title: 'Total Power Output', value: '1200 MW', description: 'Aggregate power generated across all assets.' },
    { title: 'Average Availability', value: '98%', description: 'Average uptime of all monitored assets.' },
    { title: 'Active Maintenance', value: '5', description: 'Number of assets currently under maintenance.' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpis.map((kpi) => (
        <KPICard key={kpi.title} title={kpi.title} value={kpi.value} description={kpi.description} />
      ))}
    </div>
  );
}; 