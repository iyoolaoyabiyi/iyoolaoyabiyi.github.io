import commands from './commands.js';
import { getSavedSettings, updateUserSettings } from './script.js';

// Terminal Object
const terminal = {
  // Options
  hostname: 'iyosWebsite',
  currentPath: '~',
  needResponse: false,
  history: {
    index: null,
    unsentCommand: ''
  },
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
  addCommandLine() {
    let commandLineInput;
    const responseInput = document.querySelector('#responseLine .input');
    const commandLineTemplate = document.querySelector('#commandLineTemplate');
    const commandLineClone = commandLineTemplate.content.cloneNode(true);
    const commandLine = commandLineClone.querySelector('.line');
    const usernameEl = commandLineClone.querySelector('[data-type="username"]');
    const hostnameEl = commandLineClone.querySelector('[data-type="hostname"]');
    const pathEl = commandLineClone.querySelector('[data-type="path"]');

    const userSettings = getSavedSettings();

    if (responseInput) {
      if (!responseInput.disabled) responseInput.disabled = true;
    }
    
    usernameEl.textContent = userSettings.username;
    hostnameEl.textContent = this.hostname;
    pathEl.textContent = this.currentPath;

    if (this.commandLine) {
      commandLineInput = this.commandLine.querySelector('.input');
      // Deactivate current commandLine
      commandLineInput.disabled = true;
      commandLineInput.removeAttribute('autofocus');
      commandLineInput.removeEventListener('keydown', this.processPrompt);
      this.commandLine.id = '';
    }
    // Append new commandLine
    this.commandLine = commandLine;
    commandLineInput = this.commandLine.querySelector('.input');
    commandLineInput.disabled = false;
    this.body.inputInterface.append(this.commandLine);
    commandLineInput.focus();
    commandLineInput.addEventListener('keydown', this.processPrompt.bind(terminal));
  },
  addResponse(response, isPrompt = false) {
    const terminalResponseLine = document.querySelector('#responseLine');
    let terminalResponseInput = null;
    const responseLineTemplate = document.querySelector('#responseLineTemplate');
    const responseLineClone = responseLineTemplate.content.cloneNode(true);
    const responseLine = responseLineClone.querySelector('.response');
    const responseEl = responseLine.querySelector('.responseDisplay');
    const responseInput = responseLine.querySelector('.input');
    if (terminalResponseLine) {
      terminalResponseLine.id = '';
      terminalResponseInput = terminalResponseLine.querySelector('.input');
    }
    if (terminalResponseInput)
      terminalResponseInput.disabled = true;
    if (!isPrompt) responseInput.remove();
    responseEl.append(response);
    this.body.inputInterface.appendChild(responseLine);
    if (isPrompt) responseInput.focus();
    this.body.inputInterface.scrollTop = this.body.inputInterface.scrollHeight; 
  },
  body: {
    get element() {
      return document.getElementById('terminal');
    },
    get inputInterface() {
      return document.getElementById('inputInterface');
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
      responseLine.querySelector('.input').focus();
    } else {
      this.commandLine.querySelector('.input').focus();
    }
  },
  executeCommand(command, args) {
    const output = document.createElement('p');
    for (let i = 0; i < commands.length; i++) {
      const commandObj = commands[i];
      if (commandObj.doc.aliases.includes(command) || commandObj.doc.name === command) {
        return commandObj.execute(args);
      }
    }
    output.textContent = `Command not found: ${command}`;
    return output;
  },
  processPrompt(e) {
    let commandLineInput = this.commandLine.querySelector('.input');
    const { commandHistory } = getSavedSettings();
    if (e.key === 'ArrowUp') {
      if (commandHistory.length > 0) {
        if (this.history.index === null) {
          this.history.unsentCommand = commandLineInput.value.trim();
          this.history.index = commandHistory.length;
        }
        if (this.history.index == commandHistory.length) 
          this.history.unsentCommand = commandLineInput.value.trim();
        if (this.history.index >= 0) {
          if (this.history.index !== 0) this.history.index--;
          commandLineInput.value = commandHistory[this.history.index];
        };
      }
      e.preventDefault();
      return;
    } else if (e.key === 'ArrowDown') {
      if (this.history.index !== null) {
        if (this.history.index < commandHistory.length) {
          if (this.history.index !== commandHistory.length) this.history.index++;
          commandLineInput.value = commandHistory[this.history.index];
        }
        if (this.history.index === commandHistory.length) {
          commandLineInput.value = this.history.unsentCommand;
        }
      }
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter') {
      const prompt = commandLineInput.value.trim();
      if (prompt !== '') {
        if (commandHistory.includes(prompt))
          commandHistory.splice(commandHistory.indexOf(prompt), 1);
        commandHistory.push(prompt);
        updateUserSettings('commandHistory', commandHistory);
        this.history.index = null;
        // Check if command is valid
        const [ command, ...args ] = prompt.split(' ');
        let response = this.executeCommand(command, args);
        if (response) this.addResponse(response);
      }
      if (!terminal.needResponse) {
        this.addCommandLine();
      }
    }
  }
}

export default terminal;