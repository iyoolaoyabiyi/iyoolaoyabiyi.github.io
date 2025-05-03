import { getSavedSettings, openGUI, updateUserSettings } from './script.js';
import terminal from "./terminal.js";
import FILESYSTEM from './configs/filesystem.js';

class COMMAND {
  constructor(name, description, isQuery, executeFunction) {
    this.name = name;
    this.description = description;
    this.isQuery = isQuery;
    this.executeFunction = executeFunction
  }
  execute(args) {
    return this.executeFunction(args);
  }
}

const echo = new COMMAND(
  ['echo', 'write'],
  'Display a line of text',
  false,
  echoFunc
);
const list = new COMMAND(
  ['list', 'ls'],
  'List directory contents',
  false,
  listFunc
);
const clear = new COMMAND(
  ['clear'],
  'Clear the terminal screen',
  false,
  clearFunc
);
const goto = new COMMAND(
  ['goto', 'cd'],
  'Change directory',
  false,
  gotoFunc
);
const open = new COMMAND(
  ['open', 'cat'],
  'Open files and print on the standard output',
  false,
  openFunc
);
const exit = new COMMAND(
  ['exit'],
  'Exit the terminal',
  true,
  exitFunc
);
const help = new COMMAND(
  ['help'],
  'Display help information with a list of available commands',
  false,
  helpFunc
);
const whoami = new COMMAND(
  ['whoami'],
  'Display the current user',
  false,
  whoamiFunc
);
const username = new COMMAND(
  ['username'],
  'Set or get the current user',
  false,
  usernameFunc
);

const commands = [
  echo,
  list,
  clear,
  goto,
  open,
  exit,
  help,
  whoami,
  username
]

// Command Functions
function helpFunc(args) {
  const argsLnt = args.length;
  let output = '';

  if (argsLnt < 1) {
    output = '<p>Available commands:</p>';
    commands.forEach(command => {
      output += `<p><b>${command.name}</b>: ${command.description}</p>`;
    });
  } else if (argsLnt === 1) {
    const command = args[0];
    output = `Unknown command: ${command}`;
    for (let i = 0; i < commands.length; i++) {
      const commandObj = commands[i];
      if (commandObj.name.includes(command)) {
        output = `<p>${command}: ${commands[i].description}</p>`;
        break;
      }
    }
  } else {
    output = `Usage: help &lt;command&gt;`;
  }
  return output.trim();
}

function echoFunc(args) {
  const cleanedArgs = args.map(item => item.replace(/^['"]+|['"]+$/g, ''));
  return cleanedArgs.join(' ');
}

function clearFunc() {
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

function exitFunc() {
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

export default commands;