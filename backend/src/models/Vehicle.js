const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add vehicle title'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Please add brand/manufacturer'],
      trim: true,
      index: true,
    },
    model: {
      type: String,
      required: [true, 'Please add model name'],
      trim: true,
      index: true,
    },
    year: {
      type: Number,
      required: [true, 'Please add model year'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Please add vehicle price'],
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Please add description'],
    },
    condition: {
      type: String,
      enum: ['NEW', 'USED'],
      default: 'NEW',
      index: true,
    },
    mileage: {
      type: Number,
      default: 0,
    },
    rangeKm: {
      type: Number,
      required: [true, 'Please add range in km'],
      index: true,
    },
    batteryCapacityKwh: {
      type: Number,
      required: [true, 'Please add battery capacity in kWh'],
    },
    chargingTimeHours: {
      type: Number,
      required: [true, 'Please add charging time in hours'],
    },
    topSpeedKmh: {
      type: Number,
      default: 150,
    },
    seatingCapacity: {
      type: Number,
      default: 5,
    },
    bodyType: {
      type: String,
      enum: ['SUV', 'Sedan', 'Hatchback', 'Luxury', 'Truck', 'Crossover'],
      required: [true, 'Please add body type'],
      index: true,
    },
    location: {
      type: String,
      required: [true, 'Please add location'],
      index: true,
    },
    features: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
        required: true,
      },
    ],
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: true,
      index: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SOLD'],
      default: 'PENDING_APPROVAL',
      index: true,
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    ratingsAverage: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 1,
      min: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for search
vehicleSchema.index({ title: 'text', brand: 'text', model: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Vehicle', vehicleSchema);
