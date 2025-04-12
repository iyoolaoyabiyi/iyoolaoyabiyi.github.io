// Terminal DOM
const terminal = document.getElementById('terminal');
const terminalCommand = document.getElementById('masterCommand');
let commandLine = document.getElementById('commandLine');
const commandLineInput = commandLine.querySelector('input');
const openGuiBtn = document.getElementById('openGuiBtn');

let currentPath = '~';
let user = 'user';
let hostname = 'IyosWebServer';
let needResponse = false;

function focusOnLine() {
  if (needResponse) {
    const responseLine = document.getElementById('responseLine');
    const responseInput = responseLine.querySelector('input');
    responseInput.focus();
  } else {
    const commandLine = document.getElementById('commandLine');
    const commandLineInput = commandLine.querySelector('input');
    commandLineInput.focus();
  }
}

function buildResponseLine(responseText) {
  const responseLine = document.createElement('div');
  responseLine.classList.add('response');
  // responseLine.id = 'responseLine';
  responseLine.innerHTML =`
    <p class="response-text">${responseText}</p>
    <input id="responseInput" type="text" class="input" />
  `;
  return responseLine;
}

function appendResponseLine(responseLine) {
  terminalCommand.append(responseLine);
  // Scroll to bottom of terminal
  terminal.scrollTop = terminal.scrollHeight;
}

function buildCommandLine() {
  const commandLine = document.createElement('div');
  commandLine.classList.add('line');
  commandLine.id = 'commandLine';
  commandLine.innerHTML = `
    <p class="prompt">
      <span data-type="username">${user}</span>
      @
      <span data-type="hostname">${hostname}</span>
      :
      <span data-type="path">${currentPath}</span>
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
  terminalCommand.append(commandLine);
  commandLineInput.focus();
  commandLineInput.addEventListener('keydown', processPrompt);
}

function executeCommand(command, args, commandObj) {
  switch (command) {
    case commands.echo.name:
      return commandObj.execute(args);
    case 'clear':
      return commandObj.execute(() => {
        terminalCommand.innerHTML = '';
      });
    case 'list':
      return commandObj.execute(args[0]);
    case 'goto':
      return commandObj.execute('', args);
    case 'open':
      return commandObj.execute(args[0]);
    case 'exit':
      return commandObj.execute();
  }
}

function processPrompt(e) {
  const commandLine = document.getElementById('commandLine');
  let commandLineInput = commandLine.querySelector('input');
  if (e.key === 'Enter') {
    const prompt = commandLineInput.value.trim();
    if (prompt !== '') {
      // Check if command is valid
      const [ commandName, ...args ] = prompt.split(' ');
      let commandObj = null;
      let response = '';
      for (let command in commands) {
        if (commandName === command) {
          commandObj = commands[command];
          response = executeCommand(command, args, commandObj);
          if (command !== 'clear') {
            const responseLine = buildResponseLine(response);
              appendResponseLine(responseLine);
            // Check if command is a query
            if (commandObj.isQuery) {
              responseLine.querySelector('input').focus();
              break;
            } else {
              responseLine.querySelector('input').disabled = true;
              break;
            }
          }
        }
      }
      // If command is not valid, add error message
      if (!commandObj) {
        appendResponseLine(buildResponseLine(`Command not found: ${commandName}`));
      }
    }
    appendCommandLine();
  }
}

terminal.addEventListener('click', focusOnLine);
commandLineInput.addEventListener('keydown', processPrompt);
// commandLineInput.focus();

openGuiBtn.addEventListener('click', () => {
  document.querySelector('.terminal').classList.add("hidden");
  document.querySelector('.gui').classList.remove("hidden");
});