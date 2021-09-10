const fs = require('fs');
const path = require('path');

const { contextBridge } = require('electron');

let customIO = {
  writeText(filePath, text) {
    fs.writeFileSync(path.resolve(__dirname, filePath), text);
  },
  readText(filePath) {
    return fs.readFileSync(path.resolve(__dirname, filePath)).toString();
  },
  dirExist(dirPath) {
    return fs.existsSync(path.resolve(__dirname, dirPath))
  },
  createDir(dirPath) {
    fs.mkdirSync(path.resolve(__dirname, dirPath));
    return dirPath;
  }
};

let webzephyr = {
  config: {
      version: null,
  },
  staticEndpoints: {
      versions: 'https://ddragon.leagueoflegends.com/api/versions.json',
      regions: 'https://ddragon.leagueoflegends.com/realms/na.json',
      languages: 'https://ddragon.leagueoflegends.com/cdn/languages.json',
      seasons: 'https://static.developer.riotgames.com/docs/lol/seasons.json',
      queues: 'https://static.developer.riotgames.com/docs/lol/queues.json',
      maps: 'https://static.developer.riotgames.com/docs/lol/maps.json',
      gameModes: 'https://static.developer.riotgames.com/docs/lol/gameModes.json',
      gameTypes: 'https://static.developer.riotgames.com/docs/lol/gameTypes.json',
  },
  endpoints: {
      champion: 'champion',
      item: 'item',
      summoner: 'summoner',
      profileIcon: 'profileIcon',
      runesReforged: 'runesReforged'
  },
  async fetchJson(url) {
      return fetch(url).then(response => response.json());
  },
  async setVersionIfNeeded() {
      if (this.config.version == null) {
          this.config.version = await this.getLatestVersion();
      }
  },
  async generateEndpoint(endpoint) {
      await this.setVersionIfNeeded();

      let baseEndpoint = `https://ddragon.leagueoflegends.com/cdn/${this.config.version}/data/en_GB`;

      switch(endpoint) {
          case this.endpoints.champion: return `${baseEndpoint}/champion.json`;
          case this.endpoints.item: return `${baseEndpoint}/item.json`;
          case this.endpoints.summoner: return `${baseEndpoint}/summoner.json`;
          case this.endpoints.profileIcon: return `${baseEndpoint}/profileicon.json`;
          case this.endpoints.runesReforged: return `${baseEndpoint}/runesReforged.json`;
      }

      return null;
  },
  async getLatestVersion() {
      let versions = await this.versions();
      return versions[0];
  },
  async versions() {
      return await this.fetchJson(this.staticEndpoints.versions)
  },
  async regions() {
      return await this.fetchJson(this.staticEndpoints.regions)
  },
  async languages() {
      return await this.fetchJson(this.staticEndpoints.languages)
  },
  async seasons() {
      return await this.fetchJson(this.staticEndpoints.seasons)
  },
  async queues() {
      return await this.fetchJson(this.staticEndpoints.queues)
  },
  async maps() {
      return await this.fetchJson(this.staticEndpoints.maps)
  },
  async gameModes() {
      return await this.fetchJson(this.staticEndpoints.gameModes)
  },
  async gameTypes() {
      return await this.fetchJson(this.staticEndpoints.gameTypes)
  },
  async champion() {
      let endpoint = await this.generateEndpoint(this.endpoints.champion)
      return await this.fetchJson(endpoint);
  },
  async item() {
      let endpoint = await this.generateEndpoint(this.endpoints.item)
      return await this.fetchJson(endpoint);
  },
  async summoner() {
      let endpoint = await this.generateEndpoint(this.endpoints.summoner)
      return await this.fetchJson(endpoint);
  },
  async profileIcon() {
      let endpoint = await this.generateEndpoint(this.endpoints.profileIcon)
      return await this.fetchJson(endpoint);
  },
  async runesReforged() {
      let endpoint = await this.generateEndpoint(this.endpoints.runesReforged)
      return await this.fetchJson(endpoint);
  }
};

let ddragonCache = {
  cacheFolder: 'ddragon/data',
  version: null,
  async downloadDDragonFiles(version) {
      let folder = customIO.createDir(this.cacheFolder + '/' + version);

      //champion
      customIO.writeText(folder + '/champion.json', JSON.stringify(await webzephyr.champion()));

      //item
      customIO.writeText(folder + '/item.json', JSON.stringify(await webzephyr.item()));

      //queues
      customIO.writeText(folder + '/queues.json', JSON.stringify(await webzephyr.queues()));

      //runesReforged
      customIO.writeText(folder + '/runesReforged.json', JSON.stringify(await webzephyr.runesReforged()));

      //summoner
      customIO.writeText(folder + '/summoner.json', JSON.stringify(await webzephyr.summoner()));
  },
  async updateDDragonIfNeeded() {
      let latestVersion = await webzephyr.getLatestVersion();
      this.version = latestVersion;

      if (!customIO.dirExist(this.cacheFolder)) {
        customIO.createDir(this.cacheFolder);
      }

      if (customIO.dirExist(this.cacheFolder + '/' + latestVersion)) {
          return false;
      } else {
          await this.downloadDDragonFiles(latestVersion);
          return true;
      }
  }
};

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(path.resolve(__dirname, filePath)))
}

//function readText(filePath) {
//  return fs.readFileSync(path.resolve(__dirname, filePath)).toString();
//}

function generatePathToDDragon(fileName) {
  return `ddragon/data/${ddragonCache.version}/${fileName}`
}

let config = readJson('config.json');

function exposeLoL() {
  contextBridge.exposeInMainWorld(
    'lol',
    {
      api: {
        devKey: config.keys.development,
        productionKey: config.keys.production
      },
      ddragon: {
        version: ddragonCache.version,
        champion: readJson(generatePathToDDragon('champion.json')),
        queues: readJson(generatePathToDDragon('queues.json')),
        summoner: readJson(generatePathToDDragon('summoner.json')),
        runesReforged: readJson(generatePathToDDragon('runesReforged.json')),
        item: readJson(generatePathToDDragon('item.json'))
      },
      constants: {
        queues: readJson('constants/queues.json'),
        ranked: readJson('constants/ranked.json')
      },
    }
  )
}


(async () => {
  let ddragonDidUpdate = await ddragonCache.updateDDragonIfNeeded();
  if (ddragonDidUpdate) {
    console.log('DDragon files update to: ' + ddragonCache.version);
  }

  exposeLoL();  
})();