require('dotenv').config()
const queryString = require('querystring')

module.exports = async (query, model, table, path) => {
  const { page, limit } = query

  const _page = (page && parseInt(page) > 0) ? parseInt(page) : 1
  const _limit = (limit && parseInt(limit) > 0) ? parseInt(limit) : 5

  const totalData = await model.count()
  const totalPage = Math.ceil(totalData / _limit)

  const start = (_page * _limit) - _limit
  // const end = (_page * _limit)

  const prevLink = _page > 1 ? queryString.stringify({ ...query, ...{ page: _page - 1 } }) : null
  const nextLink = _page < totalPage ? queryString.stringify({ ...query, ...{ page: _page + 1 } }) : null

  const data = await model.get(start, _limit)

  return {
    success: true,
    msg: `List all ${table} data`,
    data,
    pageInfo: {
      page: _page,
      totalPage,
      perPage: _limit,
      totalData,
      nextLink: nextLink && (process.env.APP_URL + path + `?${nextLink}`),
      prevLink: prevLink && (process.env.APP_URL + path + `?${prevLink}`)
    }
  }
}
