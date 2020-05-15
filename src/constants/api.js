/* ------ Config API sử dụng trong application ------ */
const env = process.env || {};
const array = [
  'REACT_APP_API_AUTH_DOMAIN',
  'REACT_APP_API_FEATURE_DOMAIN',
  'REACT_APP_API_FILE_DOMAIN',
  'REACT_APP_CLIENT_ID',
  'REACT_APP_CLIENT_SECRET',
  'REACT_APP_APP_NAME',
  'REACT_APP_APP_DOMAIN',
  'REACT_APP_TITLE_SYSTEM',
  'REACT_APP_TITLE_APP',
  'REACT_APP_TITLE_LOGO',
  'REACT_APP_TYPE_SYSTEM'
];

array.forEach((name) => {
  if (!env[name]) {
    console.warn(`The environment variable ${name} is missing, use default instead.`);
  }
});

const API_AUTH_DOMAIN = env.REACT_APP_API_AUTH_DOMAIN || 'http://auth.example.com';
const API_FEATURE_DOMAIN = env.REACT_APP_API_FEATURE_DOMAIN || 'http://major.example.com';
const API_FILE_URL = env.REACT_APP_API_FILE_DOMAIN || 'http://file.example.com';
const CLIENT_ID = env.REACT_APP_CLIENT_ID || '';
const CLIENT_SECRET = env.REACT_APP_CLIENT_SECRET || '';
const APP_NAME = env.REACT_APP_APP_NAME || 'qtud-fe';
const APP_DOMAIN = env.REACT_APP_APP_DOMAIN || 'http://localhost:3000';
const TITLE_SYSTEM = env.REACT_APP_TITLE_SYSTEM || 'Hệ thống quản trị ứng dụng';
const TITLE_APP = env.REACT_APP_TITLE_APP || 'Hệ thống quản trị ứng dụng';
const TITLE_LOGO = env.REACT_APP_TITLE_LOGO || 'Sở X';
const TYPE_SYSTEM = env.REACT_APP_TYPE_SYSTEM || 'INDEPENDENT';

export {
  API_FEATURE_DOMAIN,
  API_AUTH_DOMAIN,
  API_FILE_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  APP_NAME,
  APP_DOMAIN,
  TITLE_SYSTEM,
  TITLE_APP,
  TITLE_LOGO,
  TYPE_SYSTEM
};
