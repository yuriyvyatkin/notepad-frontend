export default function enterKeyHandler(
  event,
  notepadInput,
  notepadMessagesMaker,
  geolocation,
  geoToggler,
) {
  if (event.key === 'Enter') {
    const { value } = notepadInput;
    if (!value || !value.trim()) {
      notepadInput.setAttribute('value', '');
      return;
    }

    if (geoToggler.checked) {
      geolocation.call((geoResponse) => {
        notepadMessagesMaker.addMessage(geoResponse, value, 'text');
      });
    } else {
      notepadMessagesMaker.addMessage({ lat: 0, lon: 0 }, value, 'text');
    }
  }
}
