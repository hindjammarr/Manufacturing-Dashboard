const ProductionRecord = require('../models/ProductionRecord');
const Machine = require('../models/Machine');
const Alert = require('../models/Alert');

exports.getReports = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const productions = await ProductionRecord.find(query)
      .populate('machineId', 'name line')
      .populate('operatorId', 'name');

    const machines = await Machine.find();
    const alerts = await Alert.find(query).populate('machineId', 'name');

    // Group by machine
    const byMachine = productions.reduce((acc, prod) => {
      const machineName = prod.machineId.name;
      if (!acc[machineName]) {
        acc[machineName] = {
          totalQuantity: 0,
          totalDefects: 0,
          records: 0
        };
      }
      acc[machineName].totalQuantity += prod.quantity;
      acc[machineName].totalDefects += prod.defects;
      acc[machineName].records += 1;
      return acc;
    }, {});

    // Group by date
    const byDate = productions.reduce((acc, prod) => {
      const date = new Date(prod.createdAt).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          totalQuantity: 0,
          totalDefects: 0,
          records: 0
        };
      }
      acc[date].totalQuantity += prod.quantity;
      acc[date].totalDefects += prod.defects;
      acc[date].records += 1;
      return acc;
    }, {});

    res.json({
      summary: {
        totalProductions: productions.length,
        totalMachines: machines.length,
        totalAlerts: alerts.length,
        unresolvedAlerts: alerts.filter(a => !a.resolved).length
      },
      byMachine,
      byDate,
      recentAlerts: alerts.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};