require("dotenv").config();
const queryString = require("querystring");

const getSearch = (search) => (search && search !== "" ? search : "");
const getOrderBy = (orderBy) =>
  orderBy && orderBy !== "" ? orderBy : "last_updated";
const getSort = (sort) => (sort && sort !== "" ? sort : "desc");

module.exports = async (query, model, table, path, me) => {
  const { page, limit, search, order_by: orderBy, sort } = query;

  const _page = page && parseInt(page) > 0 ? parseInt(page) : 1;
  const _limit = limit && parseInt(limit) > 0 ? parseInt(limit) : 5;
  const _search = getSearch(search);
  const _orderBy = getOrderBy(orderBy);
  const _sort = getSort(sort);

  const totalData = await model.count([_search, _orderBy, _sort, me]);
  const totalPage = Math.ceil(totalData / _limit);

  const start = _page * _limit - _limit;

  const prevLink =
    _page > 1
      ? queryString.stringify({ ...query, ...{ page: _page - 1 } })
      : null;
  const nextLink =
    _page < totalPage
      ? queryString.stringify({ ...query, ...{ page: _page + 1 } })
      : null;

  const data = await model.get(start, _limit, [_search, _orderBy, _sort, me]);

  return {
    success: true,
    msg: `List all ${table} data`,
    data,
    pageInfo: {
      page: _page,
      totalPage,
      perPage: _limit,
      totalData,
      nextLink: nextLink && process.env.APP_URL + path + `?${nextLink}`,
      prevLink: prevLink && process.env.APP_URL + path + `?${prevLink}`,
    },
  };
};
