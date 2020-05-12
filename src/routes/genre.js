const router = require('express').Router()
const genreController = require('../controllers/genre')

router.get('/', genreController.get)
router.post('/', genreController.post)
router.patch('/:id', genreController.patch)
router.delete('/:id', genreController.delete)

module.exports = router
