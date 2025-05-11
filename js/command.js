class CommandDoc {
  constructor(name, aliases, synopsis, description, options, args, examples, exitStatus) {
    this.name = name;
    this.aliases = aliases;
    this.synopsis = synopsis;
    this.description = description;
    this.options = options;
    this.args = args;
    this.examples = examples;
    this.exitStatus = exitStatus;
  }
}

class COMMAND {
  constructor(doc, executeFunction) {
    this.doc = doc;
    this.executeFunction = executeFunction;
  }
  execute(args) {
    return this.executeFunction(args);
  }
}

export { CommandDoc };
export default COMMAND;
