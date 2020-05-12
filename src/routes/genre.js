const router = require('express').Router()
const genreController = require('../controllers/genre')

const needAuth = require('../middlewares/need_auth')
const adminOnly = require('../middlewares/role_admin')

router.use(needAuth)
router.use(adminOnly)

router.get('/', genreController.get)
router.post('/', genreController.post)
router.patch('/:id', genreController.patch)
router.delete('/:id', genreController.delete)

module.exports = router
