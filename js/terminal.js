import commands from './commands.js';
import { getSavedSettings, openGUI, updateUserSettings } from './script.js';
import defaultUserSettings from './configs/userSettings.js';

// let userSettings = localStorage.getItem('userSettings');

// if (userSettings) {
//   Object.assign(userSettings, JSON.parse(userSettings));
// } else {
//   userSettings = defaultUserSettings;
//   saveUserSettings(userSettings);
// }

// console.log(userSettings);

// Terminal Object
const terminal = {
  // options
  // user: 'guest',
  hostname: 'IyosWebServer',
  currentPath: '~',
  needResponse: false,
  commands: commands,
  // DOM
  window: document.getElementById('terminalWindow'),
  openGuiBtn: document.getElementById('openGuiBtn'),
  _commandLine: document.getElementById('commandLine'),
  body: {
    get element() {
      return document.getElementById('terminal')
    },
    addResponse(response, isPrompt = false) {
      const responseLine = document.createElement('div');
      responseLine.classList.add('text-color');
      if (isPrompt) {
        responseLine.classList.add('response');
        responseLine.id = 'responseLine';
      }
      responseLine.innerHTML =`
        <p class="response-text">${response}</p>
        ${isPrompt ? '<input type="text" class="input" />' : ''}
      `;
      this.element.append(responseLine);
      this.element.scrollTop = this.element.scrollHeight;
    },
    addCommandLine() {
      const commandLine = document.createElement('div');
      const userSettings = getSavedSettings();
      let commandLineInput = null;
      commandLine.classList.add('line');
      commandLine.id = 'commandLine';
      commandLine.innerHTML = `
        <p class="prompt">
          <span data-type="username">${userSettings.username}</span>
          @
          <span data-type="hostname">${terminal.hostname}</span>
          :
          <span data-type="path">${terminal.currentPath}</span>
          $
        </p>
        <input class="input" type="text" />
      `;
      if (terminal.commandLine) {
        commandLineInput = terminal.commandLine.querySelector('input');
        // Deactivate commandLine
        commandLineInput.disabled = true;
        commandLineInput.removeAttribute('autofocus');
        commandLineInput.removeEventListener('keydown', terminal.processPrompt);
        terminal.commandLine.id = '';
      }
      // Append new commandLine
      terminal.commandLine = commandLine;
      commandLineInput = terminal.commandLine.querySelector('input');
      commandLineInput.disabled = false;
      this.element.append(terminal.commandLine);
      commandLineInput.focus();
      commandLineInput.addEventListener('keydown', terminal.processPrompt.bind(terminal));
    }
  },
  get commandLine() {
    return this._commandLine;
  },
  set commandLine(commandLine) {
    this._commandLine = commandLine;
  },
  // Methods
  clear() {
    this.body.element.innerHTML = '';
  },
  addOptions() {
    const userSettings = getSavedSettings();
    document.querySelectorAll('[data-type="username"]').forEach(el => {
      el.textContent = userSettings.username;
    });
    document.querySelectorAll('[data-type="hostname"]').forEach(el => {
      el.textContent = this.hostname;
    });
    document.querySelectorAll('[data-type="path"]').forEach(el => {
      el.textContent = this.currentPath;
    });
  },
  resetOptions() {
    // this.user = 'guest';
    this.hostname = 'iyoswebserver';
    this.currentPath = '~';
  },
  focusInput() {
    if (this.needResponse) {
      const responseLine = document.getElementById('responseLine');
      responseLine.querySelector('input').focus();
    } else {
      this.commandLine.querySelector('input').focus();
    }
  },
  executeCommand(command, args) {
    const commandObj = this.commands[command];
    switch (command) {
      case this.commands.echo.name:
        return commandObj.execute(args);
      case this.commands.clear.name:
        return commandObj.execute(terminal.clear.bind(terminal));
      case this.commands.list.name:
        return commandObj.execute(terminal, args);
      case this.commands.goto.name:
        return commandObj.execute(terminal, args);
      case this.commands.open.name:
        return commandObj.execute(terminal, args);
      case this.commands.exit.name:
        return commandObj.execute(() => {
          let responseInput = null;
          terminal.needResponse = true;
          this.body.addResponse('Are you sure you want to quit?(yes/no)', true);
          responseInput = document.querySelector('#responseLine input');
          responseInput.focus();
          responseInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
              const response = responseInput.value;
              terminal.needResponse = false;
              switch (response.toLowerCase()) {
                case 'yes':
                case 'y':
                  terminal.clear();
                  terminal.resetOptions();
                  terminal.addOptions();
                  this.body.addCommandLine();
                  openGUI();
                  break;
                default:
                  document.querySelector('#responseLine').id = '';
                  this.body.addCommandLine();
              }
            }
          })
        });
      case this.commands.help.name:
        return commandObj.execute(args);
      case this.commands.whoami.name:
        return commandObj.execute(whoamiFunc, args);
      case this.commands.username.name:
        return commandObj.execute(usernameFunc, args);
      default: 
        return `command not found: ${command}`;
    }
  },
  processPrompt(e) {
    let commandLineInput = this.commandLine.querySelector('input');
    if (e.key === 'Enter') {
      const prompt = commandLineInput.value.trim();
      if (prompt !== '') {
        // Check if command is valid
        const [ command, ...args ] = prompt.split(' ');
        let response = this.executeCommand(command, args);
        if (response) this.body.addResponse(response);
      }
      if (!terminal.needResponse) this.body.addCommandLine();
    }
  }
}

function whoamiFunc(args) {
  const users = ['iyo', 'iyoola', 'iyoolaoyabiyi'];
  if (args.length > 1) return `Usage: whoami [user]`;
  if (args.length < 1) {
    const userSettings = getSavedSettings();
    return userSettings.username;
  }
  if (users.includes(args[0])) return `${args[0]} is an awesome programmer!`;
  else return 'Unknown user';
}

function usernameFunc(args) {
  const userSettings = getSavedSettings();
  const username = args[0];
  if (args.length < 1) return userSettings.username;
  if (args.length > 1) return `Usage: username [new username]`;
  if (args[0].length < 3 || args.length >= 12) 
    return `Username must be at least 3 characters and not more than 12 characters long`;
  updateUserSettings('username', username);
  terminal.addOptions();
  return `Username changed to ${username}`;
}

export default terminal;