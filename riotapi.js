let riotapi = {
    config: {
        apiKey: lol.api.key,
        baseUrl: 'https://eun1.api.riotgames.com/lol',
    },
    async SummonerByName(summonerName) {
        let endpoint = `/summoner/v4/summoners/by-name/${summonerName}?api_key=${this.config.apiKey}`;
        return await this.cachedFetch(endpoint);
    },
    async LeagueBySummonerId(summonerId) {
        let endpoint = `/league/v4/entries/by-summoner/${summonerId}?api_key=${this.config.apiKey}`;
        return await this.cachedFetch(endpoint);
    },
    async MatchlistByAccountId(accountId) {
        let endpoint = `/match/v4/matchlists/by-account/${accountId}?endIndex=10&begindIndex=0&api_key=${this.config.apiKey}`;
        return await this.cachedFetch(endpoint);
    },
    async MatchById(gameId) {
        let endpoint = `/match/v4/matches/${gameId}?api_key=${this.config.apiKey}`;
        return await this.cachedFetch(endpoint);
    },
    async cachedFetch(url) {
        url = this.config.baseUrl + url;
        let cachedResponse = this.APIResponseCache.get(url);
    
        if (cachedResponse) {
            return cachedResponse;
        }
    
        let response = await fetch(url).then(resp => resp.json());
    
        this.APIResponseCache.add(url, response);
    
        return response;
    },
    APIResponseCache: {
        storage: {},
        add(url, response) {
            this.storage[url] = response;
        },
        get(url) {
            return this.storage[url]
        }
    }
}