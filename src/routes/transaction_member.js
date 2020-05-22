const router = require('express').Router()
const transactionMemberController = require('../controllers/transaction_member')

const needAuth = require('../middlewares/need_auth')
const memberOnly = require('../middlewares/role_member')
const needBio = require('../middlewares/need_biodata')

router.use(needAuth)
router.use(memberOnly)
router.use(needBio)

router.get('/', transactionMemberController.get)
router.post('/', transactionMemberController.booking)

module.exports = router
