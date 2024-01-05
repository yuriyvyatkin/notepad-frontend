export default class SideNavigator {
  constructor(controls, messages, messagesContainer) {
    this.controls = controls;
    this.messages = messages;
    this.messagesContainer = messagesContainer;
  }

  handleClick() {
    this.controls.forEach((control) => {
      const controlClassName = control.className;
      control.addEventListener('click', (event) => {
        event.currentTarget.parentElement.classList.toggle('activated');
        this.messages.classList.toggle(`only-${controlClassName}`);
        event.currentTarget.classList.toggle('active');
        this.messagesContainer.scrollTo(0, this.messagesContainer.scrollHeight);
      });
    });
  }
}
