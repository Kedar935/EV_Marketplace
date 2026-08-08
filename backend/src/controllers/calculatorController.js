const { sendSuccess } = require('../utils/apiResponse');

// @desc    Calculate EV Range & Daily Consumption
// @route   POST /api/v1/calculators/range
// @access  Public
const calculateRangeUsage = async (req, res, next) => {
  try {
    const { dailyDistance = 50, batteryCapacity = 60, vehicleRange = 400 } = req.body;

    const distance = Number(dailyDistance);
    const capacity = Number(batteryCapacity);
    const totalRange = Number(vehicleRange);

    const consumptionPerKm = capacity / (totalRange || 1); // kWh/km
    const dailyKwhUsed = Math.round(distance * consumptionPerKm * 100) / 100;
    const percentBatteryUsedDaily = Math.min(100, Math.round((dailyKwhUsed / capacity) * 100));
    const daysBetweenCharges = Math.round((totalRange / (distance || 1)) * 10) / 10;
    const monthlyDistance = distance * 30;
    const monthlyKwhUsed = Math.round(monthlyDistance * consumptionPerKm);

    return sendSuccess(res, 200, 'Range calculation generated', {
      inputs: { dailyDistance: distance, batteryCapacity: capacity, vehicleRange: totalRange },
      results: {
        dailyKwhUsed,
        percentBatteryUsedDaily,
        daysBetweenCharges,
        monthlyDistance,
        monthlyKwhUsed,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate Charging Cost
// @route   POST /api/v1/calculators/charging-cost
// @access  Public
const calculateChargingCost = async (req, res, next) => {
  try {
    const {
      batteryCapacity = 60,
      electricityPrice = 8, // ₹ per kWh
      vehicleRange = 400,
      monthlyDistance = 1500,
    } = req.body;

    const capacity = Number(batteryCapacity);
    const tariff = Number(electricityPrice);
    const range = Number(vehicleRange);
    const monthlyDist = Number(monthlyDistance);

    const fullChargeCostHome = Math.round(capacity * tariff);
    const fullChargeCostFast = Math.round(capacity * (tariff * 2.2)); // Fast DC charging premium
    const costPerKmHome = Math.round((fullChargeCostHome / (range || 1)) * 100) / 100;
    const monthlyChargingCostHome = Math.round(costPerKmHome * monthlyDist);
    const annualChargingCostHome = monthlyChargingCostHome * 12;

    return sendSuccess(res, 200, 'Charging cost calculation generated', {
      inputs: { batteryCapacity: capacity, electricityPrice: tariff, vehicleRange: range, monthlyDistance: monthlyDist },
      results: {
        fullChargeCostHome,
        fullChargeCostFast,
        costPerKmHome,
        monthlyChargingCostHome,
        annualChargingCostHome,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Calculate 5-Year Ownership TCO Savings (EV vs Petrol/Diesel)
// @route   POST /api/v1/calculators/tco
// @access  Public
const calculateTcoSavings = async (req, res, next) => {
  try {
    const {
      evPrice = 1500000,
      icePrice = 1300000,
      annualKm = 15000,
      electricityPrice = 8,
      batteryCapacity = 60,
      evRange = 400,
      fuelPrice = 100, // Petrol ₹/L
      iceMileage = 14, // km/L
      ownershipYears = 5,
    } = req.body;

    const evPriceNum = Number(evPrice);
    const icePriceNum = Number(icePrice);
    const kmPerYear = Number(annualKm);
    const years = Number(ownershipYears);

    // EV Running Costs
    const evCostPerKm = (Number(batteryCapacity) * Number(electricityPrice)) / Number(evRange);
    const evAnnualFuelCost = evCostPerKm * kmPerYear;
    const evAnnualMaintenance = 8000; // Low EV maintenance
    const evTotalRunningCost = (evAnnualFuelCost + evAnnualMaintenance) * years;
    const evTotalTco = evPriceNum + evTotalRunningCost;

    // ICE (Petrol) Running Costs
    const iceCostPerKm = Number(fuelPrice) / Number(iceMileage);
    const iceAnnualFuelCost = iceCostPerKm * kmPerYear;
    const iceAnnualMaintenance = 25000; // ICE oil changes, filters, spark plugs
    const iceTotalRunningCost = (iceAnnualFuelCost + iceAnnualMaintenance) * years;
    const iceTotalTco = icePriceNum + iceTotalRunningCost;

    const netSavings = Math.round(iceTotalTco - evTotalTco);
    const annualFuelSavings = Math.round(iceAnnualFuelCost - evAnnualFuelCost);

    return sendSuccess(res, 200, 'TCO comparison generated', {
      inputs: { evPrice: evPriceNum, icePrice: icePriceNum, annualKm: kmPerYear, years },
      results: {
        ev: {
          purchasePrice: evPriceNum,
          annualFuelCost: Math.round(evAnnualFuelCost),
          annualMaintenance: evAnnualMaintenance,
          totalRunningCost: Math.round(evTotalRunningCost),
          totalTco: Math.round(evTotalTco),
          costPerKm: Math.round(evCostPerKm * 100) / 100,
        },
        ice: {
          purchasePrice: icePriceNum,
          annualFuelCost: Math.round(iceAnnualFuelCost),
          annualMaintenance: iceAnnualMaintenance,
          totalRunningCost: Math.round(iceTotalRunningCost),
          totalTco: Math.round(iceTotalTco),
          costPerKm: Math.round(iceCostPerKm * 100) / 100,
        },
        netSavings,
        annualFuelSavings,
        paybackPeriodYears: Math.round(((evPriceNum - icePriceNum) / (annualFuelSavings + 17000)) * 10) / 10,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  calculateRangeUsage,
  calculateChargingCost,
  calculateTcoSavings,
};
