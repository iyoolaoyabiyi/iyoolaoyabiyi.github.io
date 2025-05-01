import terminal from './terminal.js';
import gui from './gui.js';
import defaultUserSettings from './configs/userSettings.js';
import portfolio from "./configs/portfolio.js";
import posts from "./configs/posts.js";

// DOM
const welcomeDialog = document.getElementById('welcomeModal');
const userSettingsDialog = document.getElementById('userSettingsModal');
const settingsBtns = document.querySelectorAll('.settings-btn');

// Settings and Configs
let userSettings = getSavedSettings();

// General Functionalities
setTheme(userSettings.theme);

settingsBtns.forEach((btn) => {
  btn.addEventListener('click', function() {
    userSettingsDialog.showModal();
  });
});

if (userSettings.firstTime) {
  welcomeDialog.showModal();
  updateUserSettings('firstTime', false);
} else {
  handleViewChangeFocus();
}

if (userSettings.window === 'gui') openGUI();
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

// Settings Functionality
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
        userSettings.username = username;
        saveUserSettings(userSettings);
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

userSettingsDialog.querySelector('#setDarkMode')
  .addEventListener('change', function() {
    if (this.checked) {
      document.documentElement.dataset.theme = 'dark';
      updateUserSettings('theme', 'dark');
    } else {
      document.documentElement.dataset.theme = 'light';
      updateUserSettings('theme', 'light');
    }
  })

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
function saveUserSettings(userSettings) {
  localStorage.setItem('userSettings', JSON.stringify(userSettings));
}

function updateUserSettings(key, value) {
  userSettings[key] = value
  saveUserSettings(userSettings);
}

function getSavedSettings() {
  let userSettings = localStorage.getItem('userSettings');
  if (userSettings) userSettings = JSON.parse(userSettings);
  else {
    userSettings = defaultUserSettings;
    localStorage.setItem('userSettings', JSON.stringify(userSettings));
  }
  return userSettings;
}

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  updateUserSettings('theme', theme);
  if (theme === 'dark') {
    document.querySelector('#setDarkMode').checked = true;
  } else {
    document.querySelector('#setDarkMode').checked = false;
  }
}

function handleViewChangeFocus() {
  if (userSettings.window === 'terminal') {
    terminal.commandLine.querySelector('input').focus();
  }
}

function openGUI() {
  if (gui.window.classList.contains("hidden")) {
    terminal.window.classList.add("hidden");
    gui.window.classList.remove("hidden");
    updateUserSettings('window', 'gui');
  }
}

function openTerminal() {
  if (terminal.window.classList.contains("hidden")) {
    gui.window.classList.add("hidden");
    terminal.window.classList.remove("hidden");
    terminal.commandLine.querySelector('input').focus();
    updateUserSettings('window', 'terminal');
  }
}

export { openGUI, openTerminal, saveUserSettings, getSavedSettings, updateUserSettings };