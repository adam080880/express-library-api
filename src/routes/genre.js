const router = require('express').Router()
const genreController = require('../controllers/genre')

const needAuth = require('../middlewares/need_auth')
const adminOnly = require('../middlewares/role_admin')

router.use(needAuth)

router.get('/', genreController.get)
router.post('/', adminOnly, genreController.post)
router.patch('/:id', adminOnly, genreController.patch)
router.delete('/:id', adminOnly, genreController.delete)

module.exports = router
