import { BUILTIN_COMMANDS, CUSTOM_COMMANDS } from './commands.js';

export function initializeUi() {
  const terminalContainer = document.getElementById('terminal-container');
  const input = document.getElementById('input');
  const textarea = document.getElementById('textarea');
  const suggestionsContainer = document.getElementById('suggestions');

  input.addEventListener('focus', () => terminalContainer.classList.add('input-focused'));
  input.addEventListener('blur', () => terminalContainer.classList.remove('input-focused'));
  input.addEventListener('input', handleInputChange);
  input.addEventListener('keydown', handleKeyDown);

  terminalContainer.addEventListener('submit', (e) => {
    e.preventDefault();
    const command = input.value.trim();
    if (command) {
      appendToTerminal(`you: ${command}`);
      executeCommand(command);
      history.unshift(command);
      input.value = '';
      historyIndex = -1;
      suggestionsContainer.innerHTML = '';
    }
  });

  const history = [];
  let historyIndex = -1;

  function handleInputChange(e) {
    const userInput = e.target.value.trim().toLowerCase();
    suggestionsContainer.innerHTML = '';
    if (userInput.length ===  0) {
      suggestionsContainer.style.display = 'none';
      return;
    }
    showSuggestions(userInput);
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      navigateHistory(e.key);
    } else if (e.key === 'ArrowRight') {
      cycleSuggestions();
    }
  }

  function navigateHistory(direction) {
    historyIndex = direction === 'ArrowUp' ? Math.min(historyIndex +  1, history.length -  1) : Math.max(historyIndex -  1, -1);
    input.value = historyIndex === -1 ? '' : history[historyIndex];
  }

  function showSuggestions(userInput) {
    const suggestions = Object.keys({...BUILTIN_COMMANDS, ...CUSTOM_COMMANDS}).filter(cmd => cmd.startsWith(userInput));
    suggestions.forEach(suggestion => {
      const suggestionElement = document.createElement('div');
      suggestionElement.className = 'terminal__suggestions-container__suggestion';
      suggestionElement.textContent = suggestion;
      suggestionElement.addEventListener('click', () => {
        input.value = suggestion;
        suggestionsContainer.style.display = 'none';
      });
      suggestionsContainer.appendChild(suggestionElement);
    });
    suggestionsContainer.style.display = 'flex';
  }

  function cycleSuggestions() {
    const suggestions = suggestionsContainer.querySelectorAll('div');
    if (suggestions.length >  0) {
      let currentIndex = Array.from(suggestions).findIndex(el => el.textContent === input.value);
      const nextIndex = (currentIndex +  1) % suggestions.length;
      input.value = suggestions[nextIndex].textContent;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    appendToTerminal('Last login: ' + new Date().toLocaleString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit',hour12: false, minute: '2-digit', second: '2-digit', timeZoneName: 'short' }));
  });
}

export function executeCommand(command) {
  const [cmd, ...args] = command.split(' ');
  if (BUILTIN_COMMANDS[cmd] || CUSTOM_COMMANDS[cmd]) {
    if (BUILTIN_COMMANDS[cmd]) {
      BUILTIN_COMMANDS[cmd](...args);
    } else {
      CUSTOM_COMMANDS[cmd](...args);
    }
  } else {
    appendToTerminal(`Command not found: ${cmd}`);
  }
}

export  function appendToTerminal(text) {
      if (text.includes('you:')) {
        textarea.textContent += text + '\n';
      } else {
        textarea.textContent += `terminal: ${text}\n`;
      }
      textarea.scrollTop = textarea.scrollHeight;
    }
