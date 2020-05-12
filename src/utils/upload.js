const multer = require('multer')

module.exports = {
  book: () => {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'public/uploads/books')
      },
      filename: (req, file, cb) => {
        cb(null, new Date().getTime() + '-' + file.originalname)
      }
    })

    return multer({ storage })
  }
}
