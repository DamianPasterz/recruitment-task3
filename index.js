document.addEventListener('DOMContentLoaded', function () {
  const input = document.getElementById('input');
  const terminalContainer = document.getElementById('terminal-container');
  const textarea = document.getElementById('textarea');
  const suggestionsContainer= document.getElementById('suggestions')
  const history = [];
  let historyIndex = -1;


  const BUILTIN_COMMANDS = {
    clear: function() {
      textarea.textContent = '';
    },
    help: function() {
      appendToTerminal(`Available commands: clear, help, quote, double X, hello
          right arrow - switches between suggestions`);
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
      suggestionsContainer.innerHTML = '';
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

  input.addEventListener('input', function(e) {
    const userInput = e.target.value.trim().toLowerCase();
 
    suggestionsContainer.innerHTML = '';
  console.log('userinput',userInput);
  
    if (userInput.length === 0) {
      suggestionsContainer.style.display = 'none'; 
      return;
    }
  
    const suggestions = Object.keys(ALL_COMMANDS).filter(cmd => cmd.startsWith(userInput));
    suggestions.forEach(suggestion => {
      const suggestionElement = document.createElement('div');
      suggestionElement.className ='terminal__suggestions-container__suggestion'
      suggestionElement.textContent = suggestion;
      suggestionElement.addEventListener('click', function() {
        input.value = suggestion; 
        suggestionsContainer.style.display = 'none';  
      });
      suggestionsContainer.appendChild(suggestionElement);
    });
  
    suggestionsContainer.style.display = 'flex';  
 
  

input.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowRight') {
    
    const suggestions = suggestionsContainer.querySelectorAll('div');
    console.log(suggestions);
    if (suggestions.length > 0) {
      let currentIndex = -1;
      for (let i = 0; i < suggestions.length; i++) {
        if (suggestions[i].textContent === input.value) {
          currentIndex = i;
          break;
        }
      }
      const nextIndex = (currentIndex + 1) % suggestions.length;
      input.value = suggestions[nextIndex].textContent;
    }
  }
});

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
