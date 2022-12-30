const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

// ->> checkID on tourController.js.
// router.param('id', tourController.checkID);

// Create a checkbody middleware
// Check if body contains the name and price property
// If not send back 400 (bad request)

// ->> Not a Good way To specify Routes.
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// ---------------------------------------------------

// POST /tour/324254fdac/reviews
// GET /tour/324254fdac/reviews
// GET /tour/324254fdac/reviews/78984dabcff

// ->> not needed because we used advance express feature called merge params
// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview
//   );

// ->> Merge Params.
router.use('/:tourId/reviews', reviewRouter);
// IMPORTANT NOTE.
// if https..../api/v1/tours/:tourId/reviews endpoint get hit
// it will run reviewRouter '/' route

// ---------------------------------------------------

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getTourWithin);
// /tours-within/233/center/-40,45/unit/mi
// >>>> (better than)
// /tours-within?distance=233&center=-40,45&unit=mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistance);

router
  .route('/') /* IMPORTANT BETTER WAY */
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
