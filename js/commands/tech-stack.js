import COMMAND, { CommandDoc } from '../command.js';
import { createElem } from '../helpers.js';
import PROFILE from '../configs/myProfile.js';

const techstackDoc = new CommandDoc(
  "tech-stack",
  [],
  "tech-stack [--list] [LIST]",
  [
    "Displays languages, tools, frameworks, and libraries. I work with",
    "Lists technology stacks I work with.",
    "Supports viewing all stacks or a specific category, such as languages, tools, CMS, or libraries."
  ],
  ["--list: Flag to indicate listing a specific stack."],
  ["LIST: The category to list (accepted values include: languages, libraries, cms, tools)."],
  ["tech-stack", "tech-stack --list languages"],
  "Returns a div element containing the technology stack."
);

function techsFunc(args) {
  const output = createElem('div');
  const ul = createElem('ul');
  if (args.length > 3) return `Usage: ${this.doc.synopsis}`;
  if (args.includes('--list') || args.length === 0) {
    const listName = args[args.indexOf('--list') + 1];
    if (!listName) {
      const stacks = Object.keys(PROFILE.techStack);
      stacks.forEach(stack => {
        const li = createElem('li');
        const span = createElem('span');
        const list = PROFILE.techStack[stack];
        span.classList.add('folder-text');
        span.append(`${stack.replace(stack.charAt(0), stack.charAt(0).toUpperCase())}: `);
        li.append(span);
        list.forEach((item, i) => {
          li.append(item)
          if (i !== list.length - 1) {
            li.append(', ');
          }
        });
        ul.append(li);
      });
      output.append(ul);
    } else {
      const list = PROFILE.techStack[listName];
      switch (listName) {
        case 'languages':
        case 'libraries':
        case 'cms':
        case 'tools':
          listItems(list);
          output.append(ul);
          break;
        default:
          output.append('Invalid tech list: ', listName);
      }
    }
    return output;
  } else return `Usage: ${this.doc.synopsis}`;
  function listItems(items) {
    items.forEach(item => {
      const li = createElem('li');
      li.textContent = item;
      ul.append(li);
    })
  }
}

export default new COMMAND(techstackDoc, techsFunc);
