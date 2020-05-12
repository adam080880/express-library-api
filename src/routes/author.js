const router = require('express').Router()
const authorController = require('../controllers/author')

router.get('/', authorController.get)
router.post('/', authorController.post)
router.patch('/:id', authorController.patch)
router.delete('/:id', authorController.delete)

module.exports = router
