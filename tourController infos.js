// const fs = require('fs');
const Tour = require('./models/tourModel');
const APIFeatures = require('./utils/apiFeatures');
const catchAsync = require('./utils/catchAsync');
const AppError = require('./utils/appError');
const factory = require('./controllers/handlerFactory');

/*
// ->> reading file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
*/

/*
// ->> MIDDLEWARE EXAMPLE
exports.checkID = (req, res, next, val) => {
  console.log('Tour id is:', val);
  if (+req.params.id > tours.length - 1) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  next();
};
*/

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  // sort=-ratingAverage,price
  req.query.sort = '-ratingAverage,price';
  // req.query.fields = '-__v';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // NOTE: we are got rid of try catch blocks because,
  //        we created "catchAsync function"
  // ->> IMPORTANT QUERY/Query
  // try {
  /* replaced section 1, 2, 3, 4 to class methods  */

  // console.log(req.requestTime);
  // ->> requestTime is created in middleware.

  // console.log(req.query);
  // ->> BUILD QUERY
  ///// ->> 1A) Filtering /////
  /*
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    // 'example1' >> ...../api/tours?time=10&get=ABC
    // { time: 10, get: ABC } // this will be created by 'example1'.

    ///// 2A) Advanced filtering /////
    // to achieve: { difficulty: 'easy', duration: {$gte: 5} }
    //
    // [in postman] ../tours?duration[gte]=5&difficulty=easy
    // we got this: { difficulty: 'easy', duration: {gte: 5} }

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|lt|lte|gte)\b/g, (match) => `$${match}`);
    */

  /*
    //////////////           //////////////////
    //   GOOD TO KNOW  IMPORTANT NOTE REMEMBER  GOOD TO KNOW .
    
    // What "NOT awaiting Tour.find()" will do??
    VISUAL: >>> going to database >>> filtering while fetching data from database >>> FETCHED: after filtering outputing data to client
    
    // What "await Tour.find()" will do?
    VISUAL : >>> going to database >>> FETCHED: output data to client[ if we have filtering code it will cause error(404) ]
    
    //////////////           //////////////////
    */
  /*
    let query = Tour.find(JSON.parse(queryStr));
    // OR
    // const query = await Tour.find()
    //   .where('duration')
    //   .lt(5)   // OR .equals() OR .lte()
    //   .where('difficulty')
    //   .equals('easy');
    //
    */

  ///// ->> 2) Sorting /////
  /*
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      // sort("price ratingAverage")
    } else {
      query = query.sort('-createdAt name');
    }
    */

  ///// ->> 3) Field limiting /////
  /*
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }
    */

  ///// ->> 4) Pagination /////
  /*
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = limit * (page - 1);

    // page=3&limit=10, [page1: 1-10], [page2: 11-20], [page3: 21-30]
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();

      if (skip >= numTours) throw new Error('This page does not exits');
    }
    */

  // ->> EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  // ->> this is how our query looks: query.sort().select().skip().limit()
  const tours = await features.query;
  // ->> SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
  /*
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
  */
});

exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

/*
exports.getTour = catchAsync(async (req, res, next) => {
  // try {
  // console.log(req.params);
  // const id = +req.params.id;

  // ->> Pre & Post hook

  console.log('pre finsihed');
  console.log('post start');


  const tour = await Tour.findById(req.params.id).populate('reviews');
  // Tour.findOne({ _id: req.params.id })

  // console.log('post finsihed');

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});
*/

/*
exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });

  // try {
  //   // const newTour = new Tour({})
  //   // newTour.save();


  //   // res.send('Done! :)');
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});
*/

/*
exports.updateTour = catchAsync(async (req, res, next) => {
  // try {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});
*/

/*
exports.deleteTour = catchAsync(async (req, res, next) => {
  // try {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
    // message: 'Data Deleted!',
  });

  // } catch (err) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: err,
  //   });
  // }
});
*/

exports.getTourStats = catchAsync(async (req, res, next) => {
  // try {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        // _id: '$ratingsAverage',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRatng: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
  /*
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
  */
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
  /*
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
  */
});

// .........................................................
// IMPORTANT  NEW .
// ..ABOUT PARCEL configuration..

/* package.json */
// {
// "name": "natours",
// "version": "1.0.0",
// "description": "",
// ->> "source": "public/js/index.js",
// ->> "main": "public/js/bundle.js",

// "scripts": {
//   "start:dev": "nodemon server.js",
//   "start": "nodemon server.js",
//   "start:prod": "NODE_ENV=production nodemon server.js",
//   "debug": "ndb server.js",
// ->>  "watch:js": "parcel watch",
//   "build:js": "parcel watch"
// }

// Parcel watch "source" by default.
// after watching it will convert "source" file [ie. public/js/index.js] to understandable code and that understandable code will be on "main" [i.e. public/js/bundle.js]

// .........................................
// ->> we can say:
// "watch:js": "parcel watch ./public/js/index.js --out-dir ./public/js --out-file bundle.js"
// but "main" should be app.js
// OR line 373, 374 & 381
