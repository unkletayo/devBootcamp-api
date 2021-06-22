const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a a title for the review'],
    maxlength: 100
  },
  text: {
    type: String,
    required: [true, 'Please add a description'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add a rating between 1 and 10'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    require: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: true,
  },
});

// Prevent user from submitting one than ine review per bootcamp
ReviewSchema.index({bootcamp: 1, user: 1}, {unique: true})



// static method to get average of cost tuition
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: (obj[0].averageRating / 10) * 10,
    });
  } catch (err) {
    console.log(err);
  }
};

// call getAverage middleware after save
ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.bootcamp);
});

// call getAverage middleware before delete
ReviewSchema.post('remove', function () {
  this.constructor.getAverageRating(this.bootcamp);
});


module.exports = mongoose.model('Review', ReviewSchema);
