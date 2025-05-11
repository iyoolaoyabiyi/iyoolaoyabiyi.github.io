import COMMAND, { CommandDoc } from '../command.js';

const calculateDoc = new CommandDoc(
  'calculate',
  ['calc'],
  "calculate EXPRESSION",
  [
    "Evaluates an arithmetic expression.",
    "Processes basic calculations including addition, subtraction, multiplication, and division."
  ],
  [],
  ["EXPRESSION: A valid arithmetic expression to evaluate."],
  ["calculate 2 + 3 * 5", "calculate (10 + 20) / 2"],
  "Returns a result string if successful, or an error string if the expression is invalid."
);

function calculateFunc(args) {
  if (args.length === 0) return 'No expression provided';
  // Join args to form the full arithmetic expression.
  const expression = args.join(' ');
  // Allow only numbers, operators, decimals, whitespace and parentheses.
  if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
    return `Invalid expression: ${expression}`;
  }
  try {
    // Safely evaluate the arithmetic expression.
    const result = new Function(`return ${expression}`)();
    // Check if evaluation resulted in a valid number.
    if (typeof result === 'number' && isFinite(result)) {
      return `Result: ${result}`;
    }
    return 'Error: The expression did not evaluate to a valid number';
  } catch (error) {
    return `Unable to calculate: ${expression}`;
  }
}

export default new COMMAND(calculateDoc, calculateFunc);
