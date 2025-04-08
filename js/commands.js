const commands = {
  echo: {
    name: 'echo',
    description: 'Display a line of text',
    isQuery: false,
    execute: function(args) {
      return args.join(' ');
    }
  },
  clear: {
    name: 'clear',
    description: 'Clear the terminal screen',
    isQuery: false,
    execute: function(clearFunction) {
      clearFunction();
    }
  },
  list: {
    name: 'list',
    description: 'List directory contents',
    isQuery: false,
    execute: function(path) {
      return 'pages\nblog';
    }
  },
  goto: {
    name: 'goto',
    description: 'Change directory',
    isQuery: false,
    execute: function(currentPath, args) {
      if (args.length === 0) {
        return 'No directory specified';
      }
      const newPath = args[0];
      // Logic to change directory
      return `Changed directory to ${newPath}`;
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
