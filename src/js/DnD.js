export default class DnD {
  constructor(
    dropZone,
    dropZoneInput,
    paperclip,
    geolocation,
    geoToggler,
    notepadMessagesMaker,
  ) {
    this.dropZone = dropZone;
    this.dropZoneInput = dropZoneInput;
    this.paperclip = paperclip;
    this.geolocation = geolocation;
    this.geoToggler = geoToggler;
    this.notepadMessagesMaker = notepadMessagesMaker;
  }

  handleReceivedFile(file) {
    const fileType = file.type.replace(/(^[a-z]+)\/.+/, '$1');

    if (!['image', 'video', 'audio'].includes(fileType)) {
      this.dropZone.classList.add('extension-error');

      setTimeout(() => {
        this.dropZone.classList.remove('drop-zone-overlay', 'extension-error');
      }, 3000);
      return;
    }

    this.dropZone.classList.remove('drop-zone-overlay');

    if (this.geoToggler.checked) {
      this.geolocation.call(
        (geoResponse) => {
          this.notepadMessagesMaker.addMessage(geoResponse, file, fileType);
        },
      );
    } else {
      this.notepadMessagesMaker.addMessage({ lat: 0, lon: 0 }, file, fileType);
    }
  }

  handleDropZoneInput() {
    this.paperclip.addEventListener('click', () => {
      this.dropZoneInput.click();
    });

    this.dropZoneInput.addEventListener('click', (event) => {
      const { target } = event;
      target.value = null;
    });

    this.dropZoneInput.addEventListener('change', (event) => {
      const { currentTarget } = event;

      if (currentTarget.files.length) {
        const file = currentTarget.files[0];

        this.handleReceivedFile(file);
      }
    });
  }

  handleDropZone() {
    this.dropZone.addEventListener('dragover', (event) => {
      event.preventDefault();

      if (event.target.closest('.notepad-widget__messages-container')) {
        this.dropZone.classList.add('drop-zone-overlay');
        this.dropZone.scrollTo(0, this.dropZone.scrollHeight);
      }
    });

    ['dragleave', 'dragend'].forEach((type) => {
      this.dropZone.addEventListener(type, (event) => {
        if (
          event.relatedTarget === null
          || event.relatedTarget.className !== event.currentTarget.className
        ) {
          event.currentTarget.classList.remove('drop-zone-overlay');
        }
      });
    });

    this.dropZone.addEventListener('drop', (event) => {
      event.preventDefault();

      if (event.dataTransfer.files.length) {
        this.dropZoneInput.files = event.dataTransfer.files;
        const file = event.dataTransfer.files[0];

        this.handleReceivedFile(file);
      }
    });
  }
}
