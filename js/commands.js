const commands = {
  getPathObj: function(current, path, fileSystem) {
    let segments = [];
    let pathStack = [];
    let pathObj = fileSystem['~'];
    let clearedPath = '';

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
    clearedPath = pathStack.join('/');
    for (let i = 1; i < pathStack.length; i++) {
      if (pathObj.content && pathObj.content[pathStack[i]]) {
        pathObj = pathObj.content[pathStack[i]]
      } else {
        return {
          pathObj: null,
          clearedPath: clearedPath
        };
      }
    }
    return {
      pathObj: pathObj,
      clearedPath: clearedPath
    };
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
    execute: function(terminal, args) {
      let path = args[0];
      if (!path) path = terminal.currentPath;
      const { pathObj, clearedPath } = commands.getPathObj(terminal.currentPath, path, FILESYSTEM);
      
      if (!pathObj) return `${clearedPath} does not exist`;
      if (pathObj.type !== 'directory') return `${clearedPath} is not a directory`;
      return Object.keys(pathObj.content).join(' ');
    }
  },
  goto: {
    name: 'goto',
    description: 'Change directory',
    isQuery: false,
    execute: function(terminal, args) {
      if (args.length === 0) return 'No directory specified';

      const path = args[0];
      const { pathObj, clearedPath} = commands.getPathObj(terminal.currentPath, path, FILESYSTEM);
      
      if (!pathObj) return `${clearedPath} does not exist`;
      if (pathObj.type !== 'directory') return `${clearedPath} is not a directory`;
      terminal.currentPath = clearedPath;
      setTerminalOptions(terminal);
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
      const { pathObj, clearedPath} = commands.getPathObj(terminal.currentPath, path, FILESYSTEM);
      
      if (!pathObj) return `${clearedPath} does not exist`;
      if (pathObj.type === 'directory') return `${clearedPath} is not a file`;
      return pathObj.content;
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
