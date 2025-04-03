// DOM
const terminal = document.getElementById('terminal');
const commandInput = document.getElementById('commandInput');
const responseInput = document.getElementById('responseInput');
const usernameEls = document.querySelectorAll('[data-type="username"]');
const terminalHistory = document.getElementById('terminalHistory');

// Variables
const currentUser = 'current user';

// Switches
let isPrompt = true;

function addToHistory(commandLine, responseLine) {
  const commandDiv = document.createElement('div');
  const lineDiv = document.createElement('div');
  const responseDiv = document.createElement('div');
  
  lineDiv.classList = 'line';
  lineDiv.innerHTML = commandLine.innerHTML;

  const lineDivInput = lineDiv.querySelector('input');
  const commandLineInput = commandLine.querySelector('input');

  lineDivInput.id = '';
  lineDivInput.value = commandLineInput.value;
  lineDivInput.disabled = true;
  
  // responseDiv.classList = 'response';
  // responseDiv.innerHTML = responseLine.innerHTML;
  // responseDiv.querySelector('input').id = ''; 
  
  commandDiv.classList = 'terminal-command';
  commandDiv.appendChild(lineDiv);
  commandDiv.appendChild(responseDiv);
  terminalHistory.appendChild(commandDiv);

  responseLine.style.display = 'none';
  commandLineInput.value = '';
}

function runCommand(command) {
  const program = '';
  const subCommand = '';
  const option = '';
  const optionValue = '';
}

usernameEls.forEach(el => {
  el.innerHTML = currentUser.replace(/\s+/g, '');
})

terminal.addEventListener('click', () =>{
  if (isPrompt) commandInput.focus()
  else responseInput.focus();
});

responseInput.addEventListener('keydown', e => {
const promptLine = document.getElementById('commandLine');
const responseLine = document.getElementById('responseLine');
  if  (e.key === 'Enter') {
    addToHistory(promptLine.innerHTML, responseLine.innerHTML);
    isPrompt = true;
  }
});

commandInput.addEventListener('keydown', (e) => {
  const promptLine = document.getElementById('commandLine');
  const responseLine = document.getElementById('responseLine');
  if (e.key === 'Enter') {
    const input = e.target.value;
    console.log(input);

    addToHistory(promptLine, responseLine);
  }
});
