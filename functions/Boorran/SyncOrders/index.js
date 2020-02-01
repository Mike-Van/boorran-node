const { success, fail } = require('hasu');
const { fetch, GQL } = require('fetchier');
const { qUpsertOrder } = require('../../../utils');

const { BOORRAN_API_KEY, BOORRAN_API_PW, BOORRAN_STORE, HASURA_URL, HASURA_ACCESS_KEY } = require('../../../config.js');

module.exports.handler = async event => {
  try {
    const params = event.queryStringParameters || {};
    const qs = Object.keys(params).length
              && Object.keys(params)
                .filter(key => params[key] || params[key].length)
                .map(key => `${key}=${params[key]}`)
                .join('&') || 'limit=20';

    const url = `https://${BOORRAN_API_KEY}:${BOORRAN_API_PW}@${BOORRAN_STORE}/admin/api/2020-01/orders.json?${qs}`;

    const req = await fetch(url, { method: 'GET' });

    const res = { body: await req.json(), headers: req.headers.raw() };

    res.body.orders.forEach(async order => {
      const {
        id,
        order_number,
        line_items,
        subtotal_price,
        total_discount,
        note,
        gateWay,
        financial_status,
        customer,
        created_at,
        total_price
      } = order;

      const obj = {
        source: 'shopify',
        id,
        createdAt: created_at,
        orderNumber: order_number,
        items: line_items,
        subTotal: subtotal_price,
        note: note,
        deliveryStatus: gateWay,
        status: financial_status,
        customerDetail: customer,
        grandTotal: total_price
      };

      const reqUpsert = await GQL({
        url: HASURA_URL,
        headers: { 'x-hasura-admin-secret': HASURA_ACCESS_KEY },
        query: qUpsertOrder,
        variables: { obj }
      });
    });

    return success({ headers: res.headers });
  } catch (err) {
    console.log('error', err);
    return fail(err);
  }
};
