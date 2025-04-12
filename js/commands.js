const commands = {
  getDirObj: function(current, path, fileSystem) {
    let segments = [];
    let pathStack = [];
    let dirObj = fileSystem['~'];

    if (path.startsWith('~')) segments = path.split('/');
    else if (path.startsWith('/')) {
      segments = path.split('/');
      segments[0] = '~';
    } else segments = current.split('/').concat(path.split('/'));
    // Resolve final directory path
    for (let part of segments) {
      if (part === '' || part === '.') continue;
      if (part === '..') pathStack.pop();
      else pathStack.push(part);
    }
    for (let i = 1; i < pathStack.length; i++) {
      if (dirObj.content && dirObj.content[pathStack[i]]) {
        return {
          dirObj: dirObj.content[pathStack[i]],
          pathStack: pathStack
        };
      } else {
        return `No such directory: ${path}`;
      }
    }
  },
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
    execute: function(path) {
      if (!path) {
        const fileList = Object.keys(FILESYSTEM['~'].content);
        return fileList.join(' ');
      }
      const directories = path.split('/');
      const directory = directories[directories.length - 1];
      // Logic to list contents of the directory
      const content = FILESYSTEM['~'].content[directory];
      if (content && content.type === 'directory') {
        const fileList = Object.keys(content.content);
        return fileList.join(' ');
      } else if (content && content.type === 'file') {
        return `${directory} is a file`;
      } else {
        return `${path} not found`;
      }
    }
  },
  goto: {
    name: 'goto',
    description: 'Change directory',
    isQuery: false,
    execute: function(terminal, args) {
      if (args.length === 0) return 'No directory specified';

      const path = args[0];
      const { dirObj, pathStack} = commands.getDirObj(terminal.currentPath, path, FILESYSTEM);
      
      if (dirObj.type !== 'directory') return `${path} is not a directory`;
      terminal.currentPath = pathStack.join('/');
      setTerminalOptions(terminal);
      return `Changed directory to ${terminal.currentPath}`;
    }
  },
  open: {
    name: 'open',
    description: 'opens files and print on the standard output',
    isQuery: false,
    execute: function(filePath) {
      // Logic to read file
      return `Contents of ${filePath}`;
    }
  },
  exit: {
    name: 'exit',
    description: 'Exit the terminal',
    isQuery: true,
    execute: function() {
      setTimeout(() => {
        window.close();
      }, 500);
      return 'Exiting terminal...';
    }
  }
}
