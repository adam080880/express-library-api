const router = require('express').Router()
const authorController = require('../controllers/author')

const needAuth = require('../middlewares/need_auth')
const adminOnly = require('../middlewares/role_admin')

router.use(needAuth)
router.use(adminOnly)

router.get('/', authorController.get)
router.post('/', authorController.post)
router.patch('/:id', authorController.patch)
router.delete('/:id', authorController.delete)

module.exports = router
