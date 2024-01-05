import API from './API';

export default class WebSocketAPI extends API {
  constructor(
    ws,
    messages,
    messagesContainer,
    notepadMessagesMaker,
  ) {
    super();
    this.ws = ws;
    this.messages = messages;
    this.messagesContainer = messagesContainer;
    this.notepadMessagesMaker = notepadMessagesMaker;
  }

  handleIncomingMessages() {
    this.ws.addEventListener('message', (wsMsgEvent) => {
      const data = JSON.parse(wsMsgEvent.data);

      const messageHTML = this.notepadMessagesMaker.getMessageHTML(data);
      this.messages.insertAdjacentHTML('beforeend', messageHTML);
      this.messagesContainer.scrollTo(0, this.messagesContainer.scrollHeight);
    });
  }

  handleServerDisconnection() {
    this.ws.addEventListener('close', () => {
      this.outputError('Сервер отключен, передача данных остановлена!');
    });
  }
}
