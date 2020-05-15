const router = require('express').Router()
const authController = require('../controllers/auth')
const userController = require('../controllers/user')

const needAuth = require('../middlewares/need_auth')

router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/complete_registration', needAuth, authController.completeRegistration)
router.get('/profile', needAuth, userController.find)

module.exports = router
