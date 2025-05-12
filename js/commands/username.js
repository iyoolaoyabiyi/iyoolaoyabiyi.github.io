import COMMAND, { CommandDoc } from '../command.js';
import { getSavedSettings, updateUserSettings } from '../script.js';
import terminal from '../terminal.js';

const usernameDoc = new CommandDoc(
  "username",
  [],
  "username [NEW USERNAME]",
  [
    "Retrieves or sets the current username.",
    "Gets the current username, or updates it if a new one is provided.",
    "Usernames must be 3–12 characters long."
  ],
  [],
  ["NEW USERNAME: Optional. New name to set as the current user."],
  ["username", "username IyoDev"],
  "Returns the current or updated username as a string, or an error string."
);

function usernameFunc(args) {
  const userSettings = getSavedSettings();
  const username = args[0];
  if (args.length < 1) return userSettings.username;
  if (args.length > 1) return `Usage: ${this.doc.synopsis}`;
  if (args[0].length < 3 || args.length >= 12) 
    return `Username must be at least 3 characters and not more than 12 characters long`;
  updateUserSettings('username', username);
  terminal.updatePromptEls();
  return `Username changed to ${username}`;
}

export default new COMMAND(usernameDoc, usernameFunc);
