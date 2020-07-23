const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder.js');
const Bootcamp = require('../models/Bootcamp');

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access Public

exports.getBootCamps = asyncHandler(async (req, res, next) => {
  const allBootcamps = await Bootcamp.find();
  res.status(200).json({
    success: true,
    count: allBootcamps.length,
    data: allBootcamps,
  });
});

// @desc Get a single bootcamp
// @route GET /api/v1/bootcamps/:id
// @access Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const singleBootcamp = await Bootcamp.findById(req.params.id);

  if (!singleBootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, data: singleBootcamp });
});

// @desc Create new bootcamp
// @route POST /api/v1/bootcamps
// @access Public

exports.createBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc Update  bootcam
// @route PUT /api/v1/bootcamps/:id
// @access Private

exports.updateBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

// @desc DELETE  bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access Private

exports.deleteBootCamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc Get bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private

exports.getBootcampsWithinRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // get longitude and latitiude
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  //calculate radius in radians
  // Divide distance by Earth radius
  // Earth Radius = 3,963 mi/6,378km
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
