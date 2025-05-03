import commands from './commands.js';
import FILESYSTEM from './configs/filesystem.js';
import { getSavedSettings, openGUI, updateUserSettings } from './script.js';

// Terminal Object
const terminal = {
  // options
  hostname: 'IyosWebServer',
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
      const responseEl = responseLine.querySelector('.response-text');
      const responseInput = responseLine.querySelector('input');

      if (!isPrompt) responseInput.remove();
      responseEl.innerHTML = response;
      this.inputInterface.append(responseLine);
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
    const commandObj = commands[command];
    switch (command) {
      case commands.echo.name:
        return commandObj.execute(echoFunc, args);
      case commands.clear.name:
        return commandObj.execute(clearFunc, args);
      case commands.list.name:
        return commandObj.execute(listFunc, args);
      case commands.goto.name:
        return commandObj.execute(gotoFunc, args);
      case commands.open.name:
        return commandObj.execute(openFunc, args);
      case commands.exit.name:
        return commandObj.execute(exitFunc, args);
      case commands.help.name:
        return commandObj.execute(helpFunc, args);
      case commands.whoami.name:
        return commandObj.execute(whoamiFunc, args);
      case commands.username.name:
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

// Command Functions
function addCommandLine() {
  let commandLineInput;
  const commandLineTemplate = document.querySelector('#commandLineTemplate');
  const commandLineClone = commandLineTemplate.content.cloneNode(true);
  const commandLine = commandLineClone.querySelector('.line');
  const usernameEl = commandLineClone.querySelector('[data-type="username"]');
  const hostnameEl = commandLineClone.querySelector('[data-type="hostname"]');
  const pathEl = commandLineClone.querySelector('[data-type="path"]');

  const userSettings = getSavedSettings();
  
  // commandLine.id = 'commandLine';
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
  // console.log(terminal.commandLine);
  commandLineInput = terminal.commandLine.querySelector('input');
  commandLineInput.disabled = false;
  terminal.body.inputInterface.append(terminal.commandLine);
  commandLineInput.focus();
  commandLineInput.addEventListener('keydown', terminal.processPrompt.bind(terminal));
}
function helpFunc(args) {
  const commandsList = Object.keys(commands) 
  let output = '';
  if (args.length >= 1) {
    if (args.length === 1) {
      const command = args[0];
      for (let i = 0; i < commandsList.length; i++) {
        if (command === commandsList[i]) {
          output = `<p>${commands[command].description}</p>`;
          break;
        } else {
          output = `Unknown command ${command}`;
        }
      }
    } else {
      output = `Usage: help &lt;command&gt;`;
    }
  } else {
    output = '<p>Available commands:</p>';
    commandsList.forEach(key => {
      output += `<p>${key}: ${commands[key].description}</p>`;
    });
  }
  return output.trim();
}

function echoFunc(args) {
  const cleanedArgs = args.map(item => item.replace(/^['"]+|['"]+$/g, ''));
  return cleanedArgs.join(' ');
}

function clearFunc(args) {
  terminal.body.inputInterface.innerHTML = '';
  return null;
}

function listFunc(args) {
  if (args.length > 1) 
    return `Usage: list [&lt;directory&gt;]`;
  let path = args[0];
  if (!path) path = terminal.currentPath;
  const { dirObj, clearedPath } = getDirObj(path, terminal.currentPath, FILESYSTEM);
  
  if (!dirObj) return `${clearedPath} does not exist`;
  if (dirObj.type !== 'directory') return `${clearedPath} is not a directory`;
  return Object.keys(dirObj.content).join(' ');
}

function gotoFunc(args) {
  if (args.length === 0) return 'No directory specified';
  if (args.length > 1) return `Usage: goto &lt;directory&gt;`;

  const path = args[0];
  const { dirObj, clearedPath} = getDirObj(path, terminal.currentPath, FILESYSTEM);
  
  if (!dirObj) return `${clearedPath} does not exist`;
  if (dirObj.type !== 'directory') return `${clearedPath} is not a directory`;
  terminal.currentPath = clearedPath;
  terminal.setOptions();
  return `Changed directory to ${terminal.currentPath}`;
}

function openFunc(args) {
  if (args.length === 0) return 'No file specified';
  if (args.length > 1) return `Usage: open &lt;file&gt;`;
  const path = args[0];
  const { dirObj, clearedPath} = getDirObj(path, terminal.currentPath, FILESYSTEM);
  
  if (!dirObj) return `${clearedPath} does not exist`;
  if (dirObj.type === 'directory') return `${clearedPath} is not a file`;
  return dirObj.content;
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
  terminal.setOptions();
  return `Username changed to ${username}`;
}

function exitFunc(args) {
  let responseInput = null;
  terminal.needResponse = true;
  terminal.body.addResponse('Are you sure you want to quit?(yes/no)', true);
  responseInput = document.querySelector('.response input');
  responseInput.focus();
  responseInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const response = responseInput.value;
      terminal.needResponse = false;
      switch (response.toLowerCase()) {
        case 'yes':
        case 'y':
          terminal.body.inputInterface.innerHTML = '';
          terminal.resetOptions();
          terminal.setOptions();
          openGUI();
          break;
        default:
          document.querySelector('#responseLine').id = '';
        }
        terminal.body.addCommandLine();
    }
  })
  return null;
}

// Helpers
function getDirObj(path, currentPath, fileSystem) {
  let segments = [];
  let pathStack = [];
  let dirObj = fileSystem['~'];
  let clearedPath = '';

  if (path.startsWith('~')) {
    segments = path.split('/');
  } else if (path.startsWith('/')) {
    segments = path.split('/');
    segments[0] = '~';
  } else {
    segments = currentPath.split('/').concat(path.split('/'));
  }

  for (let part of segments) {
    if (part === '' || part === '.') continue;
    if (part === '..') {
      if (pathStack.length > 1) pathStack.pop();
    } else {
      pathStack.push(part);
    }
  }

  clearedPath = pathStack.join('/');

  for (let i = 1; i < pathStack.length; i++) {
    if (dirObj.content && dirObj.content[pathStack[i]]) {
      dirObj = dirObj.content[pathStack[i]];
    } else {
      return { dirObj: null, clearedPath: clearedPath };
    }
  }
  return { dirObj: dirObj, clearedPath: clearedPath };
}

export default terminal;