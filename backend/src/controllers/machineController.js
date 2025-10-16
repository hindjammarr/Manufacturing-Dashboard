const Machine = require('../models/Machine');
const Alert = require('../models/Alert');

exports.getAllMachines = async (req, res) => {
  try {
    const machines = await Machine.find().sort({ createdAt: -1 });
    res.json(machines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createMachine = async (req, res) => {
  try {
    const { name, line } = req.body;

    if (!name || !line) {
      return res.status(400).json({ error: 'Name and line are required' });
    }

    const machine = new Machine({ name, line });
    await machine.save();

    // Emit socket event
    if (req.app.get('io')) {
      req.app.get('io').emit('machine:update', machine);
    }

    res.status(201).json(machine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMachineStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['running', 'stopped', 'maintenance'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const machine = await Machine.findByIdAndUpdate(
      id,
      { status, lastHeartbeat: new Date() },
      { new: true }
    );

    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    // Create alert if machine stopped
    if (status === 'stopped') {
      const alert = new Alert({
        machineId: machine._id,
        message: `Machine ${machine.name} has stopped`,
        level: 'warning'
      });
      await alert.save();
    }

    // Emit socket event
    if (req.app.get('io')) {
      req.app.get('io').emit('machine:update', machine);
    }

    res.json(machine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};