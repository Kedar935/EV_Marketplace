const Vehicle = require('../models/Vehicle');
const Category = require('../models/Category');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Get all vehicles with search, filters, sorting & pagination
// @route   GET /api/v1/vehicles
// @access  Public
const getVehicles = async (req, res, next) => {
  try {
    const {
      search,
      brand,
      model,
      minPrice,
      maxPrice,
      minRange,
      maxRange,
      minBattery,
      maxBattery,
      minYear,
      maxYear,
      bodyType,
      condition,
      location,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { status: 'APPROVED' };

    // Search query across brand, model, title, description, location
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { brand: searchRegex },
        { model: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
      ];
    }

    if (brand) {
      query.brand = new RegExp(`^${brand}$`, 'i');
    }

    if (model) {
      query.model = new RegExp(model, 'i');
    }

    if (bodyType && bodyType !== 'ALL') {
      query.bodyType = bodyType;
    }

    if (condition && condition !== 'ALL') {
      query.condition = condition;
    }

    if (location) {
      query.location = new RegExp(location, 'i');
    }

    // Range filters
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minRange || maxRange) {
      query.rangeKm = {};
      if (minRange) query.rangeKm.$gte = Number(minRange);
      if (maxRange) query.rangeKm.$lte = Number(maxRange);
    }

    if (minBattery || maxBattery) {
      query.batteryCapacityKwh = {};
      if (minBattery) query.batteryCapacityKwh.$gte = Number(minBattery);
      if (maxBattery) query.batteryCapacityKwh.$lte = Number(maxBattery);
    }

    if (minYear || maxYear) {
      query.year = {};
      if (minYear) query.year.$gte = Number(minYear);
      if (maxYear) query.year.$lte = Number(maxYear);
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'range_desc') sortOptions = { rangeKm: -1 };
    else if (sort === 'rating_desc') sortOptions = { ratingsAverage: -1 };
    else if (sort === 'year_desc') sortOptions = { year: -1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query)
      .populate('vendor', 'businessName logo rating')
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    // Get filter meta options for frontend UI dropdowns
    const brands = await Vehicle.distinct('brand', { status: 'APPROVED' });
    const locations = await Vehicle.distinct('location', { status: 'APPROVED' });
    const bodyTypes = await Vehicle.distinct('bodyType', { status: 'APPROVED' });

    return sendSuccess(res, 200, 'Vehicles retrieved successfully', {
      vehicles,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        limit: limitNum,
      },
      filtersMeta: {
        brands,
        locations,
        bodyTypes,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured vehicles for homepage
// @route   GET /api/v1/vehicles/featured
// @access  Public
const getFeaturedVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ status: 'APPROVED', isFeatured: true })
      .populate('vendor', 'businessName logo rating')
      .sort({ ratingsAverage: -1, createdAt: -1 })
      .limit(8);

    // Fallback if no specific vehicles are flagged isFeatured
    let result = vehicles;
    if (vehicles.length === 0) {
      result = await Vehicle.find({ status: 'APPROVED' })
        .populate('vendor', 'businessName logo rating')
        .sort({ ratingsAverage: -1, price: 1 })
        .limit(8);
    }

    return sendSuccess(res, 200, 'Featured vehicles retrieved', { vehicles: result });
  } catch (error) {
    next(error);
  }
};

// @desc    Get vehicle details by ID
// @route   GET /api/v1/vehicles/:id
// @access  Public
const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id)
      .populate('vendor', 'businessName description logo contactPhone contactEmail rating totalSales')
      .populate('category', 'name slug');

    if (!vehicle) {
      return sendError(res, 404, 'Vehicle not found', 'NOT_FOUND');
    }

    // Get related vehicles from same category or brand
    const related = await Vehicle.find({
      _id: { $ne: vehicle._id },
      status: 'APPROVED',
      $or: [{ brand: vehicle.brand }, { bodyType: vehicle.bodyType }],
    })
      .limit(4)
      .select('title brand model year price rangeKm batteryCapacityKwh images ratingsAverage location condition');

    return sendSuccess(res, 200, 'Vehicle details retrieved', { vehicle, related });
  } catch (error) {
    next(error);
  }
};

// @desc    Compare up to 4 vehicles side-by-side with automatic highlight badges
// @route   POST /api/v1/vehicles/compare
// @access  Public
const compareVehicles = async (req, res, next) => {
  try {
    const { vehicleIds } = req.body;

    if (!vehicleIds || !Array.isArray(vehicleIds) || vehicleIds.length === 0) {
      return sendError(res, 400, 'Please provide an array of vehicle IDs to compare');
    }

    if (vehicleIds.length > 4) {
      return sendError(res, 400, 'Maximum 4 vehicles can be compared simultaneously');
    }

    const vehicles = await Vehicle.find({
      _id: { $in: vehicleIds },
    }).populate('vendor', 'businessName rating');

    if (vehicles.length === 0) {
      return sendError(res, 404, 'No vehicles found for given IDs');
    }

    // Calculate highlights
    let bestPriceId = null;
    let bestRangeId = null;
    let fastestChargingId = null;
    let bestRatedId = null;
    let bestValueId = null;

    let minPrice = Infinity;
    let maxRange = -1;
    let minChargeTime = Infinity;
    let maxRating = -1;
    let bestValueScore = -Infinity;

    vehicles.forEach((v) => {
      if (v.price < minPrice) {
        minPrice = v.price;
        bestPriceId = v._id.toString();
      }
      if (v.rangeKm > maxRange) {
        maxRange = v.rangeKm;
        bestRangeId = v._id.toString();
      }
      if (v.chargingTimeHours < minChargeTime) {
        minChargeTime = v.chargingTimeHours;
        fastestChargingId = v._id.toString();
      }
      if (v.ratingsAverage > maxRating) {
        maxRating = v.ratingsAverage;
        bestRatedId = v._id.toString();
      }

      // Value score formula: (Range in km / Price in Lakhs) * rating
      const priceInLakhs = v.price / 100000;
      const score = (v.rangeKm / (priceInLakhs || 1)) * (v.ratingsAverage || 4);
      if (score > bestValueScore) {
        bestValueScore = score;
        bestValueId = v._id.toString();
      }
    });

    const highlights = {
      bestPrice: bestPriceId,
      bestRange: bestRangeId,
      fastestCharging: fastestChargingId,
      bestRated: bestRatedId,
      bestOverallValue: bestValueId,
    };

    return sendSuccess(res, 200, 'Vehicle comparison generated', {
      vehicles,
      highlights,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVehicles,
  getFeaturedVehicles,
  getVehicleById,
  compareVehicles,
};
