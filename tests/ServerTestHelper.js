const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const ServerTestHelper = {
  async getAccessToken() {
    const payloadUser = {
      id: 'user-1234',
      username: 'test1',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };
    await UsersTableTestHelper.addUser(payloadUser);
    return Jwt.token.generate(payloadUser, process.env.ACCESS_TOKEN_KEY);
  },
};

module.exports = ServerTestHelper;
