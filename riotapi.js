let riotapi = {
    config: {
        productionKey: lol.api.productionKey,
        devKey: lol.api.devKey,
        baseUrl: 'https://eun1.api.riotgames.com/lol',
    },
    async SummonerByName(summonerName) {
        let endpoint = `/summoner/v4/summoners/by-name/${summonerName}`;
        return await this.cachedFetch(endpoint, true, false);
    },
    async LeagueBySummonerId(summonerId) {
        let endpoint = `/league/v4/entries/by-summoner/${summonerId}`;
        return await this.cachedFetch(endpoint);
    },
    async MatchlistByAccountId(accountId, beginIndex = 0, endIndex = 10) {
        let endpoint = `/match/v4/matchlists/by-account/${accountId}?beginIndex=${beginIndex}&endIndex=${endIndex}`;
        return await this.cachedFetch(endpoint);
    },
    async MatchById(gameId) {
        let endpoint = `/match/v4/matches/${gameId}`;
        return await this.cachedFetch(endpoint);
    },
    async V5MatchlistByPUUID(puuid, start = 0, count = 10, queue = null) {
        let endpoint = `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`;

        if (queue) {
            endpoint += `&queue=${queue}`
        }

        return await this.cachedFetch(endpoint, false);
    },
    async V5MatchById(gameId) {
        let endpoint = `https://europe.api.riotgames.com/lol/match/v5/matches/${gameId}`;
        return await this.cachedFetch(endpoint, false, false);
    },
    async MasteryBySummonerId(summonerId) {
        let endpoint = `/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}`
        return await this.cachedFetch(endpoint);
    },
    async SpectatorV4BySummonerId(summonerId) {
        let endpoint = `/spectator/v4/active-games/by-summoner/${summonerId}`
        return await this.cachedFetch(endpoint, true, true, false);
    },
    async cachedFetch(url, useBaseUrl = true, parseResponseAsJson = true, useCache = true) {
        if (useBaseUrl) {
            url = this.config.baseUrl + url;
        }

        let cachedResponse = this.APIResponseCache.get(url);
    
        if (cachedResponse) {
            return cachedResponse;
        }

        let config = {
            method: 'GET',
            headers: {
                'X-Riot-Token': this.config.devKey
            }
        }
    
        let response = await fetch(url, config).then(response => parseResponseAsJson ? response.json() : {status: response.status, json: response.json(), url: url, urlSegments: url.split('/')});

        if (response.status > 400) {
            return response;
        }
    
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