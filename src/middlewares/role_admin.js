const response = require('../utils/response')

const {isExists} = require('../utils/validator')

module.exports = async (req, res, next) => {
  if (!req.me.bio) {
    return res.status(403).send(response(false, req.body, 'This action need complete biodata'))
  }

  const data = await isExists({ id: req.me.id }, 'users')
  if (parseInt(data.role_id) !== 1 && parseInt(data.role_id) !== 3) {
    return res.status(403).send(response(false, req.body, 'This action need specific role'))
  } else next()
}
