
import { appendToTerminal } from './terminal.js';
import { fetchQuote, doubleNumber } from './utils.js';

export const BUILTIN_COMMANDS = {
  clear: () => textarea.textContent = '',
  help: () => appendToTerminal('Available commands: clear, help, quote, double X, hello'),
  quote: () => fetchQuote(),
  double: (value) => doubleNumber(value)
};

export const CUSTOM_COMMANDS = {
  hello: () => appendToTerminal('Hello :)')
};

