import COMMAND, { CommandDoc } from '../command.js';

const echoDoc = new CommandDoc(
  "echo",
  ["write"],
  "echo TEXT",
  [
    "Displays a line of text.",
    "Writes its arguments to the terminal, similar to printing text.",
    "Strips quotation marks from the text automatically."
  ],
  [],
  ["TEXT: The string to display."],
  ["echo Hello", "echo \"text in quotes\""],
  "Returns a plain string representing the joined input args."
);

function echoFunc(args) {
  const cleanedArgs = args.map(arg => arg.replace(/^['"]+|['"]+$/g, ''));
  return cleanedArgs.join(' ');
}

export default new COMMAND(echoDoc, echoFunc);
