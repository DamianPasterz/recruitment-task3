export async function fetchQuote() {
  const response = await fetch('https://dummyjson.com/quotes/random');
  const data = await response.json();
  appendToTerminal(data.quote);
}

export function doubleNumber(value) {
  const num = parseFloat(value);
  if (!isNaN(num)) {
    appendToTerminal(`${num} *  2 = ${num *  2}`);
  } else {
    appendToTerminal('Invalid input. Please enter a number after "double" command.');
  }
}