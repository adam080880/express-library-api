const router = require('express').Router()
const authController = require('../controllers/auth')

const needAuth = require('../middlewares/need_auth')
const memberOnly = require('../middlewares/role_member')

router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/complete_registration', needAuth, memberOnly, authController.completeRegistration)

module.exports = router
