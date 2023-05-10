const APP_ENV_MODE = import.meta.env.mode

const production = {
  api: 'https://imp.cmsk1979.com/api/open/mmp/'
}

const development = {
  api: '/api/open/mmp/'
}

export const serverConf = {
  production, development
}[APP_ENV_MODE] || development