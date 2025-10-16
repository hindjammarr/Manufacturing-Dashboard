import React from 'react';

const KpiCard = ({ title, value, unit, trend, icon }) => {
  return (
    <div className="bg-background border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {unit && <p className="text-sm text-muted-foreground mt-1">{unit}</p>}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span>{trend > 0 ? '↑' : '↓'}</span>
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;