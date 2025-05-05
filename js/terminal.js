import commands from './commands.js';
import { getSavedSettings } from './script.js';

// Terminal Object
const terminal = {
  // Options
  hostname: 'iyosWebsite',
  currentPath: '~',
  needResponse: false,
  // DOM
  window: document.getElementById('terminalWindow'),
  openGuiBtn: document.getElementById('openGuiBtn'),
  _commandLine: document.getElementById('commandLine'),
  get commandLine() {
    return this._commandLine;
  },
  set commandLine(commandLine) {
    this._commandLine = commandLine;
  },
  body: {
    get element() {
      return document.getElementById('terminal');
    },
    get inputInterface() {
      return document.getElementById('inputInterface');
    },
    addCommandLine() {
      addCommandLine();
    },
    addResponse(response, isPrompt = false) {
      const responseLineTemplate = document.querySelector('#responseLineTemplate');
      const responseLineClone = responseLineTemplate.content.cloneNode(true);
      const responseLine = responseLineClone.querySelector('.response');
      const responseEl = responseLine.querySelector('.responseDisplay');
      const responseInput = responseLine.querySelector('input');

      if (!isPrompt) responseInput.remove();
      responseEl.append(response);
      this.inputInterface.appendChild(responseLine);
      this.inputInterface.scrollTop = this.inputInterface.scrollHeight; 
    }
  },
  // Methods
  setOptions() {
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
    const output = document.createElement('p');
    for (let i = 0; i < commands.length; i++) {
      const commandObj = commands[i];
      if (commandObj.name.includes(command)) {
        return commandObj.execute(args);
      }
    }
    output.textContent = `Command not found: ${command}`;
    return output;
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

function addCommandLine() {
  let commandLineInput;
  const commandLineTemplate = document.querySelector('#commandLineTemplate');
  const commandLineClone = commandLineTemplate.content.cloneNode(true);
  const commandLine = commandLineClone.querySelector('.line');
  const usernameEl = commandLineClone.querySelector('[data-type="username"]');
  const hostnameEl = commandLineClone.querySelector('[data-type="hostname"]');
  const pathEl = commandLineClone.querySelector('[data-type="path"]');

  const userSettings = getSavedSettings();
  
  usernameEl.textContent = userSettings.username;
  hostnameEl.textContent = terminal.hostname;
  pathEl.textContent = terminal.currentPath;

  if (terminal.commandLine) {
    commandLineInput = terminal.commandLine.querySelector('input');
    // Deactivate current commandLine
    commandLineInput.disabled = true;
    commandLineInput.removeAttribute('autofocus');
    commandLineInput.removeEventListener('keydown', terminal.processPrompt);
    terminal.commandLine.id = '';
  }
  // Append new commandLine
  terminal.commandLine = commandLine;
  commandLineInput = terminal.commandLine.querySelector('input');
  commandLineInput.disabled = false;
  terminal.body.inputInterface.append(terminal.commandLine);
  commandLineInput.focus();
  commandLineInput.addEventListener('keydown', terminal.processPrompt.bind(terminal));
}

export default terminal;