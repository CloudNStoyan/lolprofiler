const fs = require('fs');
const path = require('path');

let key = fs.readFileSync(path.resolve(__dirname, 'key.txt'));

window.addEventListener('load', () => document.body.setAttribute('data-api-key', key));