// Terminal DOM
const terminal = document.getElementById('terminal');
const terminalCommand = document.getElementById('masterCommand');
let commandLine = document.getElementById('commandLine');
const commandLineInput = commandLine.querySelector('input');
const openGuiBtn = document.getElementById('openGuiBtn');

function buildResponseLine(responseText) {
  const responseLine = document.createElement('div');
  responseLine.classList.add('response');
  responseLine.id = 'responseLine';
  responseLine.innerHTML =`
    <p class="response-text" id="responseText">${responseText}</p>
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

function executeCommand(command, args, commandObj) {
  switch (command) {
    case 'echo':
      return commandObj.execute(args);
      break;
    case 'clear':
      return commandObj.execute(() => {
        terminalCommand.innerHTML = '';
      });
      break;
    case 'list':
      return commandObj.execute();
      break;
    case 'goto':
      return commandObj.execute('', args);
      break;
    case 'open':
      return commandObj.execute(args[0]);
      break;
    case 'exit':
      return commandObj.execute();
      break;
  }
}

function processPrompt(e) {
  let commandLine = document.getElementById('commandLine');
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
              // Add response to terminal
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

    // Deactivate commandLine
    commandLineInput.disabled = true;
    commandLineInput.removeAttribute('autofocus')
    commandLineInput.removeEventListener('keydown', processPrompt);
    commandLine.id = '';
    // Append new commandLine
    commandLine = buildCommandLine();
    commandLineInput = commandLine.querySelector('input');
    commandLineInput.disabled = false;
    terminalCommand.append(commandLine);
    commandLineInput.focus();
    commandLineInput.addEventListener('keydown', processPrompt);
  }
}

terminal.addEventListener('click', () => commandLineInput.focus(), true);
commandLineInput.addEventListener('keydown', processPrompt);
// commandLineInput.focus();

openGuiBtn.addEventListener('click', () => {
  document.querySelector('.terminal').classList.add("hidden");
  document.querySelector('.gui').classList.remove("hidden");
});