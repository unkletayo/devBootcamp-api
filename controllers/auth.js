const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const bcrypt = require('bcryptjs')
/**
 * @desc Rehister User
 * @route Get /api/v1/auth/register
 * @access Public
 */ 


exports.register = asyncHandler(async (req, res, next) => {
const {name, email, password, role} = req.body;


const user = await User.create({
  name, email, password, role
})

sendTokenResponse(user, 200, res);
})


exports.login = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body;
  
  if (!email || !password){
    return next(new ErrorResponse("Please provide an email and password", 400))
  }

  // check if user exist 
  const user = await User.findOne({email}).select("+password")

  if(!user){
    return next(new ErrorResponse("Invalid Email", 401))

  }
  // check if password matches 
  const isMatched = await user.matchPassword(password)

  if(!isMatched){
    return next(new ErrorResponse("Invalid Password", 401))
  }

  sendTokenResponse(user, 200, res)
})

// Get token from model, create cookie and send response 
const sendTokenResponse = (user,statusCode, res) => {
  const token = user.getSignedJwtToken()

  // create cookie 
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24*60*60*1000),
    httpOnly: true
  }

  if(process.env.NODE_ENV === 'production'){
    options.secure = true
  }

  res.status(statusCode).cookie('token', token, options).json({success: true, token})
  
}
  


