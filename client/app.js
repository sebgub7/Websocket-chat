'use strict';

/* GLOBAL */
const loginForm = document.getElementById('welcome-form'),
  messagesSection = document.getElementById('messages-section'),
  messagesList = document.getElementById('messages-list'),
  addMessageForm = document.getElementById('add-messages-form'),
  userNameInput = document.getElementById('username'),
  messageContentInput = document.getElementById('message-content'),
  messageAuthor = document.querySelector('.message__author');
let userName;
const socket = io();
socket.on('message', ({ author, content }) => addMessage(author, content));

/* ACTIONS */
function login(event) {
  event.preventDefault();

  if (userNameInput.value) {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('join', userName);
  } else {
    alert('Name field is empty!');
  }
}

function sendMessage(event) {
  event.preventDefault();

  let msgContent = messageContentInput.value;

  if (!msgContent.length) {
    alert('Message field is empty!');
  } else {
    addMessage(userName, msgContent);
    socket.emit('message', { author: userName, content: msgContent });
    messageContentInput.value = '';
  }
}

function addMessage(author, msgContent) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');

  if (author === userName) message.classList.add('message--self');
  if (author === 'Chat Bot') message.classList.add('message--chatbot');

  message.innerHTML = `
    <h3 class='message__author'>${userName === author ? 'You' : author}</h3>
    <div class='message__content'>${msgContent}</div>
  `;
  messagesList.appendChild(message);
}

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);