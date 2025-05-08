import PROFILE from './configs/myProfile.js';
import FILESYSTEM from './configs/filesystem.js';
import { getSavedSettings, openGUI, updateUserSettings } from './script.js';
import terminal from "./terminal.js";

class COMMAND {
  constructor(name, description, executeFunction, synopsis) {
    this.name = name;
    this.description = description;
    this.executeFunction = executeFunction;
    this.synopsis = synopsis
  }
  execute(args) {
    return this.executeFunction(args);
  }
}

const echo = new COMMAND(
  ['echo', 'write'],
  'Display a line of text',
  echoFunc,
  'echo(or write) [<text>]'
);
const list = new COMMAND(
  ['list', 'ls'],
  'List directory contents',
  listFunc,
  'list(or ls) [<directory>]'
);
const clear = new COMMAND(
  ['clear'],
  'Clear the terminal screen',
  clearFunc,
  'clear'
);
const goto = new COMMAND(
  ['goto', 'cd'],
  'Change directory',
  gotoFunc,
  'goto(or cd) <directory>'
);
const open = new COMMAND(
  ['open', 'cat'],
  'Open files and print on the standard output',
  openFunc,
  'open(or cat) <file>'
);
const exit = new COMMAND(
  ['exit', 'quit'],
  'Exit the terminal',
  exitFunc,
  'exit(or quit)'
);
const help = new COMMAND(
  ['help'],
  'Display help information with a list of available commands',
  helpFunc,
  'help [<command>]'
);
const whoami = new COMMAND(
  ['whoami'],
  'Display short description about me',
  whoamiFunc,
  'whoami'
);
const username = new COMMAND(
  ['username'],
  'Set or get the current user',
  usernameFunc,
  'username [<new username>]'
);
const visit = new COMMAND(
  ['visit'],
  'Opens provided link',
  vistiFunc,
  'visit <url>'
);
const calculate = new COMMAND(
  ['calculate', 'calc'],
  'Evaluate an arithmetic expression',
  calculateFunc,
  'calculate(or calc) <expression>'
);
const techs = new COMMAND(
  ['tech-stack'],
  'Display languages, tools, frameworks and libraries I work with',
  techsFunc,
  'tech-stack [--list] [<list>]'
);

const commands = [
  help,
  whoami,
  techs,
  echo,
  username,
  clear,
  exit,
  list,
  goto,
  open,
  visit,
 calculate
]

// Command Functions
function helpFunc(args) {
  const argsLnt = args.length;
  let output = document.createElement('div');
  const para = document.createElement('p');

  if (argsLnt < 1) {
    para.textContent =  'Available commands';
    output.appendChild(para);
    commands.forEach(command => {
      const para = document.createElement('p');
      const span = document.createElement('span');
      span.classList.add('command-text')
      command.name.forEach((name, i, names) => {
        span.textContent += name;
      if (i !== (names.length - 1)) span.textContent += ', ';
      })
      para.appendChild(span);
      para.append(': ')
      para.append(command.description);
      output.appendChild(para);
    });
  } else if (argsLnt === 1) {
    const command = args[0];
    para.textContent = `Unknown command: ${command}`;
    for (let i = 0; i < commands.length; i++) {
      const commandObj = commands[i];
      if (commandObj.name.includes(command)) {
        const span = document.createElement('span');
        span.classList.add('command-text');
        span.textContent = `${command}`;
        para.textContent = '';
        para.appendChild(span);
        para.append(`: ${commandObj.description}`);
        break;
      }
    }
    output.appendChild(para);
  } else {
    para.textContent = `Usage: ${this.synopsis}`;
    output.appendChild(para);
  }
  return output;
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
  const para = document.createElement('p');
  if (args.length > 1) 
    return `Usage: ${this.synopsis}`;
  let path = args[0];
  if (!path) path = terminal.currentPath;
  const { dirObj, clearedPath, error } = getDirObj({path, currentPath: terminal.currentPath, fileSystem: FILESYSTEM});
  
  if (error) return error;
  if (dirObj.type !== 'directory') return `${clearedPath} is not a directory`;
  
  for (let key in dirObj.content) {
    const content = dirObj.content[key];
    if (content.type === 'directory') {
      const span = document.createElement('span');
      span.classList.add('folder-text');
      span.textContent = `${content.name} `;
      para.appendChild(span);
    } else para.append(`${content.name} `);
  }
  return para;
}

function gotoFunc(args) {
  if (args.length === 0) return 'No directory specified';
  if (args.length > 1) return `Usage: ${this.synopsis}`;

  const path = args[0];
  const { dirObj, clearedPath, error} = getDirObj({path, currentPath: terminal.currentPath, fileSystem: FILESYSTEM});
  
  if (error) return error;
  if (dirObj.type !== 'directory') return `${clearedPath} is not a directory`;
  terminal.currentPath = clearedPath;
  terminal.setOptions();
  return `Changed directory to ${terminal.currentPath}`;
}

function openFunc(args) {
  if (args.length === 0) return 'No file specified';
  if (args.length > 1) return `Usage: ${this.synopsis}`;
  const path = args[0];
  const { dirObj, clearedPath, error} = getDirObj({path, currentPath: terminal.currentPath, fileSystem: FILESYSTEM});
  
  if (error) return error;
  if (dirObj.type === 'directory') return `${clearedPath} is not a file`;
  return dirObj.content;
}

function whoamiFunc(args) {
  if (args.length > 1) return `Usage: ${this.synopsis}`;
  if (!args[0]) return PROFILE.description;
  if (args[0] === '--full') {
    const output = document.createElement('div');
    const p = document.createElement('p');
    p.append(PROFILE.description);
    output.append(p);
    PROFILE.otherDescriptions.forEach(desc => {
      const p = document.createElement('p');
      p.append(desc);
      output.append(p);
    });
    return output;
  } else return `Usage: ${this.synopsis}`;
}

function usernameFunc(args) {
  const userSettings = getSavedSettings();
  const username = args[0];
  if (args.length < 1) return userSettings.username;
  if (args.length > 1) return `Usage: ${this.synopsis}`;
  if (args[0].length < 3 || args.length >= 12) 
    return `Username must be at least 3 characters and not more than 12 characters long`;
  updateUserSettings('username', username);
  terminal.setOptions();
  return `Username changed to ${username}`;
}

function exitFunc() {
  let responseInput = null;
  terminal.needResponse = true;
  terminal.addResponse('Are you sure you want to quit?(yes/no)', true);
  responseInput = document.querySelector('#responseLine .input');
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
      }
      terminal.addCommandLine();
    }
  })
  return null;
}

function vistiFunc(args) {
  if (args.length > 1) return `Usage: ${this.synopsis}`;
  if (args.length === 0) return 'No URL provided';
  let url = args[0].trim();
  // Automatically add https if protocol is missing to prevent relative link handling
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  const urlRegex = /^(https?:\/\/)(www\.)?([^\s./]+\.[^\s]{2,})(\/\S*)?$/i;
  if (!urlRegex.test(url)) return `Invalid URL: ${url}`;
  window.open(url, '_blank');
  return `Opening ${url}`;
}

function calculateFunc(args) {
  if (args.length === 0) return 'No expression provided';
  // Join args to form the full arithmetic expression.
  const expression = args.join(' ');
  // Allow only numbers, operators, decimals, whitespace and parentheses.
  if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
    return `Invalid expression: ${expression}`;
  }
  try {
    // Safely evaluate the arithmetic expression.
    const result = new Function(`return ${expression}`)();
    // Check if evaluation resulted in a valid number.
    if (typeof result === 'number' && isFinite(result)) {
      return `Result: ${result}`;
    }
    return 'Error: The expression did not evaluate to a valid number';
  } catch (error) {
    return `Unable to calculate: ${expression}`;
  }
}

function techsFunc(args) {
  const output = document.createElement('div');
  const ul = document.createElement('ul');
  if (args.length > 3) return `Usage: ${this.synopsis}`;
  if (args.includes('--list') || args.length === 0) {
    const listName = args[args.indexOf('--list') + 1];
    if (!listName) {
      const stacks = Object.keys(PROFILE.techStack);
      stacks.forEach(stack => {
        const li = document.createElement('li');
        const span = document.createElement('span');
        const list = PROFILE.techStack[stack];
        span.classList.add('folder-text');
        span.append(`${stack.replace(stack.charAt(0), stack.charAt(0).toUpperCase())}: `);
        li.append(span);
        list.forEach((item, i) => {
          li.append(item)
          if (i !== list.length - 1) {
            li.append(', ');
          }
        });
        ul.append(li);
      });
      output.append(ul);
    } else {
      const list = PROFILE.techStack[listName];
      switch (listName) {
        case 'languages':
        case 'libraries':
        case 'CMS':
        case 'tools':
          listItems(list);
          break;
        default:
          output.append('Invalid tech list: ', listName);
      }
    }
    return output;
  } else return `Usage: ${this.synopsis}`;
  function listItems(items) {
    items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      ul.append(li);
    })
  }
}

// Helpers
function getDirObj(dirInfo) {
  const {path} = dirInfo;
  let {fileSystem, currentPath} = dirInfo;

  if (!path) return {error: 'What are you looking for?'};
  if (!fileSystem) return {error: 'Where do you want to look?'};
  if (!currentPath) currentPath = '~';

  let segments = [];
  let pathStack = [];
  let dirObj = fileSystem['~'];
  let clearedPath = '';


  if (currentPath.startsWith('/')) 
    currentPath = '~';

  if (path.startsWith('~'))
    segments = path.split('/');
  else if (path.startsWith('/')) {
    segments = path.split('/');
    segments[0] = '~';
  } else 
    segments = currentPath.split('/').concat(path.split('/'));

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
      return { error: `${clearedPath} does not exist.` };
    }
  }
  return { dirObj: dirObj, clearedPath: clearedPath };
}

export default commands;