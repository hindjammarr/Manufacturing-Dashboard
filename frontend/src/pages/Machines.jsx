import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getMachines, createMachine } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import MachineCard from '../components/MachineCard';
import Sidebar from '../components/Sidebar';

const Machines = () => {
  const { socket } = useSocket();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', line: '' });

  const { data: machines, refetch } = useQuery('machines', async () => {
    const response = await getMachines();
    return response.data;
  });

  React.useEffect(() => {
    if (socket) {
      socket.on('machine:update', () => {
        refetch();
      });

      return () => {
        socket.off('machine:update');
      };
    }
  }, [socket, refetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMachine(formData);
      setFormData({ name: '', line: '' });
      setShowForm(false);
      refetch();
    } catch (error) {
      console.error('Error creating machine:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="flex min-h-screen bg-muted">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Machines</h1>
            <p className="text-muted-foreground">Manage and monitor production machines</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            {showForm ? 'Cancel' : '+ Add Machine'}
          </button>
        </div>

        {showForm && (
          <div className="bg-background border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-4">Add New Machine</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Machine Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., CNC Mill 01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Production Line</label>
                  <input
                    type="text"
                    name="line"
                    value={formData.line}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g., Line A"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                Create Machine
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines?.map((machine) => (
            <MachineCard key={machine._id} machine={machine} onUpdate={refetch} />
          ))}
          {(!machines || machines.length === 0) && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">No machines found. Add your first machine to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Machines;