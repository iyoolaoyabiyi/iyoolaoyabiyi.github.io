import COMMAND, { CommandDoc } from '../command.js';
import commands from '../commands.js';
import { createElem, createDescList, createElem } from '../helpers.js';
import { getSavedSettings } from '../script.js';

const easterEggs = ['sudo'];

const helpDoc = new CommandDoc(
  "help",
  [],
  "help [COMMAND]",
  [
    "Shows help information.",
    "Displays all available commands and their descriptions.",
    "If provided with a specific command name, shows detailed information including synopsis and description."
  ],
  [],
  ["COMMAND: Optional name of a specific command to show help for."],
  ["help", "help echo"],
  "Returns a div element containing help information."
);

function helpFunc(args) {
  let output = createElem('div');
  const introDiv = createElem('div');
  const paras = createElem('p', 3);
  const userSettings = getSavedSettings();
  const argsLnt = args.length;

  introDiv.classList.add('help-intro');

  if (argsLnt < 1) {
    paras.forEach((para, i) => {
      switch (i) {
        case 0:
          para.textContent = `Iyo's Website, version ${userSettings.version}`;
          break;
        case 1:
          para.textContent = `These shell commands are defined internally.  Type \`help\' to see this list.`
          break;
        case 2:
          para.textContent = `Type \`help name' to find out more about the command \`name'.`
        default:
          para.remove();
      }
      introDiv.appendChild(para);
    });
    output.append(introDiv);
    commands.forEach(command => {
      if (!easterEggs.includes(command.doc.name)) {
        const para = createElem('p');
        const span = createElem('span');
        span.classList.add('command-text');
        span.textContent = command.doc.name;
        command.doc.aliases.forEach((name, i, names) => {
          span.textContent += ` or ${name}`;
        if (i !== (names.length - 1)) span.textContent += ' or ';
        })
        para.append(span, '- ', command.doc.description[0]);
        output.appendChild(para);
      }
    });
  } else if (argsLnt === 1) {
    const command = args[0];
    const para = createElem('p');
    para.textContent = `No commands match \`${command}'`;
    output.appendChild(para);
    for (let i = 0; i < commands.length; i++) {
      const { doc } = commands[i];
      if (command === doc.name || doc.aliases.includes(command)) {
        const template = document.querySelector('#terminalHelpTemplate');
        const terminalHelp = template.content.cloneNode(true);
        const commandNameEl = terminalHelp.querySelector('.command-name p');
        const commandAliasEl = terminalHelp.querySelector('.command-aliases p');
        const commandSynopsisEl = terminalHelp.querySelector('.command-synopsis p');
        const commandDescEl = terminalHelp.querySelector('.command-description p');
        const commandOptionsEl = terminalHelp.querySelector('.command-options');
        const commandArgsEl = terminalHelp.querySelector('.command-arguments');
        const commandExamplesEl = terminalHelp.querySelector('.command-examples');
        const commandExitEl = terminalHelp.querySelector('.command-exit p');
        const { name, aliases, synopsis, description, options, args, examples, exitStatus } = doc;

        commandNameEl.textContent = command;
        // Aliases
        if (aliases.length < 1)
          commandAliasEl.parentElement.remove();
        else {
          aliases.forEach((alias, i) => {
            if (aliases.includes(command)) if (alias === command) alias = name;
            if (i !== aliases.length - 1) commandAliasEl.textContent += `${alias}, `;
            else commandAliasEl.textContent += alias;
          });
        }
        // Synopsis
        commandSynopsisEl.textContent = synopsis;
        if (aliases.includes(command))
          commandSynopsisEl.textContent = synopsis.replace(name, command);
        // Description
          commandDescEl.append(createDescList(description));
        // Options
        if (options.length < 1) commandOptionsEl.remove();
        else commandOptionsEl.append(createDescList(options));
        // Arguments
        if (args.length < 1) commandArgsEl.remove();
        else commandArgsEl.append(createDescList(args));
        // Examples
        examples.forEach(example => {
          const p = createElem('p');
          p.style.marginBottom = 0;
          p.textContent = example;
          if (aliases.includes(command)) p.textContent = example.replace(name, command);
          commandExamplesEl.append(p);
        });
        // Exit Status
        commandExitEl.append(exitStatus);
        output.innerHTML = '';
        output.append(terminalHelp);
        break;
      } 
    }
  } else {
    const para = createElem('p');
    para.textContent = `Usage: ${this.doc.synopsis}`;
    output.appendChild(para);
  }
  return output;
}

export default new COMMAND(helpDoc, helpFunc);
