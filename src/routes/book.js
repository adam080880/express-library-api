const router = require('express').Router()
const bookController = require('../controllers/book')

const { book: bookUpload } = require('../utils/upload')

router.get('/', bookController.get)
router.get('/:id', bookController.getOne)
router.post('/', bookUpload().single('image'), bookController.post)
router.patch('/:id', bookUpload().single('image'), bookController.patch)
router.delete('/:id', bookController.delete)

module.exports = router
