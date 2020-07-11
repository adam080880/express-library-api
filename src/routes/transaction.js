const router = require("express").Router();
const transactionController = require("../controllers/transaction");

const needAuth = require("../middlewares/need_auth");
const adminOnly = require("../middlewares/role_admin");

router.use(needAuth);

router.get("/", adminOnly, transactionController.get);
router.patch("/borrow/:id", adminOnly, transactionController.toBorrow);
router.patch("/return/:id", adminOnly, transactionController.toReturned);
router.patch("/cancel/:id", adminOnly, transactionController.toCancel);
router.get("/not_returned", transactionController.notReturned);

module.exports = router;
