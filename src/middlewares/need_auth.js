const jsonWebToken = require('jsonwebtoken')
require('dotenv').config()

const response = require('../utils/response')

module.exports = (req, res, next) => {
  const { SECRET_KEY } = process.env

  try {
    let authorization = req.header('Authorization').replace('Bearer', '')
    authorization = authorization.replace('bearer', '')
    authorization = authorization.trim()

    const me = jsonWebToken.verify(authorization || req.query._token || req.body._token, SECRET_KEY)
    req.me = me.user
    next()
  } catch (e) {
    return res.status(403).send(response(false, req.body, 'This access need authorization'))
  }

}
