const router = require("express").Router();
const authController = require("../controllers/auth");
const userController = require("../controllers/user");
const { profile } = require("../utils/upload");
const needAuth = require("../middlewares/need_auth");
const response = require("../utils/response");

const uploadImageHandler = (req, res, next) => {
  const uploadHandler = profile().single("image");
  uploadHandler(req, res, (err) => {
    if (err) {
      res
        .status(400)
        .send(
          response(
            false,
            req.body,
            "Failed passed validation file (file type just for image and max file size is 1024KB)"
          )
        );
    } else {
      next();
    }
  });
};

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post(
  "/complete_registration",
  needAuth,
  authController.completeRegistration
);
router.get("/profile", needAuth, userController.find);
router.patch(
  "/profile/edit",
  needAuth,
  uploadImageHandler,
  authController.editProfile
);

module.exports = router;
