// Terminal DOM
const terminal = document.getElementById('terminal');
const terminalCommand = document.getElementById('masterCommand');
let commandLine = document.getElementById('commandLine');
const commandLineInput = commandLine.querySelector('input');

// Terminal Functionality
const commands = [
  {
    name: 'ls', 
    description: 'List directory contents', 
    isQuery: false
  },
  {name: 'cd', description: 'Change directory', isQuery: false},
  {name: 'cat', description: 'Concatenate files and print on the standard output', isQuery: false},
  {name: 'echo', description: 'Display a line of text', isQuery: false},
  {name: 'clear', description: 'Clear the terminal screen', isQuery: false},
  {name: 'exit', description: 'Exit the terminal', isQuery: true}
];

function buildResponseLine(responseText) {
  responseLine = document.createElement('div');
  responseLine.classList.add('response');
  responseLine.id = 'responseLine';
  responseLine.innerHTML =`
    <p class="response-text" id="responseText">${responseText}</p>
    <input id="responseInput" type="text" class="input" />
  `;
  return responseLine;
}

function buildCommandLine() {
  const commandLine = document.createElement('div');
  commandLine.classList.add('line');
  commandLine.id = 'commandLine';
  commandLine.innerHTML = `
    <p class="prompt">
      <span data-type="username">user</span>
      @
      <span data-type="hostname">IyosWebServer</span>
      :
      <span data-type="path">~</span>
      $
    </p>
    <input class="input" type="text" />
  `;
  return commandLine;
}

function processCommand(e) {
  // Get command line input value
  let commandLine = document.getElementById('commandLine');
  let commandLineInput = commandLine.querySelector('input');
  const command = commandLineInput.value.trim();
  if (e.key === 'Enter') {
    // Check if command is empty
    if (command !== '') {
      // Check if command is valid
      const [ commandName, ...args ] = command.split(' ');
      for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i];
        if (cmd.name === commandName) {
          // Add response to terminal
          const responseLine = buildResponseLine(`Your command is ${command}`);
          terminalCommand.append(responseLine);
          // Check if command is a query
          if (cmd.isQuery) {
            responseLine.querySelector('input').focus();
            break;
          } else {
            // Add response to terminal
            responseLine.querySelector('input').disabled = true;
            break;
          }
        } else {
          // Add response to terminal
          const responseLine = buildResponseLine(`Command not found: ${commandName}`);
          terminalCommand.append(responseLine);
          break;
        }
      }
    }

    // Deactivate commandLine
    commandLineInput.disabled = true;
    commandLineInput.removeAttribute('autofocus')
    commandLineInput.removeEventListener('keydown', processCommand);
    commandLine.id = '';
    // Append new commandLine
    commandLine = buildCommandLine();
    commandLineInput = commandLine.querySelector('input');
    commandLineInput.disabled = false;
    terminalCommand.append(commandLine);
    commandLineInput.focus();
    commandLineInput.addEventListener('keydown', processCommand);
  }
}

terminal.addEventListener('click', () => commandLineInput.focus(), true);
commandLineInput.addEventListener('keydown', processCommand);
// commandLineInput.focus();