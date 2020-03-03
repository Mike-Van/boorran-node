const { success, fail } = require('hasu');
const { fetch } = require('fetchier');
const { qUpsertOrder, parseOrderObj, gqRequest } = require('../../../utils');

const { BOORRAN_API_KEY, BOORRAN_API_PW, BOORRAN_STORE, HASURA_URL, HASURA_ACCESS_KEY } = require('../../../config.js');

module.exports.handler = async event => {
  try {
    const params = event.queryStringParameters || {};
    const qs = Object.keys(params).length
              && Object.keys(params)
                .filter(key => params[key] || params[key].length)
                .map(key => `${key}=${params[key]}`)
                .join('&') || 'limit=50&status=any&financial_status=any&fulfillment_status=any';

    const url = `https://${BOORRAN_API_KEY}:${BOORRAN_API_PW}@${BOORRAN_STORE}/admin/api/2020-01/orders.json?${qs}`;

    const req = await fetch(url, { method: 'GET' });

    const res = { body: await req.json(), headers: req.headers.raw() };

    const obj = res.body.orders.map(order => parseOrderObj(order));
    
    await gqRequest(qUpsertOrder, { obj });

    return success({ headers: res.headers });
  } catch (err) {
    console.log('error', err);
    return fail(err);
  }
};
