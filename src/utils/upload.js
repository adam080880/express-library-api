const multer = require('multer')
const path = require('path')

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

    return multer(
      {
        storage,
        fileFilter: (req, file, cb) => {
          let ext = path.extname(file.originalname)
          ext = ext.replace('.', '')
          console.log(req.file)
          if ((ext === 'png' ||
               ext === 'PNG' ||
               ext === 'jpg' ||
               ext === 'JPG' ||
               ext === 'JPEG' ||
               ext === 'jpeg')) {
            cb(null, true)
          } else {
            cb(null, false)
          }
        },
        limits: {
          fileSize: 1240000
        }
      })
  }
}
