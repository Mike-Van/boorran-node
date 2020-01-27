const { GET, GQL } = require('fetchier');
const { HASURA_URL, HASURA_ACCESS_KEY } = require('./config');

const gqRequest = async query => {
  return await GQL({
    url: HASURA_URL,
    headers: { 'x-hasura-admin-secret': HASURA_ACCESS_KEY },
    query
  });
};

const userField = `id name email photo store role metadata`;
const sessionField = `id createdAt expiredAt user { ${userField} }`;

const qCheckUser = (email, pin) => `{
  Users(where: {
    _and: [
      { email: { _eq: "${email}"} }
      { pin: { _eq: "${pin}"} }
    ]
  }) {
    ${userField}
    userSessions(limit: 1, order_by: {createdAt: desc}) {
      ${sessionField}
    }
  }
}`;

const qCreateSession = (id, expired) => `mutation {
  insert_Sessions(objects: {
    userId: "${id}",
    expiredAt: "${expired}"
  }) {
    returning {
      ${sessionField}
    }
  }
}`;

const qGetUserByToken = token => `{
  Sessions(where: {
    id: { _eq: "${token}" }
  }) {
    ${sessionField}
  }
}`;

module.exports = {
  qCheckUser,
  qCreateSession,
  qGetUserByToken,
  gqRequest
};
