"use strict";

const msgZoneA = document.getElementById("msg-zone-a");
const msgZoneB = document.getElementById("msg-zone-b");

const inputTextA = document.getElementById("text-input-a");
const inputTextB = document.getElementById("text-input-b");

function sendToA() {
  const text = inputTextB.value;

  if (!text) {
    return;
  }

  sendMessage(msgZoneA, text, "incoming", "B");
  sendMessage(msgZoneB, text);
  // clear text input
  inputTextB.value = "";
}

function sendToB() {
  const text = inputTextA.value;

  if (!text) {
    return;
  }

  sendMessage(msgZoneB, text, "incoming", "A");
  sendMessage(msgZoneA, text);
  //clear text input
  inputTextA.value = "";
}

function sendMessage(element, text, className = "", user = "") {
  const span = document.createElement("span");
  span.className = `msg ${className}`;

  // sender avatar
  if (user) {
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.innerHTML = user;
    span.append(dot);
  }

  // const date = new Date();
  //   span.innerHTML = `${date.getHours()}:${date.getMinutes()} - ${text}`;
  span.append(text);

  // add text span to the message zone
  element.append(span);

  // auto scroll to the end of the message zone
  element.scrollTop = element.scrollHeight;

  return span;
}
