const ProductionRecord = require('../models/ProductionRecord');
const Machine = require('../models/Machine');

exports.getAllProduction = async (req, res) => {
  try {
    const records = await ProductionRecord.find()
      .populate('machineId', 'name line')
      .populate('operatorId', 'name')
      .sort({ createdAt: -1 });
    
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduction = async (req, res) => {
  try {
    const { machineId, quantity, defects, startTime, endTime } = req.body;

    if (!machineId || !quantity || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const machine = await Machine.findById(machineId);
    if (!machine) {
      return res.status(404).json({ error: 'Machine not found' });
    }

    const record = new ProductionRecord({
      machineId,
      operatorId: req.user._id,
      quantity,
      defects: defects || 0,
      startTime,
      endTime
    });

    await record.save();
    await record.populate('machineId', 'name line');
    await record.populate('operatorId', 'name');

    // Emit socket event
    if (req.app.get('io')) {
      req.app.get('io').emit('production:new', record);
    }

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductionStats = async (req, res) => {
  try {
    const records = await ProductionRecord.find();

    const totalQuantity = records.reduce((sum, r) => sum + r.quantity, 0);
    const totalDefects = records.reduce((sum, r) => sum + r.defects, 0);
    const totalRecords = records.length;

    const defectRate = totalQuantity > 0 ? (totalDefects / totalQuantity) * 100 : 0;
    const qualityRate = 100 - defectRate;

    // Calculate OEE (simplified version)
    const totalTime = records.reduce((sum, r) => {
      return sum + (new Date(r.endTime) - new Date(r.startTime));
    }, 0);

    const totalHours = totalTime / (1000 * 60 * 60);
    const idealRate = 100; // units per hour (example)
    const availability = totalHours > 0 ? (totalQuantity / (idealRate * totalHours)) * 100 : 0;
    const oee = (availability * qualityRate) / 100;

    res.json({
      totalQuantity,
      totalDefects,
      totalRecords,
      defectRate: defectRate.toFixed(2),
      qualityRate: qualityRate.toFixed(2),
      oee: oee.toFixed(2),
      availability: availability.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};