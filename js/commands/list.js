import COMMAND, { CommandDoc } from '../command.js';
import { createElem, getDirObj } from '../helpers.js';
import FILESYSTEM from '../configs/filesystem.js';
import terminal from '../terminal.js';

const listDoc = new CommandDoc(
  "list",
  ["ls"],
  "list [DIRECTORY]",
  [
    "Displays directory contents.",
    "Lists all files and subdirectories within a directory.",
    "Defaults to the current working directory if no directory is specified.",
    "Styles directories differently for clarity."
  ],
  [],
  ["DIRECTORY: The path of the directory to list (optional)."],
  ["list", "list /home/user/projects"],
  "Returns a paragraph element containing directory entries or an error string."
);

function listFunc(args) {
  const para = createElem('p');
  if (args.length > 1) 
    return `Usage: ${this.doc.synopsis}`;
  let path = args[0];
  if (!path) path = terminal.currentPath;
  const { dirObj, clearedPath, error } = getDirObj({path, currentPath: terminal.currentPath, fileSystem: FILESYSTEM});
  
  if (error) return error;
  if (dirObj.type !== 'directory') return `${clearedPath} is not a directory`;
  
  for (let key in dirObj.content) {
    const content = dirObj.content[key];
    if (content.type === 'directory') {
      const span = createElem('span');
      span.classList.add('folder-text');
      span.textContent = `${content.name} `;
      para.appendChild(span);
    } else para.append(`${content.name} `);
  }
  return para;
}

export default new COMMAND(listDoc, listFunc);
