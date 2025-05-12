import COMMAND, { CommandDoc } from '../command.js';
import FILESYSTEM from '../configs/filesystem.js';
import { getDirObj } from '../helpers.js';
import terminal from '../terminal.js';

const gotoDoc = new CommandDoc(
  "goto",
  ["cd"],
  "goto DIRECTORY",
  [
    "Changes the directory.",
    "Moves to a specified directory using absolute or relative paths."
  ],
  [],
  ["DIRECTORY: The target directory to change into."],
  ["goto projects", "goto ../home"],
  "Returns a string indicating success or error."
);

function gotoFunc(args) {
  if (args.length === 0) return 'No directory specified';
  if (args.length > 1) return `Usage: ${this.doc.synopsis}`;

  const path = args[0];
  const { dirObj, clearedPath, error} = getDirObj({path, currentPath: terminal.currentPath, fileSystem: FILESYSTEM});
  
  if (error) return error;
  if (dirObj.type !== 'directory') return `${clearedPath} is not a directory`;
  terminal.currentPath = clearedPath;
  terminal.updatePromptEls();
  return `Changed directory to ${terminal.currentPath}`;
}

function openFunc(args) {
  if (args.length === 0) return 'No file specified';
  if (args.length > 1) return `Usage: ${this.doc.synopsis}`;
  const path = args[0];
  const { dirObj, clearedPath, error} = getDirObj({path, currentPath: terminal.currentPath, fileSystem: FILESYSTEM});
  
  if (error) return error;
  if (dirObj.type === 'directory') return `${clearedPath} is not a file`;
  return dirObj.content;
}

export default new COMMAND(gotoDoc, gotoFunc);
