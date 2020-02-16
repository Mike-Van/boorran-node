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
                .join('&') || 'limit=50&status=any&financial_status=any&fulfillment_status=any';

    const url = `https://${BOORRAN_API_KEY}:${BOORRAN_API_PW}@${BOORRAN_STORE}/admin/api/2020-01/orders.json?${qs}`;
    console.log(url)
    const req = await fetch(url, { method: 'GET' });

    const res = { body: await req.json(), headers: req.headers.raw() };

    const obj = res.body.orders.map(order => {
      const {
        id,
        order_number,
        line_items,
        total_discounts,
        note,
        gateway,
        financial_status,
        customer = {},
        created_at,
        total_price,
        shipping_address = {},
        billing_address = {}
      } = order;

      const address = shipping_address.address1 || billing_address.address1 || customer.default_address && customer.default_address.address1;
      
      return {
        id,
        createdAt: created_at,
        orderNumber: order_number,
        items: line_items,
        subTotal: total_price,
        note: note,
        paymentMethod: gateway,
        status: financial_status,
        grandTotal: parseFloat(total_price),
        discount: parseFloat(total_discounts),
        customerDetail: customer,
        orderAddress: address,
        deliveryDestination: address
      };
    });
    // console.log('variables', JSON.stringify(obj));

    const reqUpsert = await GQL({
      url: HASURA_URL,
      headers: { 'x-hasura-admin-secret': HASURA_ACCESS_KEY },
      query: qUpsertOrder,
      variables: { obj }
    });

    return success({ headers: res.headers });
  } catch (err) {
    console.log('error', err);
    return fail(err);
  }
};
