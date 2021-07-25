const socket = io();
const totalClient = document.getElementById("total-client");
socket.on("total-client", (data) => {
  totalClient.innerText = `Total Clients: ${data}`;
});

const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const messageTone = new Audio('/assets/sound/message-tone.mp3');
const typingTone = new Audio('/assets/sound/typing.mp3');

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

function sendMessage() {
  clearFeedback();
  if (messageInput.value === "") return;
  const data = {
    user: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };
  socket.emit("onSend", data);
  displayMessage(true, data);
  messageInput.value = "";
}

socket.on("received-message", (data) => {
  messageTone.play();
  displayMessage(false, data);
});

function displayMessage(isOwnMsg, data) {
  const element = `
    <li class="${isOwnMsg ? "message-right" : "message-left"}">
      <p class="message">
        ${data.message}
        <span>${data.user} - ${moment(data.dateTime).fromNow()}</span>   
      </p>
    </li>`;
  messageContainer.innerHTML += element;
  autoScroll();
}

function autoScroll() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}

messageInput.addEventListener("focus", (e) => {
  socket.emit("onFeedback", {
    feedback: `${nameInput.value} is typing...`,
  });
});

messageInput.addEventListener("keypress", (e) => {
  socket.emit("onFeedback", {
    feedback: `${nameInput.value} is typing...`,
  });
});

messageInput.addEventListener("blur", (e) => {
  socket.emit("onFeedback", {
    feedback: ``,
  });
});

socket.on("received-feedback", (data) => {
  clearFeedback();
  typingTone.play();
  const element = `
    <li class="message-feedback">
      <p class="feedback" id="feedback">${data.feedback}</p>
    </li>`;
  messageContainer.innerHTML += element;
});

function clearFeedback() {
  document
    .querySelectorAll("li.message-feedback")
    .forEach(element => element.parentNode.removeChild(element));
}
