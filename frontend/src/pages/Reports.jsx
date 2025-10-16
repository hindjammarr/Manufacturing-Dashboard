import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getReports } from '../services/api';
import Sidebar from '../components/Sidebar';

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const { data: reports, refetch } = useQuery(['reports', dateRange], async () => {
    const params = {};
    if (dateRange.startDate) params.startDate = dateRange.startDate;
    if (dateRange.endDate) params.endDate = dateRange.endDate;
    const response = await getReports(params);
    return response.data;
  });

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value
    });
  };

  const handleFilter = () => {
    refetch();
  };

  return (
    <div className="flex min-h-screen bg-muted">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive production insights</p>
        </div>

        <div className="bg-background border border-border rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Filter Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFilter}
                className="w-full bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-background border border-border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Productions</h3>
            <p className="text-3xl font-bold text-foreground">{reports?.summary?.totalProductions || 0}</p>
          </div>
          <div className="bg-background border border-border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Machines</h3>
            <p className="text-3xl font-bold text-foreground">{reports?.summary?.totalMachines || 0}</p>
          </div>
          <div className="bg-background border border-border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Alerts</h3>
            <p className="text-3xl font-bold text-foreground">{reports?.summary?.totalAlerts || 0}</p>
          </div>
          <div className="bg-background border border-border rounded-lg p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Unresolved Alerts</h3>
            <p className="text-3xl font-bold text-destructive">{reports?.summary?.unresolvedAlerts || 0}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-background border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Production by Machine</h2>
            <div className="space-y-3">
              {reports?.byMachine && Object.entries(reports.byMachine).map(([machine, data]) => (
                <div key={machine} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-foreground">{machine}</h3>
                    <span className="text-lg font-bold text-primary">{data.totalQuantity} units</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Records</p>
                      <p className="font-medium text-foreground">{data.records}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Defects</p>
                      <p className="font-medium text-destructive">{data.totalDefects}</p>
                    </div>
                  </div>
                </div>
              ))}
              {(!reports?.byMachine || Object.keys(reports.byMachine).length === 0) && (
                <p className="text-center text-muted-foreground py-8">No data available</p>
              )}
            </div>
          </div>

          <div className="bg-background border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Production by Date</h2>
            <div className="space-y-3">
              {reports?.byDate && Object.entries(reports.byDate).slice(0, 7).map(([date, data]) => (
                <div key={date} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-foreground">{new Date(date).toLocaleDateString()}</h3>
                    <span className="text-lg font-bold text-primary">{data.totalQuantity} units</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Records</p>
                      <p className="font-medium text-foreground">{data.records}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Defects</p>
                      <p className="font-medium text-destructive">{data.totalDefects}</p>
                    </div>
                  </div>
                </div>
              ))}
              {(!reports?.byDate || Object.keys(reports.byDate).length === 0) && (
                <p className="text-center text-muted-foreground py-8">No data available</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Alerts</h2>
          <div className="space-y-3">
            {reports?.recentAlerts?.map((alert) => (
              <div key={alert._id} className="border border-border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className={`text-2xl ${
                    alert.level === 'critical' ? 'text-red-500' :
                    alert.level === 'warning' ? 'text-yellow-500' :
                    'text-blue-500'
                  }`}>
                    {alert.level === 'critical' ? '🔴' : 
                     alert.level === 'warning' ? '🟡' : '🔵'}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-foreground">{alert.machineId?.name || 'Unknown Machine'}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        alert.resolved 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {alert.resolved ? 'Resolved' : 'Active'}
                      </span>
                    </div>
                    <p className="text-foreground mb-1">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {(!reports?.recentAlerts || reports.recentAlerts.length === 0) && (
              <p className="text-center text-muted-foreground py-8">No alerts found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;