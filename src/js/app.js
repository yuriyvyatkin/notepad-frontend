import API from './API';
import NotepadMessagesMaker from './NotepadMessagesMaker';
import Modal from './Modal';
import Geolocation from './Geolocation';
import enterKeyHandler from './enterKeyHandler';
import WebSocketAPI from './WebSocketAPI';
import DnD from './DnD';
import MessagesControls from './MessagesControls';
import SideNavigator from './SideNavigator';
import scrollDown from './scrollDown';

const notepad = document.querySelector('.notepad-widget');
const messagesContainer = notepad.querySelector('.notepad-widget__messages-container');
const messages = notepad.querySelector('.notepad-widget__messages');
const notepadInput = notepad.querySelector('.notepad-widget__input');

const loading = document.querySelector('.status-loading');

const hostname = 'notepad-backend-pro-04d97b7a3391.herokuapp.com';

const api = new API(`https://${hostname}`, loading, messagesContainer, messages, notepadInput);

api.preConnection();

const ws = new WebSocket(`wss://${hostname}`);

const notepadMessagesMaker = new NotepadMessagesMaker(
  notepadInput,
  messages,
  messagesContainer,
  api,
  ws,
);

const webSocketAPI = new WebSocketAPI(
  ws,
  messages,
  messagesContainer,
  notepadMessagesMaker,
);

webSocketAPI.handleIncomingMessages();
webSocketAPI.handleServerDisconnection();

const dropZoneInput = document.querySelector('.drop-zone__input');
const modalWindow = document.querySelector('.modal');
const modalHeader = modalWindow.querySelector('.modal__header');
const modalMessage = modalWindow.querySelector('.modal__message');
const modalForm = modalWindow.querySelector('.modal__form');
const modalFormInput = modalWindow.querySelector('.modal-form__input');
const modalCancelButton = modalWindow.querySelector('.modal-form__button-cancel');

const modal = new Modal(
  modalWindow,
  modalHeader,
  modalMessage,
  modalForm,
  modalFormInput,
  modalCancelButton,
  notepadInput,
  dropZoneInput,
  notepadMessagesMaker,
);

modal.assignInputCheckerHandler();
modal.assignSubmitHandler();
modal.assignCancelHandler();

const geolocation = new Geolocation(
  notepadInput,
  modal,
);

const dropZone = messagesContainer;
const paperclip = document.querySelector('.paperclip');
const geoToggler = document.querySelector('.geolocation-toggler');

const dragAndDrop = new DnD(
  dropZone,
  dropZoneInput,
  paperclip,
  geolocation,
  geoToggler,
  notepadMessagesMaker,
);

dragAndDrop.handleDropZoneInput();
dragAndDrop.handleDropZone();

notepadInput.addEventListener('keyup', (event) => enterKeyHandler(
  event,
  notepadInput,
  notepadMessagesMaker,
  geolocation,
  geoToggler,
));

const notepadForm = document.querySelector('.notepad__form');
notepadForm.addEventListener('submit', (event) => event.preventDefault());

const messagesControls = new MessagesControls(
  messagesContainer,
  messages,
  api,
);

messagesControls.assignHandler();

function lazyLoadingCallback(response) {
  response.json().then(
    (data) => {
      let html = '';

      data.body.forEach((message) => {
        html += notepadMessagesMaker.getMessageHTML(message);
      });

      messages.insertAdjacentHTML('afterbegin', html);

      const pinnedMessage = messages.querySelector('[data-state="pinned"]');

      if (pinnedMessage) {
        const pin = pinnedMessage.querySelector('.message__pin');
        pin.click();
      }

      if (data.rest <= 0) {
        messages.classList.remove('lazy-loading');
      }

      messagesContainer.style.overflowY = 'auto';

      notepadInput.focus();
    },
  );
}

api.getMessages(0, (response) => lazyLoadingCallback(response));

messagesContainer.dataset.oldScroll = messagesContainer.scrollTop;

messagesContainer.addEventListener('scroll', (event) => {
  const { currentTarget } = event;

  const oldScroll = parseFloat(currentTarget.dataset.oldScroll);

  if (
    messages.classList.contains('lazy-loading')
    && oldScroll > currentTarget.scrollTop
  ) {
    const quarterScrolling = (currentTarget.scrollHeight - currentTarget.clientHeight) / 4;

    if (currentTarget.scrollTop < quarterScrolling) {
      api.getMessages(messages.childElementCount, (response) => lazyLoadingCallback(response));
    }
  }

  currentTarget.dataset.oldScroll = currentTarget.scrollTop;
});

const sideNav = notepad.querySelector('.side-nav');
const sideNavControls = sideNav.querySelectorAll('a');
const sideNavigator = new SideNavigator(sideNavControls, messages, messagesContainer);

sideNavigator.handleClick();

setTimeout(() => {
  scrollDown(messagesContainer, messages);
}, 1000);
