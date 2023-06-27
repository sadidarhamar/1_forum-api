const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('when POST /threads', () => {
  it('should response 201 and added thread', async () => {
    const payload = {
      title: 'title',
      body: 'dummy body',
    };
    const accessToken = await ServerTestHelper.getAccessToken();
    const server = await createServer(container);

    const response = await server.inject({
      url: '/threads',
      method: 'POST',
      payload,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(201);
    expect(responseJson.status).toEqual('success');
    expect(responseJson.data.addedThread).toBeDefined();
    expect(responseJson.data.addedThread.title).toEqual(payload.title);
  });
});
