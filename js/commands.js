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
