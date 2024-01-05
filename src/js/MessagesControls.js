export default class MessagesControls {
  constructor(
    messagesContainer,
    messages,
    api,
  ) {
    this.messagesContainer = messagesContainer;
    this.messages = messages;
    this.api = api;
  }

  assignHandler() {
    this.messages.addEventListener('click', (event) => {
      const { target } = event;

      if (
        target.classList.contains('message__download-link')
        && !target.href.startsWith('blob')
      ) {
        event.preventDefault();

        const callback = (response) => {
          response.blob().then(
            (data) => {
              target.href = URL.createObjectURL(data);
              target.click();
            },
          );
        };

        const url = new URL(target.href);

        this.api.getBlob(url.pathname, callback);
      } else if (target.classList.contains('message__pin')) {
        const message = target.closest('.message');

        if (
          !this.messages.classList.contains('with-pinned-child')
          && !message.classList.contains('pinned')
        ) {
          const scrollBarWidth = this.messagesContainer.offsetWidth
            - this.messagesContainer.clientWidth;
          message.style.transform = `translateX(calc(-50% - ${scrollBarWidth / 2}px))`;
          target.setAttribute('aria-disabled', 'true');
          target.removeAttribute('data-state');
          message.classList.add('pinned');
          this.messages.classList.add('with-pinned-child');
          this.api.changeMessage(message.id, 'pinned');
        } else if (message.classList.contains('pinned')) {
          message.style = '';
          target.removeAttribute('aria-disabled');
          message.classList.remove('pinned');
          this.messages.classList.remove('with-pinned-child');
          this.api.changeMessage(message.id, 'pinned');
        }
      } else if (target.classList.contains('message__star')) {
        const message = target.closest('.message');

        message.classList.toggle('favorite');
        this.api.changeMessage(message.id, 'favorite');
      }
    });
  }
}
