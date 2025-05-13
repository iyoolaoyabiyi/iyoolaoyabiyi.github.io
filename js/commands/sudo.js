import COMMAND, { CommandDoc } from '../command.js';
import terminal from '../terminal.js';
import { getSavedSettings } from '../script.js';

const sudoDoc = new CommandDoc(
  'sudo',
  ['su'],
  'sudo [COMMAND]',
  [
    'Should grant admin priviledges. SHOULD. ;>)'
  ],
  [],
  ['COMMAND: a valid command'],
  ['sudo goto privateFolder'],
  ['Should return the output of COMMAND with admin priviledges. SHOULD. ;>)']
)

function sudoFunc() {
  terminal.needResponse = true;
  terminal.addResponse(`[sudo] password for ${getSavedSettings().username}:`, true);
  const responseInput = document.querySelector('#responseLine .input');
  responseInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      terminal.needResponse = false;
      terminal.addResponse('Please wait...');
      setTimeout(() => {
        terminal.addResponse('Permission denied. Nice try. ;>)');
        terminal.addCommandLine();
      }, 2000);
    } else e.preventDefault();
  });
}

export default new COMMAND(sudoDoc, sudoFunc);
