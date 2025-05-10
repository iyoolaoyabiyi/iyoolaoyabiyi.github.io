import { COMMAND } from "../commands.js";

const help = new COMMAND(
  ['help'],
  'Display help information with a list of available commands',
  helpFunc,
  'help [<command>]',
  helpDoc
);