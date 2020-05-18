const router = require('express').Router()
const authorController = require('../controllers/author')

const needAuth = require('../middlewares/need_auth')
const adminOnly = require('../middlewares/role_admin')

router.get('/', authorController.get)
router.post('/', needAuth, adminOnly, authorController.post)
router.patch('/:id', needAuth, adminOnly, authorController.patch)
router.delete('/:id', needAuth, adminOnly, authorController.delete)

module.exports = router
