// TODO: review / rating / createAt / ref to tour / ref to user

const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating should be more than 1.0'],
      max: [5, 'Rating should be less than 5.0'],
      required: [true, 'Please add review'],
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      require: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      require: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// "this" means a user can only add 1 review in 1 tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  /*
  this.populate({
    path: 'user', // line 26
    select: 'name photo',
  }).populate({
    path: 'tour', // line 21
    select: 'name',
  });
  */
  this.populate({
    path: 'user', // line 26
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // this points to current review
  // 'this.constructor' points to Review
  //  A model who created a 'this(document)'

  this.constructor.calcAverageRatings(this.tour);
});

/*
reviewSchema.pre(/^findOneAnd/, function (next) {
  this.r = this.findOne();
  console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, () => {
  this.r.constructor.calcAverageRatings(this.r.tour);
});
*/
// OR
reviewSchema.post(/^findOneAnd/, async (docs, next) => {
  if (docs) await docs.constructor.calcAverageRatings(docs.tour);
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
