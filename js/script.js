import terminal from './terminal.js';
import gui from './gui.js';
import config from './configs/config.js';
import defaultUserSettings from './configs/userSettings.js';
import portfolio from "./configs/portfolio.js";
import posts from "./configs/posts.js";
import { createElem, scrollToElement } from './helpers.js';

// DOM
const welcomeDialog = document.getElementById('welcomeModal');
const userSettingsDialog = document.getElementById('userSettingsModal');
const settingsBtns = document.querySelectorAll('.settings-btn');

// Startup Functionalities
// Settings and Configs
const settingsKey = 'userSettings';
let userSettings = getSavedSettings();

if (!userSettings.version) {
  deleteUserSettings();
}
else if (userSettings.version !== config.version)
  deleteUserSettings();

userSettings = getSavedSettings();

// Terminal Functionalities
terminal.addCommandLine();
terminal.updatePromptEls();
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
        const contentTab = document.querySelector('.content-tabs');
        scrollToElement(contentTab);
        gui.openTab(btn);
      }
    });
  });
});
gui.populateProfile();
gui.populateTab('portfolio', portfolio);
gui.populateTab('posts', posts);
gui.accords.forEach(accord => {
  const toggle = accord.querySelector('.accord-toggle');
  const content = accord.querySelector('.accord-content');
  const button = accord.querySelector('.accord-toggle button');
  toggle.addEventListener('click', function() {
    if (content.classList.contains('hidden')){
      gui.accords.forEach(accord => {
        const content = accord.querySelector('.accord-content');
        const toggle = accord.querySelector('.accord-toggle');
        const button = accord.querySelector('.accord-toggle button')
        content.classList.add('hidden');
        toggle.classList.remove('active');
        button.textContent = 'expand';
      }) 
      content.classList.remove('hidden');
      this.classList.add('active');
      button.textContent = 'collapse';
      scrollToElement(document.querySelector('.accord'));
    } else {
      content.classList.add('hidden');
      this.classList.remove('active');
      button.textContent = 'expand';
    }
  });
});
gui.tabBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    gui.openTab(btn);
  });
});

setTheme(userSettings.theme);

settingsBtns.forEach((btn) => {
  btn.addEventListener('click', function() {
    openSettings(userSettingsDialog);
  });
});
// ===== Do not move or reorder anything below this point =====
// These two conditional blocks must remain in this exact sequence
// Step 1: Show welcome dialog if enabled in user settings; otherwise focus terminal input
if (userSettings.showWelcome) welcomeDialog.showModal();
// Step 2: Open the appropriate window type (GUI or Terminal) based on user settings
if (userSettings.window === 'gui') openGUI();
else openTerminal();
// ===== Do not move or reorder anything above this point =====

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

userSettingsDialog.querySelector("#customNameInput").value = userSettings.username;

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
        terminal.updatePromptEls();
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

// Helpers
function saveUserSettings(userSettings) {
  localStorage.setItem(settingsKey, JSON.stringify(userSettings));
}

function updateUserSettings(key, value) {
  userSettings[key] = value;
  saveUserSettings(userSettings);
}

function getSavedSettings() {
  let userSettings = localStorage.getItem(settingsKey);
  if (userSettings) userSettings = JSON.parse(userSettings);
  else {
    userSettings = defaultUserSettings;
    localStorage.setItem(settingsKey, JSON.stringify(userSettings));
  }
  return userSettings;
}

function deleteUserSettings() {
  localStorage.clear();
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

export { openGUI, openTerminal, saveUserSettings, getSavedSettings, updateUserSettings, createElem };