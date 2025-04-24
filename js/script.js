import terminal from './terminal.js';
import gui from './gui.js';

// DOM
const closeModalBtn = document.getElementById('closeModal');
const dialog = document.getElementById('welcomeModal');
const openTerminalBtn = document.getElementById('openTerminalBtn');

// Modal Functionality
closeModalBtn.addEventListener('click', () => {
  dialog.close();
  document.querySelector('#commandLine input').focus();
});

openTerminalBtn.addEventListener('click', () => {
  dialog.close();
  terminal.focusInput()
  terminal.window.classList.remove("hidden");
  document.querySelector('.gui-window').classList.add("hidden");
  terminal.focusInput()
});
// dialog.showModal();

terminal.addOptions();
terminal.body.element.addEventListener('click', terminal.focusInput.bind(terminal));
terminal.commandLine.querySelector('input').addEventListener('keydown', terminal.processPrompt.bind(terminal));
// commandLineInput.focus();
terminal.openGuiBtn.addEventListener('click', terminal.openGUI.bind(terminal) );

dialog.showModal();
gui.activate();