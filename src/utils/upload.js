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

    return multer(
      {
        storage,
        fileFilter: (req, file, cb) => {
          const ext = file.mimetype.toLowerCase()
          if ((ext === 'image/png' ||
               ext === 'image/jpeg' ||
               ext === 'image/jpg')) {
            cb(null, true)
          } else {
            cb(null, new Error('Error uploading file, not passing validation'))
          }
        },
        limits: {
          fileSize: 1240000
        }
      })
  }
}
