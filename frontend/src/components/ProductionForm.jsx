import React, { useState, useEffect } from 'react';
import { getMachines, createProduction } from '../services/api';

const ProductionForm = ({ onSuccess }) => {
  const [machines, setMachines] = useState([]);
  const [formData, setFormData] = useState({
    machineId: '',
    quantity: '',
    defects: '',
    startTime: '',
    endTime: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      const response = await getMachines();
      setMachines(response.data);
    } catch (error) {
      console.error('Error loading machines:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProduction(formData);
      setFormData({
        machineId: '',
        quantity: '',
        defects: '',
        startTime: '',
        endTime: ''
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating production record:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-background border border-border rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-foreground mb-4">Add Production Record</h2>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Machine</label>
        <select
          name="machineId"
          value={formData.machineId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select a machine</option>
          {machines.map((machine) => (
            <option key={machine._id} value={machine._id}>
              {machine.name} - {machine.line}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          min="0"
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Defects</label>
        <input
          type="number"
          name="defects"
          value={formData.defects}
          onChange={handleChange}
          min="0"
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Start Time</label>
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">End Time</label>
        <input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? 'Adding...' : 'Add Production Record'}
      </button>
    </form>
  );
};

export default ProductionForm;