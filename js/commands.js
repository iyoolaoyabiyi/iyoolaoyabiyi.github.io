class COMMAND {
  constructor(name, description, isQuery, execute) {
    this.name = name;
    this.description = description;
    this.isQuery = isQuery;
    this.execute = execute;
  }
}

const echo = new COMMAND(
  'echo',
  'Display a line of text',
  false,
  function(func, args) {
    return func(args);
  }
)

const commands = {
  echo: echo,
  clear: {
    name: 'clear',
    description: 'Clear the terminal screen',
    isQuery: false,
    execute: function(func, args) {
      return func(args);
    }
  },
  list: {
    name: 'list',
    description: 'List directory contents',
    isQuery: false,
    execute: function(func, args) {
      return func(args);
    }
  },
  goto: {
    name: 'goto',
    description: 'Change directory',
    isQuery: false,
    execute: function(func, args) {
      return func(args);
    }
  },
  open: {
    name: 'open',
    description: 'opens files and print on the standard output',
    isQuery: false,
    execute: function(func, args) {
      return func(args);
    }
  },
  exit: {
    name: 'exit',
    description: 'Exit the terminal',
    isQuery: true,
    execute: function(func, args) {
      return func(args)
    }
  },
  help: {
    name: 'help',
    description: 'Display help information with a list of available commands',
    isQuery: false,
    execute: function(func, args) {
      return func(args);
    }
  },
  whoami: {
    name: 'whoami',
    description: 'Display the current user',
    // usage: 'whoami [username]',
    isQuery: false,
    execute: function(func, args) {
      return func(args);
    }
  },
  username: {
    name: 'username',
    description: 'Set or get the current user',
    isQuery: false,
    execute: function(func, args) {
      return func(args);
    }
  }
}

export default commands;