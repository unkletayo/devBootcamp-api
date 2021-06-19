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
const { protect } = require('../middleware/auth');

const router = express.Router();

// Re-route into other respurces router
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsWithinRadius);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootCamps)
  .post(protect,createBootCamp);
router.route('/:id/photo').put(protect,bootcampPhotoUpload);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect,updateBootCamp)
  .delete(protect,deleteBootCamp);

module.exports = router;
