const AddThreadUseCase = require('../../../../Applications/use_case/AddThreadUseCase');
const GetThreadDetailsByIdUseCase = require('../../../../Applications/use_case/GetThreadDetailsByIdUseCase');
class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadDetailsByIdHandler =
      this.getThreadDetailsByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const { id: owner } = request.auth.credentials;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute({
      ...request.payload,
      owner,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadDetailsByIdHandler(request) {
    const { threadId } = request.params;
    const getThreadDetailsByIdUseCase = this._container.getInstance(
      GetThreadDetailsByIdUseCase.name
    );
    const thread = await getThreadDetailsByIdUseCase.execute(threadId);

    return {
      status: 'success',
      data: {
        thread,
      },
    };
  }
}

module.exports = ThreadsHandler;
