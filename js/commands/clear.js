import COMMAND, { CommandDoc } from '../command.js';
import terminal from '../terminal.js';

const clearDoc = new CommandDoc(
  "clear",
  [],
  "clear",
  [
    "Clears the terminal screen.",
    "Removes all visible output from the terminal, providing a clean workspace."
  ],
  [],
  [],
  ["clear"],
  "Returns null after clearing the terminal screen."
);

function clearFunc() {
  terminal.body.inputInterface.innerHTML = '';
  return null;
}

export default new COMMAND(clearDoc, clearFunc);
