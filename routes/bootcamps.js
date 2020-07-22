const express = require('express');
const {
  getBootCamps,
  getBootcamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
} = require('../controllers/bootcamps');

const router = express.Router();

router.route('/').get(getBootCamps).post(createBootCamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootCamp)
  .delete(deleteBootCamp);

module.exports = router;
