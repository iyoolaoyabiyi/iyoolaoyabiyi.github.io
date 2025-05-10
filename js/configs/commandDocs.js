const echoDoc = {
  name: "echo",
  aliases: ["write"],
  synopsis: "echo [TEXT]",
  description: [
    "Displays a line of text.",
    "Writes its arguments to the terminal, similar to printing text.",
    "Useful for debugging, showing messages, or outputting user input.",
    "Strips quotation marks from the text automatically."
  ],
  options: [],
  args: ["TEXT: The string to display (optional)."],
  examples: ["echo Hello World", "echo \"This is a test\""],
  exitStatus: "Returns a plain string representing the joined input args."
};

const listDoc = {
  name: "list",
  aliases: ["ls"],
  synopsis: "list [DIRECTORY]",
  description: [
    "Displays directory contents.",
    "Lists all files and subdirectories within a directory.",
    "Defaults to the current working directory if no directory is specified.",
    "Styles directories differently for clarity."
  ],
  options: [],
  args: ["DIRECTORY: The path of the directory to list (optional)."],
  examples: ["list", "list /home/user/projects"],
  exitStatus: "Returns a paragraph element containing directory entries or an error string."
};

const clearDoc = {
  name: "clear",
  aliases: [],
  synopsis: "clear",
  description: [
    "Clears the terminal screen.",
    "Removes all visible output from the terminal, providing a clean workspace."
  ],
  options: [],
  args: [],
  examples: ["clear"],
  exitStatus: "Returns null after clearing the terminal screen."
};

const gotoDoc = {
  name: "goto",
  aliases: ["cd"],
  synopsis: "goto DIRECTORY",
  description: [
    "Changes the directory.",
    "Moves to a specified directory using absolute or relative paths."
  ],
  options: [],
  args: ["DIRECTORY: The target directory to change into."],
  examples: ["goto projects", "goto ../home"],
  exitStatus: "Returns a string indicating success or error."
};

const openDoc = {
  name: "open",
  aliases: ["cat"],
  synopsis: "open FILE",
  description: [
    "Opens a file and prints its content.",
    "Displays the contents of a file in the terminal.",
    "Works only with files, not directories."
  ],
  options: [],
  args: ["FILE: The file to open and display."],
  examples: ["open readme.txt", "open /docs/info.txt"],
  exitStatus: "Returns file content as a string or an error string."
};

const exitDoc = {
  name: "exit",
  aliases: ["quit"],
  synopsis: "exit",
  description: [
    "Closes the terminal.",
    "Exits the terminal interface after prompting for confirmation."
  ],
  options: [],
  args: [],
  examples: ["exit"],
  exitStatus: "Returns null after initiating a confirmation dialog."
};

const helpDoc = {
  name: "help",
  aliases: [],
  synopsis: "help [COMMAND]",
  description: [
    "Shows help information.",
    "Displays all available commands and their descriptions.",
    "If provided with a specific command name, shows detailed information including synopsis and description."
  ],
  options: [],
  args: ["COMMAND: Optional name of a specific command to show help for."],
  examples: ["help", "help echo"],
  exitStatus: "Returns a div element containing help information."
};

const whoamiDoc = {
  name: "whoami",
  aliases: [],
  synopsis: "whoami [--full]",
  description: [
    "Shows a short description about the user.",
    "Displays a brief introduction.",
    "Optionally, use '--full' for a detailed profile."
  ],
  options: ["--full: Optional flag to display full profile."],
  args: [],
  examples: ["whoami", "whoami --full"],
  exitStatus: "Returns a string or a div element with profile descriptions."
};

const usernameDoc = {
  name: "username",
  aliases: [],
  synopsis: "username [NEW USERNAME]",
  description: [
    "Retrieves or sets the current username.",
    "Gets the current username, or updates it if a new one is provided.",
    "Usernames must be 3–12 characters long."
  ],
  options: [],
  args: ["NEW USERNAME: Optional. New name to set as the current user."],
  examples: ["username", "username IyoDev"],
  exitStatus: "Returns the current or updated username as a string, or an error string."
};

const visitDoc = {
  name: "visit",
  aliases: [],
  synopsis: "visit URL",
  description: [
    "Opens the specified URL.",
    "Launches the URL in a new browser tab.",
    "Automatically adds 'https://' if no protocol is provided."
  ],
  options: [],
  args: ["URL: The URL to open."],
  examples: ["visit google.com", "visit https://github.com"],
  exitStatus: "Returns a string indicating the link was opened or an error string."
};

const calculateDoc = {
  name: "calculate",
  aliases: ["calc"],
  synopsis: "calculate EXPRESSION",
  description: [
    "Evaluates an arithmetic expression.",
    "Processes basic calculations including addition, subtraction, multiplication, and division."
  ],
  options: [],
  args: ["EXPRESSION: A valid arithmetic expression to evaluate."],
  examples: ["calculate 2 + 3 * 5", "calc (10 + 20) / 2"],
  exitStatus: "Returns a result string if successful, or an error string if the expression is invalid."
};

const techStackDoc = {
  name: "tech-stack",
  aliases: [],
  synopsis: "tech-stack [--list] [LIST]",
  description: [
    "Displays languages, tools, frameworks, and libraries. I work with",
    "Lists technology stacks I work with.",
    "Supports viewing all stacks or a specific category, such as languages, tools, CMS, or libraries."
  ],
  options: ["--list: Flag to indicate listing a specific stack."],
  args: ["LIST: The category to list (accepted values include: languages, libraries, cms, tools)."],
  examples: ["tech-stack", "tech-stack --list languages"],
  exitStatus: "Returns a div element containing the technology stack."
};

export {
  echoDoc,
  listDoc,
  clearDoc,
  gotoDoc,
  openDoc,
  exitDoc,
  helpDoc,
  whoamiDoc,
  usernameDoc,
  visitDoc,
  calculateDoc,
  techStackDoc
};
