export default class API {
  constructor(baseURL, loading, messagesContainer, messages, notepadInput) {
    this.baseURL = baseURL;
    this.loading = loading;
    this.messagesContainer = messagesContainer;
    this.messages = messages;
    this.notepadInput = notepadInput;
  }

  getBaseURL() {
    return this.baseURL;
  }

  preConnection() {
    fetch(`${this.baseURL}/check`)
      .then(
        () => {
          this.loading.classList.remove('active');
        },
        () => {
          this.preConnection();
        },
      );
  }

  showWarning() {
    this.messagesContainer.classList.add('api-says', 'request-execution');
    this.messagesContainer.dataset.apiMessage = 'Подождите, выполняется запрос к серверу...';
  }

  activateAPI() {
    this.messagesContainer.classList.add('api-says');
  }

  getMessages(amountChildren, callback) {
    this.activateAPI();
    this.showWarning();

    if (this.messages.childElementCount > 0) {
      this.messagesContainer.style.overflowY = 'clip';
    }

    fetch(`${this.baseURL}/messages?amountChildren=${amountChildren}`)
      .then(
        (response) => this.handleSuccess(response, callback),
        (response) => this.handleRejection(response),
      );
  }

  getBlob(pathname, callback) {
    this.showWarning();

    fetch(`${this.baseURL}${pathname}`)
      .then(
        (response) => this.handleSuccess(response, callback),
        (response) => this.handleRejection(response),
      );
  }

  uploadMessage(coords, timestamp, content, type) {
    this.showWarning();

    let body;
    const method = 'POST';
    let headers;
    let callback;

    try {
      if (typeof content === 'object') {
        body = new FormData();

        body.append('file', content);
        body.append('type', type);
        body.append('name', content.name);
        body.append('coords', JSON.stringify(coords));
        body.append('timestamp', timestamp);

        callback = (response) => {
          response.json().then(
            (data) => {
              this.messages.lastElementChild.id = data.id;
              this.messages.lastElementChild.dataset.link = data.link;
            },
          );
        };
      } else if (typeof content === 'string') {
        body = JSON.stringify({
          type,
          content,
          coords,
          timestamp,
        });

        headers = { 'Content-Type': 'application/json' };

        callback = (response) => {
          response.text().then(
            (id) => {
              this.messages.lastElementChild.id = id;
            },
          );
        };
      }
    } catch (error) {
      this.outputError('Ошибка при подготовке данных для отправки!');

      throw error;
    }

    fetch(`${this.baseURL}/messages`, { body, method, headers })
      .then(
        (response) => this.handleSuccess(response, callback),
        (response) => this.handleRejection(response),
      );
  }

  changeMessage(id, changedOption) {
    this.activateAPI();

    const body = new URLSearchParams();
    body.append('id', id);
    body.append('changedOption', changedOption);
    const method = 'PATCH';
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    fetch(`${this.baseURL}/messages`, { body, method, headers })
      .then(
        (response) => this.handleSuccess(response),
        (response) => this.handleRejection(response),
      );
  }

  handleSuccess(response, callback) {
    if (callback) {
      callback(response);
    }

    this.messagesContainer.classList.remove('api-says');
    this.messagesContainer.dataset.apiMessage = '';
    this.notepadInput.focus();
  }

  handleRejection(response) {
    if (response.message === 'Failed to fetch') {
      this.outputError('Сервер не доступен, передача данных остановлена!');
    } else {
      this.outputError(`Ошибка: ${response}! Передача данных остановлена.`);
    }
  }

  outputError(errorMessage) {
    if (this.messages.childElementCount > 0) {
      this.messagesContainer.style.overflowY = 'auto';
    }

    this.messagesContainer.classList.remove('request-execution');
    this.messagesContainer.dataset.apiMessage = errorMessage;
    this.messagesContainer.classList.add('api-says', 'error');

    setTimeout(() => {
      this.messagesContainer.dataset.apiMessage = '';
      this.messagesContainer.classList.remove('api-says', 'error');
    }, 3000);
  }
}
