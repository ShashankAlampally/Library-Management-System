const express = require('express')
const router = express.Router()
const {login,signup, adminLogin, adminSignup} = require('../Controllers/userController')

router.post('/login',login)
router.post('/signup',signup)
router.post('/adminLogin',adminLogin)
router.post('/adminSignup',adminSignup)

module.exports = router;