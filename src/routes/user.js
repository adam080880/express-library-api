const router = require('express').Router()
const userController = require('../controllers/user')

const needAuth = require('../middlewares/need_auth')
const adminOnly = require('../middlewares/role_admin')
const cantPatchSelf = require('../middlewares/cant_patch_self')

router.use(needAuth)
router.use(adminOnly)

router.get('/', userController.get)
router.patch('/toggle/role/:id', cantPatchSelf, userController.toggleRole)

module.exports = router
