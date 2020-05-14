const response = require('../utils/response')

module.exports = (req, res, next) => {
  if (parseInt(req.params.id) === parseInt(req.me.id)) {
    next()
  } else {
    return res.status(403).send(response(false, { id: req.params.id }, 'Forbidden, just for specific user'))
  }
}
