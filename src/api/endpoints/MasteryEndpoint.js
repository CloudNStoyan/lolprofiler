import Endpoint from "./Endpoint";

class MasteryEndpoint extends Endpoint {
    constructor(config) {
        super(config)

        this.config = config;
        this.baseUrl = 'https://eun1.api.riotgames.com/lol/champion-mastery/v4'
    }

    getMasteriesBySummonerId = (encryptedSummonerId) => this.request(`${this.baseUrl}/champion-masteries/by-summoner/${encryptedSummonerId}`);
}

export default MasteryEndpoint;