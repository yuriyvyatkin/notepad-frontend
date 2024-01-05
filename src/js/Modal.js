export default class Modal {
  constructor(
    modalWindow,
    modalHeader,
    modalMessage,
    modalForm,
    modalFormInput,
    modalCancelButton,
    notepadInput,
    dropZoneInput,
    notepadMessagesMaker,
  ) {
    this.modalWindow = modalWindow;
    this.modalHeader = modalHeader;
    this.modalMessage = modalMessage;
    this.modalForm = modalForm;
    this.modalFormInput = modalFormInput;
    this.modalCancelButton = modalCancelButton;
    this.notepadInput = notepadInput;
    this.dropZoneInput = dropZoneInput;
    this.notepadMessagesMaker = notepadMessagesMaker;
  }

  setContent(content) {
    this.modalHeader.textContent = content.header;
    this.modalMessage.textContent = content.message;
  }

  toggle() {
    this.modalWindow.classList.toggle('active');
  }

  getCoords() {
    const formattedInput = this.modalFormInput.value
      .replace(/^\[/, '')
      .replace(/\]$/, '')
      .replace(/, /, ',');

    const [lat, lon] = formattedInput.split(',');

    const convertedInput = {
      lat: +lat,
      lon: +lon,
    };

    return convertedInput;
  }

  checkModalFormInput() {
    const regex = /^\[?[−-]?([0-9]|[1-8][0-9])(\.\d{1,5})?,\s?[−-]?([0-9]|[1-9][0-9]|[1][0-7][0-9])(\.\d{1,5})?\]?$/;

    return regex.test(this.modalFormInput.value);
  }

  static manageValidity(currentValidity, input) {
    if (currentValidity) {
      input.setCustomValidity('');
    } else {
      input.setCustomValidity('Координаты не соответствуют примеру');
    }
  }

  assignInputCheckerHandler() {
    this.modalFormInput.addEventListener('change', () => this.constructor.manageValidity(
      this.checkModalFormInput(),
      this.modalFormInput,
    ));
    this.modalFormInput.addEventListener('input', () => this.constructor.manageValidity(
      this.checkModalFormInput(),
      this.modalFormInput,
    ));
  }

  assignSubmitHandler() {
    this.modalForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (this.checkModalFormInput()) {
        this.toggle();
        if (this.notepadInput.value) {
          this.notepadMessagesMaker.addMessage(this.getCoords(), this.notepadInput.value, 'text');
        } else {
          const file = this.dropZoneInput.files[0];
          const fileType = file.type.replace(/(^[a-z]+)\/.+/, '$1');
          this.notepadMessagesMaker.addMessage(this.getCoords(), file, fileType);
        }
        this.modalHeader.textContent = '';
        this.modalMessage.textContent = '';
        this.modalForm.reset();
      } else {
        this.modalFormInput.setCustomValidity('Координаты не соответствуют примеру');
      }
    });
  }

  assignCancelHandler() {
    this.modalCancelButton.onclick = () => {
      this.notepadInput.focus();
      this.notepadInput.selectionStart = this.notepadInput.value.length;
      this.toggle();
      this.modalHeader.textContent = '';
      this.modalMessage.textContent = '';
      this.modalForm.reset();
    };
  }
}
