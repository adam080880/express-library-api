module.exports = (success = false, data = {}, msg, optional = {}) => {
  return { ...{ success }, data, ...optional, ...{ msg } }
}
