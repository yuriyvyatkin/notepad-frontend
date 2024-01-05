export default function scrollDown(messagesContainer, messages) {
  const scrollID = setInterval(() => {
    messagesContainer.scrollBy(0, 75);

    const oldScroll = parseFloat(messagesContainer.dataset.oldScroll);

    const stopScroll = (messages.childElementCount !== 0)
      && (messagesContainer.scrollTop > 0)
      && (oldScroll === messagesContainer.scrollTop);

    if (stopScroll) {
      clearInterval(scrollID);
    } else {
      messagesContainer.setAttribute('oldScroll', messagesContainer.scrollTop);
    }
  }, 100);
}
