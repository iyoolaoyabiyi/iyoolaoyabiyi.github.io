import FILESYSTEM from "./configs/filesystem.js";

const commands = {
  echo: {
    name: 'echo',
    description: 'Display a line of text',
    isQuery: false,
    execute: function(args) {
      const cleanedArgs = args.map(item => item.replace(/^['"]+|['"]+$/g, ''));
      return cleanedArgs.join(' ');
    }
  },
  clear: {
    name: 'clear',
    description: 'Clear the terminal screen',
    isQuery: false,
    execute: function(clearFunction) {
      clearFunction();
      return null; // No output needed
    }
  },
  list: {
    name: 'list',
    description: 'List directory contents',
    isQuery: false,
    execute: function(terminal, args) {
      let path = args[0];
      if (!path) path = terminal.currentPath;
      const { dirObj, clearedPath } = getDirObj(terminal.currentPath, path, FILESYSTEM);
      
      if (!dirObj) return `${clearedPath} does not exist`;
      if (dirObj.type !== 'directory') return `${clearedPath} is not a directory`;
      return Object.keys(dirObj.content).join(' ');
    }
  },
  goto: {
    name: 'goto',
    description: 'Change directory',
    isQuery: false,
    execute: function(terminal, args) {
      if (args.length === 0) return 'No directory specified';

      const path = args[0];
      const { dirObj, clearedPath} = getDirObj(terminal.currentPath, path, FILESYSTEM);
      
      if (!dirObj) return `${clearedPath} does not exist`;
      if (dirObj.type !== 'directory') return `${clearedPath} is not a directory`;
      terminal.currentPath = clearedPath;
      terminal.addOptions();
      return `Changed directory to ${terminal.currentPath}`;
    }
  },
  open: {
    name: 'open',
    description: 'opens files and print on the standard output',
    isQuery: false,
    execute: function(terminal, args) {
      // Logic to read file
      if (args.length === 0) return 'No file specified';
      const path = args[0];
      const { dirObj, clearedPath} = getDirObj(terminal.currentPath, path, FILESYSTEM);
      
      if (!dirObj) return `${clearedPath} does not exist`;
      if (dirObj.type === 'directory') return `${clearedPath} is not a file`;
      return dirObj.content;
    }
  },
  exit: {
    name: 'exit',
    description: 'Exit the terminal',
    isQuery: true,
    execute: function(exitFunction) {
      exitFunction();
      return null;
    }
  },
  help: {
    name: 'help',
    description: 'Display help information with a list of available commands',
    isQuery: false,
    execute: function(args) {
      const commandsList = Object.keys(commands) 
      let output = '';
      if (args.length > 1) {
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
          output = `Usage: help command`;
        }
      } else {
        output = '<p>Available commands:</p>';
        commandsList.forEach(key => {
          output += `<p>${key}: ${commands[key].description}</p>`;
        });
      }
      return output.trim();
    }
  }
}

function getDirObj(currentPath, path, fileSystem) {
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
export {getDirObj};