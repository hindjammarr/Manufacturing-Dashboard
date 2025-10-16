import React from 'react';
import { updateMachineStatus } from '../services/api';

const MachineCard = ({ machine, onUpdate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'stopped':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateMachineStatus(machine._id, newStatus);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error updating machine status:', error);
    }
  };

  return (
    <div className="bg-background border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">{machine.name}</h3>
          <p className="text-sm text-muted-foreground">Line: {machine.line}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(machine.status)}`}>
          {machine.status.toUpperCase()}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => handleStatusChange('running')}
          disabled={machine.status === 'running'}
          className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Start
        </button>
        <button
          onClick={() => handleStatusChange('stopped')}
          disabled={machine.status === 'stopped'}
          className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Stop
        </button>
        <button
          onClick={() => handleStatusChange('maintenance')}
          disabled={machine.status === 'maintenance'}
          className="flex-1 bg-yellow-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Maintenance
        </button>
      </div>
    </div>
  );
};

export default MachineCard;