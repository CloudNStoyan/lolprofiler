const fs = require('fs');
const path = require('path');

const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld(
  'lol',
  {
    api: {
        key: fs.readFileSync(path.resolve(__dirname, 'key.txt')).toString()
    },
    ddragon: {
        champion: JSON.parse(fs.readFileSync(path.resolve(__dirname, 'ddragon/champion.json')))
    }
  }
)