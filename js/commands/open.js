import COMMAND, { CommandDoc } from '../command.js';
import { getDirObj } from '../helpers.js';
import FILESYSTEM from '../configs/filesystem.js';
import terminal from '../terminal.js';

const openDoc = new CommandDoc(
  "open",
  ["cat"],
  "open FILE",
  [
    "Opens a file and prints its content.",
    "Displays the contents of a file in the terminal.",
    "Works only with files, not directories."
  ],
  [],
  ["FILE: The file to open and display."],
  ["open readme.txt", "open /docs/info.txt"],
  "Returns file content as a string or an error string."
);

function openFunc(args) {
  if (args.length === 0) return 'No file specified';
  if (args.length > 1) return `Usage: ${this.doc.synopsis}`;
  const path = args[0];
  const { dirObj, clearedPath, error} = getDirObj({
    path, 
    currentPath: terminal.currentPath, 
    fileSystem: FILESYSTEM
  });
  
  if (error) return error;
  if (dirObj.type === 'directory') return `${clearedPath} is not a file`;
  return dirObj.content;
}

export default new COMMAND(openDoc, openFunc);
