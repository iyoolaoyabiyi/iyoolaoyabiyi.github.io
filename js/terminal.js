import commands from './commands.js';
import { getSavedSettings, updateUserSettings } from './script.js';
import { moveCursorToEnd, insertTextAtCursor } from './helpers.js';
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
  body: {
    get element() {
      return document.getElementById('terminal');
    },
    get inputInterface() {
      return document.getElementById('inputInterface');
    }
  },
  _commandLine: document.getElementById('commandLine'),
  get commandLine() {
    return this._commandLine;
  },
  set commandLine(commandLine) {
    this._commandLine = commandLine;
  },
  // Methods
  addCommandLine() {
    const responseInput = document.querySelector('#responseLine .input');
    const commandLineTemplate = document.querySelector('#commandLineTemplate');
    const commandLineClone = commandLineTemplate.content.cloneNode(true);
    const commandLineInput =  commandLineClone.querySelector('.input');
    const userSettings = getSavedSettings();

    commandLineClone.querySelector('[data-type="username"]').textContent = userSettings.username;
    commandLineClone.querySelector('[data-type="hostname"]').textContent = this.hostname;
    commandLineClone.querySelector('[data-type="path"]').textContent = this.currentPath;

    if (responseInput) {
      const isEditable = responseInput.isContentEditable;
      if (isEditable) responseInput.contentEditable = false;
      document.querySelector('#responseLine').id = '';
    }
    // Deactivate current commandLine
    if (this.commandLine) {
      const commandLineInput = this.commandLine.querySelector('.input');
      commandLineInput.contentEditable = false;
      this.commandLine.id = '';
    }
    // Append new commandLine
    commandLineInput.addEventListener('keydown', this.processPrompt.bind(this));
    commandLineInput.addEventListener('paste', function(e) {
      e.preventDefault();
      const content = e.clipboardData.getData("text/plain");
      insertTextAtCursor(content);
    });
    this.body.inputInterface.append(commandLineClone);
    this.commandLine = document.querySelector('#commandLine');
    this.focusInput();
  },
  addResponse(response, isPrompt = false) {
    const terminalResponseLine = document.querySelector('#responseLine');
    const responseLineTemplate = document.querySelector('#responseLineTemplate');
    const responseLineClone = responseLineTemplate.content.cloneNode(true);
    const responseLine = responseLineClone.querySelector('.response');
    const responseEl = responseLine.querySelector('.responseDisplay');
    const responseInput = responseLine.querySelector('.input');
    if (terminalResponseLine) {
      terminalResponseLine.id = '';
      const terminalResponseInput = terminalResponseLine.querySelector('.input');
      if (terminalResponseInput)
        terminalResponseInput.contentEditable = false;
    }
    if (!isPrompt) responseInput.remove();
    responseEl.append(response);
    this.body.inputInterface.appendChild(responseLine);
    if (isPrompt) this.focusInput();
    this.body.inputInterface.scrollTop = this.body.inputInterface.scrollHeight;
  },
  updatePromptEls() {
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
      const commandLineInput = this.commandLine.querySelector('.input');
      commandLineInput.focus();
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
      e.preventDefault();
      if (commandHistory.length > 0) {
        if (this.history.index === null) {
          this.history.unsentCommand = commandLineInput.textContent.trim();
          this.history.index = commandHistory.length;
        }
        if (this.history.index == commandHistory.length) 
          this.history.unsentCommand = commandLineInput.textContent.trim();
        if (this.history.index >= 0) {
          if (this.history.index !== 0) this.history.index--;
          commandLineInput.textContent = commandHistory[this.history.index];
          moveCursorToEnd(commandLineInput);
        };
      }
      return;
    } else if (e.key === 'ArrowDown') {
      if (this.history.index !== null) {
        if (this.history.index < commandHistory.length) {
          if (this.history.index !== commandHistory.length) this.history.index++;
          commandLineInput.textContent = commandHistory[this.history.index];
        }
        if (this.history.index === commandHistory.length) {
          commandLineInput.textContent = this.history.unsentCommand;
          moveCursorToEnd(commandLineInput)
        }
      }
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const prompt = commandLineInput.textContent.trim();
      if (prompt !== '') {
        // Update command history
        if (commandHistory.includes(prompt))
          commandHistory.splice(commandHistory.indexOf(prompt), 1);
        commandHistory.push(prompt);
        updateUserSettings('commandHistory', commandHistory);
        this.history.index = null;
        // Check if command is valid add response
        const [ command, ...args ] = prompt.split(' ');
        let response = this.executeCommand(command, args);
        if (response) this.addResponse(response);
      }
      if (!this.needResponse) {
        this.addCommandLine();
      }
    }
  }
}

export default terminal;