const router = require('express').Router()
const transactionController = require('../controllers/transaction')

const needAuth = require('../middlewares/need_auth')
const adminOnly = require('../middlewares/role_admin')

router.use(needAuth)
router.use(adminOnly)

router.get('/', transactionController.get)
router.patch('/borrow/:id', transactionController.toBorrow)
router.patch('/return/:id', transactionController.toReturned)

module.exports = router
