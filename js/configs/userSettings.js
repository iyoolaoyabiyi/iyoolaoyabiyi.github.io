import config from "./config.js";

const defaultUserSettings = {
  username: 'guest',
  showWelcome: true,
  theme: 'dark',
  window: 'terminal',
  commandHistory: [],
  version: config.version
}

export default defaultUserSettings;