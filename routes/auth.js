const express = require('express')
const  {register, login, getMe, forgotPassword} = require('../controlLers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect,  getMe)
router.post('/forgot-password', forgotPassword)

module.exports = router