const { success, fail } = require('hasu');
const { gqRequest, qCheckUser, qCreateSession, qGetUserByToken } = require('../../../utils');

module.exports.handler = async event => {
  const { email, pin } = JSON.parse(event.body) || {};
  const { sessionToken } = event.headers || {};
  console.log('auth request', email, pin, sessionToken, typeof email, typeof pin, typeof sessionToken)
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

    if(!Users[0].activationStatus) return fail('Your account has been deactivated. Please contact admin.');

    const lastSession = Users[0].userSessions.length && Users[0].userSessions[0];
    if(!lastSession || new Date() > new Date(lastSession.expiredAt)) {
      const expiredAt = new Date(new Date().getTime() + 6 * 60 * 60 * 1000).toISOString();
      const { insert_Sessions } = await gqRequest(qCreateSession(Users[0].id, expiredAt));

      return success({ session: insert_Sessions.returning[0] });
    }
    else return success({ session: lastSession });
  } catch (err) {
    return fail(err);
  };
};
