const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please add rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please add review comment'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting multiple reviews for same vehicle & order
reviewSchema.index({ vehicle: 1, user: 1, order: 1 }, { unique: true });

// Static method to calculate average rating and update vehicle
reviewSchema.statics.getAverageRating = async function (vehicleId) {
  const obj = await this.aggregate([
    { $match: { vehicle: vehicleId } },
    {
      $group: {
        _id: '$vehicle',
        ratingsAverage: { $avg: '$rating' },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  try {
    if (obj.length > 0) {
      await this.model('Vehicle').findByIdAndUpdate(vehicleId, {
        ratingsAverage: obj[0].ratingsAverage,
        ratingsQuantity: obj[0].ratingsQuantity,
      });
    } else {
      await this.model('Vehicle').findByIdAndUpdate(vehicleId, {
        ratingsAverage: 5.0,
        ratingsQuantity: 0,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.getAverageRating(this.vehicle);
});

module.exports = mongoose.model('Review', reviewSchema);
