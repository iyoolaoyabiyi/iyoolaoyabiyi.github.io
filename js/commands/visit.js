import COMMAND, { CommandDoc } from '../command.js';

const visitDoc = new CommandDoc(
  "visit",
  [],
  "visit URL",
  [
    "Opens the specified URL.",
    "Launches the URL in a new browser tab.",
    "Automatically adds 'https://' if no protocol is provided."
  ],
  [],
  ["URL: The URL to open."],
  ["visit google.com", "visit https://github.com"],
  "Returns a string indicating the link was opened or an error string."
);

function visitFunc(args) {
  if (args.length > 1) return `Usage: ${this.doc.synopsis}`;
  if (args.length === 0) return 'No URL provided';
  let url = args[0].trim();
  // Automatically add https if protocol is missing to prevent relative link handling
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }
  const urlRegex = /^(https?:\/\/)(www\.)?([^\s./]+\.[^\s]{2,})(\/\S*)?$/i;
  if (!urlRegex.test(url)) return `Invalid URL: ${url}`;
  window.open(url, '_blank');
  return `Opening ${url}`;
}

export default new COMMAND(visitDoc, visitFunc);
