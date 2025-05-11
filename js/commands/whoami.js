import COMMAND, { CommandDoc } from '../command.js';
import { createElem } from '../helpers.js';
import PROFILE from '../configs/myProfile.js';

const whoamiDoc = new CommandDoc(
  "whoami",
  [],
  "whoami [--full]",
  [
    "Shows a short description about the user.",
    "Displays a brief introduction.",
    "Optionally, use '--full' for a detailed profile."
  ],
  ["--full: Optional flag to display full profile."],
  [],
  ["whoami", "whoami --full"],
  "Returns a string or a div element with profile descriptions."
);

function whoamiFunc(args) {
  if (args.length > 1) return `Usage: ${this.doc.synopsis}`;
  if (!args[0]) return PROFILE.description;
  if (args[0] === '--full') {
    const output = createElem('div');
    const p = createElem('p');
    p.append(PROFILE.description);
    output.append(p);
    PROFILE.otherDescriptions.forEach(desc => {
      const p = createElem('p');
      p.append(desc);
      output.append(p);
    });
    return output;
  } else return `Usage: ${this.doc.synopsis}`;
}

export default new COMMAND(whoamiDoc, whoamiFunc);
