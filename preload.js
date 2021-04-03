const fs = require('fs');
const path = require('path');

const { contextBridge } = require('electron');

function ddragonJson(fileName) {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, 'ddragon/' + fileName)))
}

contextBridge.exposeInMainWorld(
  'lol',
  {
    api: {
        key: fs.readFileSync(path.resolve(__dirname, 'key.txt')).toString()
    },
    ddragon: {
        champion: ddragonJson('champion.json'),
        queues: ddragonJson('queues.json'),
        summoner: ddragonJson('summoner.json'),
        runesReforged: ddragonJson('runesReforged.json')
    }
  }
)