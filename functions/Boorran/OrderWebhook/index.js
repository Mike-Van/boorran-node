const { success, fail } = require('hasu');
const { qUpsertOrder, parseOrderObj, gqRequest } = require('../../../utils');

module.exports.handler = async event => {
  try {
    const body = event.body && JSON.parse(event.body) || {};

    const obj = parseOrderObj(body);
    await gqRequest(qUpsertOrder, { obj });

    return success(res);
  } catch (err) {
    console.log('error', err);
    return fail(err);
  }
}
