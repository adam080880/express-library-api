const router = require('express').Router()
const transactionMemberController = require('../controllers/transaction_member')

router.post('/', transactionMemberController.booking)

module.exports = router
