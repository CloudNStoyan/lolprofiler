import Endpoint from "./Endpoint";

class MatchEndpoint extends Endpoint {
    constructor(config) {
        super(config)

        this.config = config;
        this.baseUrl = 'https://europe.api.riotgames.com/lol/match/v5/matches'
    }

    getSummonerMatches = (puuid, offset = 0, limit = 5) => this.request(`${this.baseUrl}/by-puuid/${puuid}/ids?start=${offset}&count=${limit}`);
    getMatchById = (matchId) => this.request(`${this.baseUrl}/${matchId}`);
}

export default MatchEndpoint;