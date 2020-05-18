const router = require('express').Router()
const genreController = require('../controllers/genre')

const needAuth = require('../middlewares/need_auth')
const adminOnly = require('../middlewares/role_admin')

router.get('/', genreController.get)
router.post('/', needAuth, adminOnly, genreController.post)
router.patch('/:id', needAuth, adminOnly, genreController.patch)
router.delete('/:id', needAuth, adminOnly, genreController.delete)

module.exports = router
