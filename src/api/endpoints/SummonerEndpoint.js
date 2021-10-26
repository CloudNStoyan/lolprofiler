import Endpoint from './Endpoint'

class SummonerEndpoint extends Endpoint {
    constructor(config) {
        super(config);

        this.baseUrl = '/lol/summoner/v4/summoners';
    }

    getByName = (summonerName) => this.request(`${this.baseUrl}/by-name/${summonerName}`);
    getByAccount = (encryptedAccountId) => this.request(`${this.baseUrl}/by-account/${encryptedAccountId}`);
    getByPuuid = (encryptedPuuid) => this.request(`${this.baseUrl}/by-puuid/${encryptedPuuid}`);
    getById = (encryptedSummonerId) => this.request(`${this.baseUrl}/${encryptedSummonerId}`);
}

export default SummonerEndpoint;