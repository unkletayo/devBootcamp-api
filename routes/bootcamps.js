const express = require('express');
const {
  getBootCamps,
  getBootcamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootcampsWithinRadius,
} = require('../controllers/bootcamps');

const router = express.Router();

router.route('/radius/:zipcode/:distance').get(getBootcampsWithinRadius);

router.route('/').get(getBootCamps).post(createBootCamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);

module.exports = router;
