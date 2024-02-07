import { BUILTIN_COMMANDS, CUSTOM_COMMANDS } from './commands.js';

class TerminalUI {
  constructor() {
    this.initializeElements();
    this.bindEvents();
    this.history = [];
    this.historyIndex = -1;
  }

  initializeElements() {
    this.terminalContainer = document.getElementById('terminal-container');
    this.input = document.getElementById('input');
    this.textarea = document.getElementById('textarea');
    this.suggestionsContainer = document.getElementById('suggestions');
    this.input.setAttribute('name', 'uniqueName' + Date.now());
  }

  bindEvents() {
    this.input.addEventListener('focus', this.handleFocus.bind(this));
    this.input.addEventListener('blur', this.handleBlur.bind(this));
    this.input.addEventListener('input', this.handleInputChange.bind(this));
    this.input.addEventListener('keydown', this.handleKeyDown.bind(this));

    this.terminalContainer.addEventListener('submit', this.handleSubmit.bind(this));

    document.addEventListener('DOMContentLoaded', this.appendInitialMessage.bind(this));
  }

  handleFocus() {
    this.terminalContainer.classList.add('input-focused');
  }

  handleBlur() {
    this.terminalContainer.classList.remove('input-focused');
  }

  handleInputChange(e) {
    const userInput = e.target.value.trim().toLowerCase();
    this.suggestionsContainer.innerHTML = '';
    if (!userInput) {
      this.suggestionsContainer.style.display = 'none';
      return;
    }
    this.showSuggestions(userInput);
  }

  handleKeyDown(e) {
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      this.navigateHistory(e.key);
    } else if (e.key === 'ArrowRight') {
      this.cycleSuggestions();
    }
  }

  navigateHistory(direction) {
    this.historyIndex = direction === 'ArrowUp' ? Math.min(this.historyIndex +  1, this.history.length -  1) : Math.max(this.historyIndex -  1, -1);
    this.input.value = this.historyIndex === -1 ? '' : this.history[this.historyIndex];
  }

  showSuggestions(userInput) {
    const suggestions = Object.keys({...BUILTIN_COMMANDS, ...CUSTOM_COMMANDS}).filter(cmd => cmd.startsWith(userInput));
    suggestions.forEach(suggestion => {
      const suggestionElement = document.createElement('div');
      suggestionElement.className = 'terminal__suggestions-container__suggestion';
      suggestionElement.textContent = suggestion;
      suggestionElement.addEventListener('click', () => {
        this.input.value = suggestion;
        this.suggestionsContainer.style.display = 'none';
      });
      this.suggestionsContainer.appendChild(suggestionElement);
    });
    this.suggestionsContainer.style.display = 'flex';
  }

  cycleSuggestions() {
    const suggestions = this.suggestionsContainer.querySelectorAll('div');
    if (suggestions.length >  0) {
      const currentIndex = Array.from(suggestions).findIndex(el => el.textContent === this.input.value);
      const nextIndex = (currentIndex +  1) % suggestions.length;
      this.input.value = suggestions[nextIndex].textContent;
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const command = this.input.value.trim();
    if (command) {
      this.appendToTerminal(`you: ${command}`);
      this.executeCommand(command);
      this.history.unshift(command);
      this.input.value = '';
      this.historyIndex = -1;
      this.suggestionsContainer.innerHTML = '';
    }
  }

  appendToTerminal(text) {
    const prefix = text.includes('you:') ? '' : 'terminal: ';
    this.textarea.textContent += `${prefix}${text}\n`;
    this.textarea.scrollTop = this.textarea.scrollHeight;
  }

  clearTerminal() {
    this.textarea.textContent = '';
  }

  executeCommand(command) {
    const [cmd, ...args] = command.split(' ');
    if (BUILTIN_COMMANDS[cmd] || CUSTOM_COMMANDS[cmd]) {
      (BUILTIN_COMMANDS[cmd] || CUSTOM_COMMANDS[cmd])(...args);
    } else {
      this.appendToTerminal(`Command not found: ${cmd}`);
    }
  }

  appendInitialMessage() {
    this.appendToTerminal('Last login: ' + new Date().toLocaleString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit', timeZoneName: 'short' }));
  }
}


export { TerminalUI };
