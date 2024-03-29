import { terminalInstance } from '../index.js';

export async function fetchQuote() {
  const response = await fetch('https://dummyjson.com/quotes/random');
  const data = await response.json();
  terminalInstance.appendToTerminal(data.quote);
}

export function doubleNumber(value) {
  const num = parseFloat(value);
  if (!isNaN(num)) {
    terminalInstance.appendToTerminal(`${num} * 2 = ${num *  2}`);
  } else {
    terminalInstance.appendToTerminal('Invalid input. Please enter a number after "double" command.');
  }
}

function getMethodNames(object) {
  return Object.getOwnPropertyNames(object).filter(name => typeof object[name] === 'function');
}


export function generateHelpMessage(terminalInstance) {
  const methodNames = getMethodNames(terminalInstance);
  const commandList = methodNames.join(', ');
  return `Available commands: ${commandList},
  right arrow - switches between suggestions`;
}