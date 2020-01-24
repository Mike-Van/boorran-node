const { success, fail } = require('hasu');
const { gqRequest, qCheckUser, qCreateSession, qGetUserByToken } = require('../../../utils');

module.exports.handler = async event => {
  const { email, pin } = JSON.parse(event.body) || {};
  const { sessionToken } = event.headers || {};

  try {
    // session should work within 6 hours
    if(sessionToken) {
      const { Sessions } = await gqRequest(qGetUserByToken(sessionToken))

      if(!Sessions.length) return fail('Session invalid. Please log in again.');

      const { expiredAt } = Sessions[0];
      return new Date() > new Date(expiredAt)
        ? fail('Session expired. Please log in again.')
        : success({ session: Sessions[0] });
    }

    const { Users } = await gqRequest(qCheckUser(email, pin));

    if(!Users.length) return fail('Email or password is incorrect');

    const expiredAt = new Date(new Date().getTime() + 6 * 60 * 60 * 1000).toISOString();
    const { insert_Sessions } = await gqRequest(qCreateSession(Users[0].id, expiredAt));

    return success({ session: insert_Sessions.returning });
  } catch (err) {
    return fail(err);
  };
};
