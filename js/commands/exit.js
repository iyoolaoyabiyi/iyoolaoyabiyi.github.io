import COMMAND, { CommandDoc } from '../command.js';
import terminal from '../terminal.js';
import { openGUI } from '../script.js';

const exitDoc = new CommandDoc(
  "exit",
  ["quit"],
  "exit",
  [
    "Closes the terminal.",
    "Exits the terminal interface after prompting for confirmation."
  ],
  [],
  [],
  ["exit"],
  "Returns null after initiating a confirmation dialog."
);

function exitFunc() {
  let responseInput = null;
  terminal.needResponse = true;
  terminal.addResponse('Are you sure you want to quit?(yes/no)', true);
  responseInput = document.querySelector('#responseLine .input');
  responseInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const response = responseInput.value;
      terminal.needResponse = false;
      switch (response.toLowerCase()) {
        case 'yes':
        case 'y':
          terminal.body.inputInterface.innerHTML = '';
          terminal.resetOptions();
          terminal.setOptions();
          openGUI();
          break;
      }
      terminal.addCommandLine();
    }
  })
  return null;
}

export default new COMMAND(exitDoc, exitFunc);
