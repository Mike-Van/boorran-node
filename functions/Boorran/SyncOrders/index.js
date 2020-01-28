const { success, fail } = require('hasu');
const { GET } = require('fetchier');

const { BOORRAN_API_KEY, BOORRAN_API_PW, BOORRAN_STORE } = require('../../../config.js');

module.exports.handler = async event => {
  GET({
    url: `https://${BOORRAN_API_KEY}:${BOORRAN_API_PW}@${BOORRAN_STORE}/admin/api/2020-01/orders.json?limit=2&status=any`
  }).then(console.log);
};
