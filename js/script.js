import terminal from './terminal.js';
import gui from './gui.js';
import defaultUserSettings from './configs/userSettings.js';
import portfolio from "./configs/portfolio.js";
import posts from "./configs/posts.js";

// DOM
const welcomeDialog = document.getElementById('welcomeModal');
const userSettingsDialog = document.getElementById('userSettingsModal');
const settingsBtns = document.querySelectorAll('.settings-btn');
let terminalInput = null;

// Settings and Configs
const userSettings = getSavedSettings();

// Startup Functionalities
terminal.addCommandLine();
terminalInput = terminal.commandLine.querySelector('.input');

setTheme(userSettings.theme);

settingsBtns.forEach((btn) => {
  btn.addEventListener('click', function() {
    openSettings(userSettingsDialog);
  });
});

if (userSettings.showWelcome) {
  welcomeDialog.showModal();
} else {
  terminal.focusInput();
}

if (userSettings.window === 'gui') openGUI();
else openTerminal();


// Modals Functionality
checkWelcomeChkBxes();

document.querySelectorAll('.open-gui-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    welcomeDialog.close();
    openGUI();
  });
});

document.querySelectorAll('[data-type="close-diag-btn"').forEach((btn) => {
  btn.addEventListener('click', function() {
    document.getElementById(this.dataset.btnFor).close();
    });
  });

welcomeDialog.addEventListener('close', () => {
  userSettingsDialog.showModal();
  if (document.getElementById('setFirstTimeInput').checked) 
    updateUserSettings('showWelcome', true);
  else updateUserSettings('showWelcome', false);
});

userSettingsDialog.addEventListener('close', () => {
  if (userSettings.window === 'terminal') 
    terminal.focusInput();
});

welcomeDialog.querySelector('#setFirstTimeInput')
  .addEventListener('change', function() {
    if (this.checked) updateUserSettings('showWelcome', true);
    else updateUserSettings('showWelcome', false);
    checkWelcomeChkBxes();
  });

// Settings Functionality
userSettingsDialog.querySelector("#welcomeModalChk")
  .addEventListener('change', function() {
    updateUserSettings('showWelcome', this.checked);
    checkWelcomeChkBxes();
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
        userSettings.username = username;
        saveUserSettings(userSettings);
        terminal.setOptions();
      } else {
        const errEl = userSettingsDialog.querySelector('#err');
        errEl.innerHTML = "You need to enter a username with 12 maximum characters";
        errEl.style.color = 'red';
        errEl.style.display = "block";
        isErr = true;
      }
    }
    if (!isErr) {
      userSettingsDialog.close();
    }
});

userSettingsDialog.querySelector('#setDarkModeInput')
  .addEventListener('change', function() {
    if (this.checked) {
      updateUserSettings('theme', 'dark');
    } else {
      updateUserSettings('theme', 'light');
    }
    document.documentElement.dataset.theme = userSettings.theme;
  });

userSettingsDialog.querySelector('#darkModeInput')
  .addEventListener('click', function() {
    const checkBox = this.querySelector('#setDarkModeInput');
    checkBox.checked = !checkBox.checked;
    checkBox.dispatchEvent(new Event('change'));
  });

welcomeDialog.querySelector('#setFirstTimeInput')
  .addEventListener('change', function() {
    if (this.checked) updateUserSettings('showWelcome', true);
    else updateUserSettings('showWelcome', false);
  });

  userSettingsDialog.querySelector('#openWelcomeModalBtn')
    .addEventListener('click', () => welcomeDialog.showModal());

// Terminal Functionalities
terminal.setOptions();
terminal.body.element.addEventListener('click', terminal.focusInput.bind(terminal));
terminal.openGuiBtn.addEventListener('click', openGUI);

// GUI Functionalities
gui.activateMenu();
gui.openTerminalBtn.addEventListener('click', () => {
  openTerminal();
});
gui.navItems.forEach((item) => {
  item.addEventListener('click', function() {
    const navTab = this.dataset.tabFor;
    
    gui.tabBtns.forEach(btn => {
      if (navTab === btn.dataset.tabFor) {
        document.querySelector('.description').scrollIntoView({behavior: 'smooth'});
        gui.openTab(btn);
      }
    });
  });
});
gui.tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    gui.openTab(btn);
  });
});
gui.populateTab('portfolio', portfolio);
gui.populateTab('posts', posts);

// Helpers
function saveUserSettings(userSettings) {
  localStorage.setItem('userSettings', JSON.stringify(userSettings));
}

function updateUserSettings(key, value) {
  userSettings[key] = value;
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
    document.querySelector('#setDarkModeInput').checked = true;
  } else {
    document.querySelector('#setDarkModeInput').checked = false;
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
    terminal.focusInput();
    updateUserSettings('window', 'terminal');
  }
}

function openSettings(dialog) {
  dialog.showModal();
  if (dialog.open) {
    dialog.querySelector('#err').style.display = 'none';
    dialog.querySelector('#customNameInput').value = userSettings.username;
  }
}

function checkWelcomeChkBxes() {
  welcomeDialog.querySelector('#setFirstTimeInput').checked = userSettings.showWelcome;
  userSettingsDialog.querySelector("#welcomeModalChk").checked = userSettings.showWelcome;
}

export { openGUI, openTerminal, saveUserSettings, getSavedSettings, updateUserSettings };