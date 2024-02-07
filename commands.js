
import { terminalInstance } from './index.js';
import { fetchQuote, doubleNumber, generateHelpMessage } from './utils.js';
import { customCommandsDescriptions } from './customCommandsDescriptions.js';



export const BUILTIN_COMMANDS = {
  clear: () => terminalInstance.clearTerminal(),
  help: () => terminalInstance.appendToTerminal(generateHelpMessage({...BUILTIN_COMMANDS, ... CUSTOM_COMMANDS})),
  quote: () => fetchQuote(),
  double: (value) => doubleNumber(value)
};

const convertDescriptionsToCommands = (descriptions) => {
  return Object.fromEntries(
    Object.entries(descriptions).map(([commandName, details]) => {
      return [commandName, () => terminalInstance.appendToTerminal(details.msg)];
    })
  );
}

export const CUSTOM_COMMANDS = convertDescriptionsToCommands(customCommandsDescriptions);

