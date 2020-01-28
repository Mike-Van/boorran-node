const { success, fail } = require('hasu');
const { GET } = require('fetchier');

const { BOORRAN_API_KEY, BOORRAN_API_PW, BOORRAN_STORE } = require('../../../config.js');

module.exports.handler = async event => {
  try {
    const params = event.queryParams || {};
    const qs = Object.keys(params).length
              && Object.keys(params)
                .filter(key => params[key] || params[key].length)
                .map(key => `${key}=${params[key]}`)
                .join('&') || 'limit=20';

    const res = await GET({ debug: true, url: `https://${BOORRAN_API_KEY}:${BOORRAN_API_PW}@${BOORRAN_STORE}/admin/api/2020-01/orders.json?${qs}` });
    return success(res);
  } catch (err) {
    return fail(err);
  }
};
