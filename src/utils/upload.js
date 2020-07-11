const multer = require("multer");

module.exports = {
  book: () => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "public/uploads/books");
      },
      filename: (req, file, cb) => {
        cb(null, new Date().getTime() + "-" + file.originalname);
      },
    });

    return multer({
      storage,
      fileFilter: (req, file, cb) => {
        const ext = file.mimetype.toLowerCase().split("/")[0];
        if (ext === "image") {
          cb(null, true);
        } else {
          cb(
            new Error("Error uploading file, not passing validation"),
            new Error("Error uploading file, not passing validation")
          );
        }
      },
      limits: {
        fileSize: 1240000,
      },
    });
  },
  profile: () => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "public/uploads/profile");
      },
      filename: (req, file, cb) => {
        cb(
          null,
          new Date().getTime().toString().concat(`-${file.originalname}`)
        );
      },
    });

    return multer({
      storage,
      fileFilter: (req, file, cb) => {
        const ext = file.mimetype.toLowerCase().split("/")[0];
        if (ext === "image") {
          cb(null, true);
        } else {
          cb(
            new Error("Error uploading file, not passing validation"),
            new Error("Error uploading file, not passing validation")
          );
        }
      },
      limits: {
        fileSize: 1240000,
      },
    });
  },
};
