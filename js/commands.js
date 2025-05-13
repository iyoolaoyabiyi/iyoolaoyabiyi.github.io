import calculate from './commands/calculate.js';
import clear from './commands/clear.js';
import echo from './commands/echo.js';
import exit from './commands/exit.js';
import goto from './commands/goto.js';
import help from './commands/help.js';
import list from './commands/list.js';
import open from './commands/open.js';
import techStack from './commands/tech-stack.js';
import username from './commands/username.js';
import visit from './commands/visit.js';
import whoami from './commands/whoami.js';
import sudo from './commands/sudo.js';

const commands = [
  calculate,
  clear,
  echo,
  exit,
  goto,
  help,
  list,
  open,
  techStack,
  username,
  visit,
  whoami,
  sudo
];

export default commands;