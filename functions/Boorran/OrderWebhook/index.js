const { success, fail } = require('hasu');
const { qUpsertOrder, parseOrderObj, gqRequest } = require('../../../utils');

module.exports.handler = async event => {
  try {
    const body = event.body && JSON.parse(event.body) || {};
    if(!body.id || !body.order_number) return fail('No data to sync');

    const obj = parseOrderObj(body);
    const res = await gqRequest(qUpsertOrder, { obj });

    return success(res);
  } catch (err) {
    console.log('error', err);
    return fail(err);
  }
}
