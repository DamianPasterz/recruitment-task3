document.addEventListener('DOMContentLoaded', function () {
  console.log('loaded');
  const input = document.querySelector('.terminal__container__input');
  const terminalContainer = document.querySelector('.terminal__container');
  const textarea = document.querySelector('.terminal__textarea');
  const history = [];
  let historyIndex = -1;


  const BUILTIN_COMMANDS = {
    clear: function() {
      textarea.textContent = '';
    },
    help: function() {
      appendToTerminal('Available commands: clear, help, quote, double X, hello');
    },
    quote: function() {
      fetch('https://dummyjson.com/quotes/random')
        .then(response => response.json())
        .then(data => appendToTerminal(`terminal: ${data.quote}`))
        .catch(error => console.error('Error fetching quote:', error));
    },
    'double': function(value) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        appendToTerminal(`${num} * 2 = ${num * 2}`);
      } else {
        appendToTerminal('Invalid input. Please enter a number after "double" command.');
      }
    }
  };

  const CUSTOM_COMMANDS = {
    'hello': function() {
         appendToTerminal('Hello :)');
          }
  };

  const ALL_COMMANDS = { ...BUILTIN_COMMANDS, ...CUSTOM_COMMANDS };

  appendToTerminal('Last login: ' + new Date().toLocaleString('en-US', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit',hour12: false, minute: '2-digit', second: '2-digit', timeZoneName: 'short' }));


  terminalContainer.addEventListener('submit', function(e) {
    e.preventDefault();
    const command = input.value.trim();
    if (command) {
      appendToTerminal(`you: ${command}`);
      executeCommand(command);
      history.unshift(command);
      input.value = '';
      historyIndex = -1;
    }
  });


  input.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowUp') {
      historyIndex = Math.min(historyIndex + 1, history.length - 1);
      input.value = history[historyIndex];
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      historyIndex = Math.max(historyIndex - 1, -1);
      input.value = historyIndex === -1 ? '' : history[historyIndex];
      e.preventDefault();
    }
  });

  input.addEventListener('focus', function() {
    terminalContainer.classList.add('input-focused');
  });

  input.addEventListener('blur', function() {
    terminalContainer.classList.remove('input-focused');
  });

  function executeCommand(command) {
    const [cmd, ...args] = command.split(' ');
    if (ALL_COMMANDS.hasOwnProperty(cmd)) {
      ALL_COMMANDS[cmd](...args);
    } else {
      appendToTerminal(`Command not found: ${cmd}`);
    }
  }

  function appendToTerminal(text) {
    if (text.includes('you:')) {
      textarea.textContent += text + '\n';
    } else {
      textarea.textContent += `terminal: ${text}\n`;
    }
    textarea.scrollTop = textarea.scrollHeight;
  }
});
