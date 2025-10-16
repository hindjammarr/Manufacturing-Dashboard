import React from 'react';
import { useQuery } from 'react-query';
import { getProduction } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import ProductionForm from '../components/ProductionForm';
import Sidebar from '../components/Sidebar';

const Production = () => {
  const { socket } = useSocket();

  const { data: productions, refetch } = useQuery('productions', async () => {
    const response = await getProduction();
    return response.data;
  });

  React.useEffect(() => {
    if (socket) {
      socket.on('production:new', () => {
        refetch();
      });

      return () => {
        socket.off('production:new');
      };
    }
  }, [socket, refetch]);

  return (
    <div className="flex min-h-screen bg-muted">
      <Sidebar />
      
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Production Records</h1>
          <p className="text-muted-foreground">Track and manage production data</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <ProductionForm onSuccess={refetch} />
          </div>

          <div className="lg:col-span-2">
            <div className="bg-background border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Recent Records</h2>
              <div className="space-y-4">
                {productions?.slice(0, 10).map((record) => (
                  <div key={record._id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-foreground">{record.machineId.name}</h3>
                        <p className="text-sm text-muted-foreground">Line: {record.machineId.line}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">{record.quantity} units</p>
                        <p className="text-sm text-muted-foreground">{record.defects} defects</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Operator: {record.operatorId.name}</span>
                      <span>{new Date(record.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {(!productions || productions.length === 0) && (
                  <p className="text-center text-muted-foreground py-8">No production records yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Production;