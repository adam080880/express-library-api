const router = require('express').Router()
const authorController = require('../controllers/author')

const needAuth = require('../middlewares/need_auth')
const adminOnly = require('../middlewares/role_admin')

router.use(needAuth)

router.get('/', authorController.get)
router.post('/', adminOnly, authorController.post)
router.patch('/:id', adminOnly, authorController.patch)
router.delete('/:id', adminOnly, authorController.delete)

module.exports = router
