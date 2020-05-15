const router = require('express').Router()
const userController = require('../controllers/user')

const needAuth = require('../middlewares/need_auth')
const adminOnly = require('../middlewares/role_admin')
const superAdminOnly = require('../middlewares/role_super_admin')
const cantPatchSelf = require('../middlewares/cant_patch_self')

router.use(needAuth)

router.get('/', adminOnly, userController.get)
router.get('/member', adminOnly, userController.getAllMember)
router.get('/member/:id', adminOnly, userController.findMember)
router.patch('/toggle/role/:id', cantPatchSelf, superAdminOnly, userController.toggleRole)

module.exports = router
