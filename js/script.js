import terminal from './terminal.js';
import gui from './gui.js';
import defaultUserData from './configs/userData.js';
import portfolio from "./configs/portfolio.js";
import posts from "./configs/posts.js";

// DOM
const welcomeDialog = document.getElementById('welcomeModal');
const userSettingsDialog = document.getElementById('userSettingsModal');

// Data and Configs
let userData = getSavedData();

// document.documentElement.dataset.theme = userData.theme;

if (userData.firstTime) {
  welcomeDialog.showModal();
  updateUserData('firstTime', false);
} else {
  handleViewChangeFocus();
}

if (userData.window === 'gui') openGUI();
else openTerminal();

// Modals Functionality
document.querySelectorAll('.open-gui-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    welcomeDialog.close();
    openGUI();
  });
});

document.querySelectorAll('[data-type="close-diag-btn"').forEach((btn) => {
  btn.addEventListener('click', function() {
    document.getElementById(this.dataset.btnFor).close();
    switch (this.dataset.btnFor) {
        case 'userSettingsModal':
          handleViewChangeFocus();
          break;
      }
    });
  });
    
welcomeDialog.addEventListener('close', () => {
  userSettingsDialog.showModal(); 
});

userSettingsDialog.querySelector('#setCustomNameInput')
  .addEventListener('change', function() {
    const userNameSetup = userSettingsDialog.querySelector('#userNameSetup');
    userNameSetup.style.display = this.checked ? 'flex' : 'none';
});

userSettingsDialog.querySelector('#saveSettingsBtn')
  .addEventListener('click', function() {
    const userNameSetup = userSettingsDialog.querySelector("#userNameSetup");
    const usernameInput = userSettingsDialog.querySelector("#customNameInput");
    let isErr = false;
    if (userNameSetup.style.display === 'flex') {
      if (usernameInput.value && usernameInput.value.length <= 12) {
        let username = usernameInput.value;
        userData.username = username;
        saveUserData(userData);
        terminal.addOptions();
      } else {
        const errEl = userSettingsDialog.querySelector('#err');
        errEl.innerHTML = "You need to enter a username with 12 maximum characters";
        errEl.style.color = 'red';
        errEl.style.display = "block";
        isErr = true;
        // Remember to hide errEl when opening modal with settings button
      }
    }
    if (!isErr) {
      userSettingsDialog.close();
      handleViewChangeFocus();
    }
});

// Terminal Functionalities
terminal.addOptions();
terminal.body.element.addEventListener('click', terminal.focusInput.bind(terminal));
terminal.commandLine.querySelector('input')
  .addEventListener('keydown', terminal.processPrompt.bind(terminal));
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
gui.populateTab('portfolio', portfolio);
gui.populateTab('posts', posts);

// Temp
// localStorage.clear();
// userSettingsDialog.showModal();


// Helpers
function saveUserData(userData) {
  localStorage.setItem('userData', JSON.stringify(userData));
}

function updateUserData(key, value) {
  userData[key] = value
  saveUserData(userData);
}

function getSavedData() {
  let userData = localStorage.getItem('userData');
  if (userData) userData = JSON.parse(userData);
  else {
    userData = defaultUserData;
    localStorage.setItem('userData', JSON.stringify(userData));
  }
  return userData;
}

function handleViewChangeFocus() {
  if (userData.window === 'terminal') {
    terminal.commandLine.querySelector('input').focus();
  }
}

function openGUI() {
  if (gui.window.classList.contains("hidden")) {
    terminal.window.classList.add("hidden");
    gui.window.classList.remove("hidden");
    updateUserData('window', 'gui');
  }
}

function openTerminal() {
  if (terminal.window.classList.contains("hidden")) {
    gui.window.classList.add("hidden");
    terminal.window.classList.remove("hidden");
    terminal.commandLine.querySelector('input').focus();
    updateUserData('window', 'terminal');
  }
}

export { openGUI, openTerminal, saveUserData, getSavedData, updateUserData };