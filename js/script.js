import terminal from './terminal.js';

// DOM
// const openBtn = document.getElementById('openModalBtn);
const closeBtn = document.getElementById('closeModal');
const dialog = document.getElementById('welcomeModal');
const openTerminalBtn = document.getElementById('openTerminalBtn');

// Modal Functionality
// openBtn.addEventListener('click', () => {
//   dialog.showModal();
// });

closeBtn.addEventListener('click', () => {
  dialog.close();
  commandLineInput.focus();
});
openTerminalBtn.addEventListener('click', () => {
  dialog.close();
  terminal.focusInput()
  terminal.window.classList.remove("hidden");
  document.querySelector('.gui').classList.add("hidden");
  terminal.focusInput()
});
// dialog.showModal();

terminal.addOptions()
terminal.body.element.addEventListener('click', terminal.focusInput.bind(terminal));
terminal.commandLine.querySelector('input').addEventListener('keydown', terminal.processPrompt.bind(terminal));
// commandLineInput.focus();
terminal.openGuiBtn.addEventListener('click', terminal.openGUI.bind(terminal) );