const express = require('express');
const {
  getBootCamps,
  getBootcamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootcampsWithinRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/advancedResults');

// Include other resource router
const courseRouter = require('./courses');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Re-route into other respurces router
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsWithinRadius);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootCamps)
  .post(protect, authorize('publisher', 'admin'),createBootCamp);
router.route('/:id/photo').put(protect, authorize('publisher', 'admin'),bootcampPhotoUpload);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootCamp)
  .delete(protect, authorize('publisher', 'admin'),deleteBootCamp);

module.exports = router;
