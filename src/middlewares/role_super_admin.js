const response = require('../utils/response')

module.exports = (req, res, next) => {
  if (parseInt(req.me.role_id) !== 3) {
    return res.status(403).send(response(false, req.body, 'This action need specific role'))
  }
  next()
}
