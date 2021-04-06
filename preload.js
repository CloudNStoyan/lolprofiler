const fs = require('fs');
const path = require('path');

const { contextBridge } = require('electron');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, filePath)))
}

function readText(filePath) {
  return fs.readFileSync(path.resolve(__dirname, filePath)).toString();
}

contextBridge.exposeInMainWorld(
  'lol',
  {
    api: {
      key: readText('key.txt')
    },
    ddragon: {
      champion: readJson('ddragon/champion.json'),
      queues: readJson('ddragon/queues.json'),
      summoner: readJson('ddragon/summoner.json'),
      runesReforged: readJson('ddragon/runesReforged.json'),
      item: readJson('ddragon/item.json')
    },
    constants: {
      queues: readJson('constants/queues.json')
    },
  }
)