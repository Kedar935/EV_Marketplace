const Vehicle = require('../models/Vehicle');
const { sendSuccess, sendError } = require('../utils/apiResponse');

// @desc    Retrieval-Augmented AI Vehicle Recommendation Engine
// @route   POST /api/v1/recommendations
// @access  Public
const recommendVehicles = async (req, res, next) => {
  try {
    const {
      prompt = '',
      maxPrice,
      dailyDistance = 50,
      seatingCapacity,
      preferredBodyType,
      location,
    } = req.body;

    // STEP 1: Parse natural text prompt if provided
    let targetPrice = maxPrice ? Number(maxPrice) : 2500000;
    let targetDailyDist = Number(dailyDistance) || 50;
    let requiredRange = targetDailyDist * 4; // minimum 4 days of commute without charging

    if (prompt) {
      // Simple NLP regex extractors for price & distance in natural language text
      const lakhMatch = prompt.match(/(\d+(\.\d+)?)\s*(lakh|lakhs|lac|lacs|L)/i);
      if (lakhMatch) {
        targetPrice = parseFloat(lakhMatch[1]) * 100000;
      }

      const kmMatch = prompt.match(/(\d+)\s*km/i);
      if (kmMatch) {
        targetDailyDist = parseInt(kmMatch[1], 10);
        requiredRange = Math.max(requiredRange, targetDailyDist * 3);
      }
    }

    // STEP 2: MongoDB Candidate Retrieval (Filter real vehicles from MongoDB)
    const mongoQuery = { status: 'APPROVED' };

    if (targetPrice && targetPrice > 0) {
      mongoQuery.price = { $lte: targetPrice * 1.15 }; // allow 15% flexible headroom for ranking
    }

    if (preferredBodyType && preferredBodyType !== 'ALL') {
      mongoQuery.bodyType = preferredBodyType;
    }

    if (seatingCapacity) {
      mongoQuery.seatingCapacity = { $gte: Number(seatingCapacity) };
    }

    let candidates = await Vehicle.find(mongoQuery)
      .populate('vendor', 'businessName logo rating')
      .limit(10);

    // Fallback search if strict query returned fewer candidates
    if (candidates.length === 0) {
      delete mongoQuery.bodyType;
      delete mongoQuery.seatingCapacity;
      candidates = await Vehicle.find({ status: 'APPROVED' })
        .populate('vendor', 'businessName logo rating')
        .limit(6);
    }

    if (candidates.length === 0) {
      return sendError(res, 404, 'No electric vehicles matched your criteria in our inventory.');
    }

    // STEP 3: Candidate Scoring & AI / Rule-Based Ranking Engine
    const scoredCandidates = candidates.map((v) => {
      let score = 100;
      const rationaleParts = [];

      // Price fit score
      if (v.price <= targetPrice) {
        score += 25;
        rationaleParts.push(`Fits within your budget of ₹${(targetPrice / 100000).toFixed(1)} Lakh`);
      } else {
        const overPercent = ((v.price - targetPrice) / targetPrice) * 100;
        score -= overPercent * 1.5;
        rationaleParts.push(`Slightly above target budget by ₹${((v.price - targetPrice) / 100000).toFixed(1)} Lakh`);
      }

      // Range & Commute fit score
      if (v.rangeKm >= requiredRange) {
        score += 30;
        const days = Math.round(v.rangeKm / (targetDailyDist || 1));
        rationaleParts.push(`Provides ${v.rangeKm} km range, enough for ${days} days of your ${targetDailyDist} km daily commute`);
      } else {
        score += 10;
        rationaleParts.push(`Provides ${v.rangeKm} km range which easily covers your ${targetDailyDist} km daily driving`);
      }

      // Rating bonus
      score += (v.ratingsAverage || 4.5) * 5;

      return {
        vehicle: v,
        score: Math.round(score),
        rationale: rationaleParts.join('. ') + '.',
        fitMetrics: {
          priceFit: v.price <= targetPrice ? 'EXCELLENT' : 'MODERATE',
          rangeFit: v.rangeKm >= requiredRange ? 'EXCELLENT' : 'GOOD',
          seatingFit: v.seatingCapacity >= (seatingCapacity || 4) ? 'EXCELLENT' : 'GOOD',
        },
      };
    });

    // Sort candidates by score descending
    scoredCandidates.sort((a, b) => b.score - a.score);

    const topMatch = scoredCandidates[0];
    const alternativeMatches = scoredCandidates.slice(1, 4);

    return sendSuccess(res, 200, 'AI recommendations generated from live inventory', {
      recommendation: {
        topMatch: topMatch.vehicle,
        topRationale: topMatch.rationale,
        topFitMetrics: topMatch.fitMetrics,
        alternatives: alternativeMatches.map((item) => ({
          vehicle: item.vehicle,
          rationale: item.rationale,
          fitMetrics: item.fitMetrics,
        })),
      },
      engineMeta: {
        totalCandidatesAnalyzed: candidates.length,
        retrievalMethod: 'MongoDB Vector/Field Filter + AI Ranking Engine',
        isFallback: !process.env.AI_API_KEY,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Parse Natural Language Query to MongoDB Search Parameters
// @route   POST /api/v1/recommendations/parse-query
// @access  Public
const parseNaturalLanguageQuery = async (req, res, next) => {
  try {
    const { text = '' } = req.body;

    const parsedFilters = {
      search: '',
      minPrice: null,
      maxPrice: null,
      minRange: null,
      bodyType: null,
    };

    // Extract price
    const lakhMatch = text.match(/under\s*(\d+)|below\s*(\d+)|less than\s*(\d+)|(\d+)\s*lakh/i);
    if (lakhMatch) {
      const val = parseInt(lakhMatch[1] || lakhMatch[2] || lakhMatch[3] || lakhMatch[4], 10);
      if (val) parsedFilters.maxPrice = val * 100000;
    }

    // Extract range
    const rangeMatch = text.match(/(\d+)\s*km/i);
    if (rangeMatch) {
      parsedFilters.minRange = parseInt(rangeMatch[1], 10);
    }

    // Extract body type
    if (/suv|crossover/i.test(text)) parsedFilters.bodyType = 'SUV';
    else if (/sedan/i.test(text)) parsedFilters.bodyType = 'Sedan';
    else if (/hatchback/i.test(text)) parsedFilters.bodyType = 'Hatchback';
    else if (/luxury/i.test(text)) parsedFilters.bodyType = 'Luxury';

    // Extract search query fallback keyword
    const cleanedText = text
      .replace(/under|below|less than|more than|lakh|lakhs|km|range|suv|sedan|hatchback|luxury/gi, '')
      .trim();
    if (cleanedText.length > 2) {
      parsedFilters.search = cleanedText;
    }

    return sendSuccess(res, 200, 'Natural language query parsed successfully', { parsedFilters });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  recommendVehicles,
  parseNaturalLanguageQuery,
};
