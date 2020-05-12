module.exports = (success = false, data = {}, msg, optional = {}) => {
  return { ...{ success }, data, ...{ msg }, ...optional }
}
