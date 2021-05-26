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

        switch(endpoint) {
            case this.endpoints.champion: return `https://ddragon.leagueoflegends.com/cdn/${this.config.version}/data/en_GB/champion.json`;
            case this.endpoints.item: return `https://ddragon.leagueoflegends.com/cdn/${this.config.version}/data/en_GB/item.json`
            case this.endpoints.summoner: return `https://ddragon.leagueoflegends.com/cdn/${this.config.version}/data/en_GB/summoner.json`
            case this.endpoints.profileIcon: return `https://ddragon.leagueoflegends.com/cdn/${this.config.version}/data/en_GB/profileicon.json`
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
}