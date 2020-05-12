const router = require('express').Router()
const transactionController = require('../controllers/transaction')

router.patch('/borrow/:id', transactionController.toBorrow)
router.patch('/return/:id', transactionController.toReturned)

module.exports = router
