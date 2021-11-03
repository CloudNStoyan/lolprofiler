import Endpoint from "./Endpoint";

class LeagueEndpoint extends Endpoint {
    constructor(config) {
        super(config)

        this.config = config;
        this.baseUrl = 'https://eun1.api.riotgames.com/lol/league/v4'
    }

    getLeagueEntriesBySummonerId = (encryptedSummonerId) => this.request(`${this.baseUrl}/entries/by-summoner/${encryptedSummonerId}`);
}

export default LeagueEndpoint;