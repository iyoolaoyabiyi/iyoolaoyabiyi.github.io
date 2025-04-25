import terminal from './terminal.js';
import gui from './gui.js';
import defaultUserData from './configs/userData.js';

// DOM
const welcomeDialog = document.getElementById('welcomeModal');

// Data and Configs
let user = localStorage.getItem('userData');

// Modal Functionality
if (user) {
  user = JSON.parse(user);
} else {
  user = defaultUserData;
  updateUser(user);
}

if (user.firstTime) {
  welcomeDialog.showModal();
  user.firstTime = false;
  updateUser(user);
} else {
  terminal.commandLine.querySelector('input').focus();
}

document.querySelectorAll('.open-gui-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    welcomeDialog.close();
    openGUI();
  });
});

document.querySelectorAll('.close-modal-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    welcomeDialog.close();
    terminal.commandLine.querySelector('input').focus();
  });
});

// Terminal Functionalities
terminal.addOptions();
terminal.body.element.addEventListener('click', terminal.focusInput.bind(terminal));
terminal.commandLine.querySelector('input').addEventListener('keydown', terminal.processPrompt.bind(terminal));
// commandLineInput.focus();
terminal.openGuiBtn.addEventListener('click', openGUI);

// GUI Functionalities
gui.activateMenu();
gui.openTerminalBtn.addEventListener('click', () => {
  openTerminal();
});
gui.tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!btn.classList.contains('active')) {
      gui.tabBtns.forEach(btn => {
        btn.classList.remove('active');
      });
      btn.classList.add('active');
      gui.tabs.forEach(tab => {
        if (btn.dataset.tabFor === tab.id) {
          gui.tabs.forEach(tab => {
            tab.classList.add('hidden');
          })
          tab.classList.remove('hidden');
        }
      })
    }
  });
});

// Helpers
function updateUser(userData) {
  localStorage.setItem('userData', JSON.stringify(userData));
}

function openGUI() {
  if (gui.window.classList.contains("hidden")) {
    terminal.window.classList.add("hidden");
    gui.window.classList.remove("hidden");
  }
}

function openTerminal() {
  if (terminal.window.classList.contains("hidden")) {
    gui.window.classList.add("hidden");
    terminal.window.classList.remove("hidden");
    terminal.commandLine.querySelector('input').focus();
  }
}

export { openGUI, openTerminal };