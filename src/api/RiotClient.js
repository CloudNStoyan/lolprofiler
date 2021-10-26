import SummonerEndpoint from './endpoints/SummonerEndpoint'
import MasteryEndpoint from './endpoints/MasteryEndpoint'

class RiotClient {
    constructor(config) {
        this.Summoner = new SummonerEndpoint(config);
        this.Mastery = new MasteryEndpoint(config);
    }
}

export default RiotClient;