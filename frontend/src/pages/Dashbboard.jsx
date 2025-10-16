import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { getMachines, getProductionStats, getReports } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import KpiCard from '../components/KpiCard';
import { ProductionChart, MachineChart, DefectRateChart } from '../components/Charts';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const { socket } = useSocket();
  const [realTimeData, setRealTimeData] = useState(null);

  const { data: machines, refetch: refetchMachines } = useQuery('machines', async () => {
    const response = await getMachines();
    return response.data;
  });

  const { data: stats, refetch: refetchStats } = useQuery('stats', async () => {
    const response = await getProductionStats();
    return response.data;
  });

  const { data: reports } = useQuery('reports', async () => {
    const response = await getReports();
    return response.data;
  });

  useEffect(() => {
    if (socket) {
      socket.on('machine:update', (data) => {
        console.log('Machine updated:', data);
        refetchMachines();
        setRealTimeData(data);
      });

      socket.on('production:new', (data) => {
        console.log('New production:', data);
        refetchStats();
      });

      return () => {
        socket.off('machine:update');
        socket.off('production:new');
      };
    }
  }, [socket, refetchMachines, refetchStats]);

  const runningMachines = machines?.filter(m => m.status === 'running').length || 0;
  const stoppedMachines = machines?.filter(m => m.status === 'stopped').length || 0;
  const maintenanceMachines = machines?.filter(m => m.status === 'maintenance').length || 0;

  return (
    <div className="flex min-h-screen bg-muted">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Real-time production monitoring</p>
        </div>

        {realTimeData && (
          <div className="bg-accent text-accent-foreground px-4 py-3 rounded-lg mb-6 animate-pulse">
            Real-time update: Machine {realTimeData.name} status changed to {realTimeData.status}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard
            title="Total Production"
            value={stats?.totalQuantity || 0}
            unit="units"
            icon="📦"
          />
          <KpiCard
            title="OEE Score"
            value={stats?.oee || 0}
            unit="%"
            icon="📊"
            trend={5}
          />
          <KpiCard
            title="Quality Rate"
            value={stats?.qualityRate || 0}
            unit="%"
            icon="✅"
          />
          <KpiCard
            title="Defect Rate"
            value={stats?.defectRate || 0}
            unit="%"
            icon="⚠️"
            trend={-2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-background border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Machine Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Running</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {runningMachines}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Stopped</span>
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  {stoppedMachines}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Maintenance</span>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  {maintenanceMachines}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-background border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Production Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Records</span>
                <span className="text-foreground font-bold">{stats?.totalRecords || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Defects</span>
                <span className="text-foreground font-bold">{stats?.totalDefects || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Availability</span>
                <span className="text-foreground font-bold">{stats?.availability || 0}%</span>
              </div>
            </div>
          </div>

          <div className="bg-background border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Recent Alerts</h3>
            <div className="space-y-2">
              {reports?.recentAlerts?.slice(0, 3).map((alert) => (
                <div key={alert._id} className="flex items-start gap-2">
                  <span className={`text-lg ${
                    alert.level === 'critical' ? 'text-red-500' :
                    alert.level === 'warning' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`}>
                    {alert.level === 'critical' ? '🔴' : 
                     alert.level === 'warning' ? '🟡' : '🔵'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )) || <p className="text-sm text-muted-foreground">No recent alerts</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-background border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Production Trend</h3>
            {reports?.byDate && <ProductionChart data={reports.byDate} />}
          </div>

          <div className="bg-background border border-border rounded-lg p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Production by Machine</h3>
            {reports?.byMachine && <MachineChart data={reports.byMachine} />}
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Defect Rate Analysis</h3>
          {reports?.byDate && <DefectRateChart data={reports.byDate} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;