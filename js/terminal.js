// Terminal DOM
const terminalScreen = document.getElementById('terminal');
const terminalCommand = document.getElementById('masterCommand');
let commandLine = document.getElementById('commandLine');
const commandLineInput = commandLine.querySelector('input');
const openGuiBtn = document.getElementById('openGuiBtn');
const userName = document.querySelectorAll('[data-type="username"]');
const hostName = document.querySelectorAll('[data-type="hostname"]');
const pathName = document.querySelectorAll('[data-type="path"]');

const terminal = {
  // options
  user: 'guest',
  hostname: 'IyosWebServer',
  currentPath: '~',
  needResponse: false,
  // DOM
  get body() {
    return document.getElementById('terminal');
  },
  get commandLine() {
    return document.getElementById('commandLine');
  },
  // Methods
  clear: function() {
    this.body.innerHTML = '';
  },
  resetOptions: function() {
    this.user = 'guest';
    this.hostname = 'iyoswebserver';
    this.currentPath = '~';
  },
  openGUI: function() {
    document.querySelector('.terminal').classList.add("hidden");
    document.querySelector('.gui').classList.remove("hidden");
  }
}

function setTerminalOptions(options) {
  userName.forEach(el => {
    el.textContent = options.user;
  });
  hostName.forEach(el => {
    el.textContent = options.hostname;
  });
  pathName.forEach(el => {
    el.textContent = options.currentPath;
  });
}

function focusOnLine() {
  if (terminal.needResponse) {
    const responseLine = document.getElementById('responseLine');
    const responseInput = responseLine.querySelector('input');
    responseInput.focus();
  } else {
    const commandLineInput = terminal.commandLine.querySelector('input');
    commandLineInput.focus();
  }
}

function buildResponseLine(responseText, isPrompt = false) {
  const responseLine = document.createElement('div');
  responseLine.classList.add('response');
  if (isPrompt) responseLine.id = 'responseLine';
  responseLine.innerHTML =`
    <p class="response-text">${responseText}</p>
    ${isPrompt ? '<input type="text" class="input" />' : ''}
  `;
  return responseLine;
}

function appendResponseLine(responseLine) {
  terminal.body.append(responseLine);
  // Scroll to bottom of terminal
  terminalScreen.scrollTop = terminalScreen.scrollHeight;
}

function buildCommandLine() {
  const commandLine = document.createElement('div');
  commandLine.classList.add('line');
  commandLine.id = 'commandLine';
  commandLine.innerHTML = `
    <p class="prompt">
      <span data-type="username">${terminal.user}</span>
      @
      <span data-type="hostname">${terminal.hostname}</span>
      :
      <span data-type="path">${terminal.currentPath}</span>
      $
    </p>
    <input class="input" type="text" />
  `;
  return commandLine;
}

function appendCommandLine() {
  let commandLine = document.getElementById('commandLine');
  let commandLineInput = null;
  if (commandLine) {
    commandLineInput = commandLine.querySelector('input');
    // Deactivate commandLine
    commandLineInput.disabled = true;
    commandLineInput.removeAttribute('autofocus')
    commandLineInput.removeEventListener('keydown', processPrompt);
    commandLine.id = '';
  }
  // Append new commandLine
  commandLine = buildCommandLine();
  commandLineInput = commandLine.querySelector('input');
  commandLineInput.disabled = false;
  terminal.body.append(commandLine);
  commandLineInput.focus();
  commandLineInput.addEventListener('keydown', processPrompt);
}

function executeCommand(commands, command, args) {
  const commandObj = commands[command];
  switch (command) {
    case commands.echo.name:
      return commandObj.execute(args);
    case 'clear':
      return commandObj.execute(() => {
        terminal.body.innerHTML = '';
        return null;
      });
    case 'list':
      return commandObj.execute(terminal, args);
    case 'goto':
      return commandObj.execute(terminal, args);
    case 'open':
      return commandObj.execute(terminal, args);
    case 'exit':
      return commandObj.execute(() => {
        let responseInput = null;
        terminal.needResponse = true;
        appendResponseLine(buildResponseLine('Are you sure you want to quit?(yes/no)', true));
        responseInput = document.querySelector('#responseLine input');
        responseInput.focus();
        responseInput.addEventListener('keydown', e => {
          if (e.key === 'Enter') {
            response = responseInput.value;
            terminal.needResponse = false;
            switch (response.toLowerCase()) {
              case 'yes':
              case 'y':
                terminal.clear();
                terminal.resetOptions();
                setTerminalOptions(terminal)
                appendCommandLine();
                terminal.openGUI();
                break;
              default:
                document.querySelector('#responseLine').id = '';
                appendCommandLine();
            }
          }
        })
      });
  }
}

function processPrompt(e) {
  const commandLine = document.getElementById('commandLine');
  let commandLineInput = commandLine.querySelector('input');
  let commandObj = null
  if (e.key === 'Enter') {
    const prompt = commandLineInput.value.trim();
    if (prompt !== '') {
      // Check if command is valid
      const [ commandName, ...args ] = prompt.split(' ');
      let response = '';
      for (let command in commands) {
        if (commandName === command) {
          commandObj = commands[command];
          response = executeCommand(commands, command, args);
          if (response) appendResponseLine(buildResponseLine(response));
          break;
        }
      }
      // If command is not valid, add error message
      if (!commandObj)
        appendResponseLine(buildResponseLine(`Command not found: ${commandName}`));
    }
    if (!commandObj.isQuery) appendCommandLine();
  }
}

setTerminalOptions(terminal)

terminalScreen.addEventListener('click', focusOnLine);
commandLineInput.addEventListener('keydown', processPrompt);
// commandLineInput.focus();
openGuiBtn.addEventListener('click', terminal.openGUI );