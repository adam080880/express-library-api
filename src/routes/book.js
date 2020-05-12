const router = require('express').Router()
const bookController = require('../controllers/book')

const needAuth = require('../middlewares/need_auth')
const adminOnly = require('../middlewares/role_admin')

const { book: bookUpload } = require('../utils/upload')

router.get('/', bookController.get)
router.get('/:id', bookController.getOne)
router.post('/', needAuth, adminOnly, bookUpload().single('image'), bookController.post)
router.patch('/:id', needAuth, adminOnly, bookUpload().single('image'), bookController.patch)
router.delete('/:id', needAuth, adminOnly, bookController.delete)

module.exports = router
