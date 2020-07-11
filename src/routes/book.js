const router = require("express").Router();
const bookController = require("../controllers/book");
const response = require("../utils/response");

const needAuth = require("../middlewares/need_auth");
const adminOnly = require("../middlewares/role_admin");

const { book: bookUpload } = require("../utils/upload");

router.post("/review/:id", needAuth, bookController.review);
router.get("/", bookController.get);
router.get("/popular", bookController.popular);
router.get("/:id", bookController.getOne);
router.post(
  "/",
  needAuth,
  adminOnly,
  (req, res, next) => {
    const upload = bookUpload().single("image");
    upload(req, res, (err) => {
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
  },
  bookController.post
);
router.patch(
  "/:id",
  needAuth,
  adminOnly,
  (req, res, next) => {
    const upload = bookUpload().single("image");
    upload(req, res, (err) => {
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
  },
  bookController.patch
);
router.delete("/:id", needAuth, adminOnly, bookController.delete);

module.exports = router;
