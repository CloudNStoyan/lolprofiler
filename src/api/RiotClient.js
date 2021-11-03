import SummonerEndpoint from './endpoints/SummonerEndpoint';
import MasteryEndpoint from './endpoints/MasteryEndpoint';
import champion from '../ddragon/data/champion.json';
import item from '../ddragon/data/item.json';
import queues from '../ddragon/data/queues.json';
import runesReforged from '../ddragon/data/runesReforged.json';
import summoner from '../ddragon/data/summoner.json';
import MatchEndpoint from './endpoints/MatchEndpoint';
import LeagueEndpoint from './endpoints/LeagueEndpoint';

class RiotClient {
    constructor(config) {
        this.Summoner = new SummonerEndpoint(config);
        this.Mastery = new MasteryEndpoint(config);
        this.Match = new MatchEndpoint(config);
        this.League = new LeagueEndpoint(config);

        this.DDragon = {
            data: {
                champion: Object.values(champion.data),
                item: item,
                queues: queues,
                runesReforged: runesReforged,
                summoner: Object.values(summoner.data)
            },
            img: {
                tier: (tier) => {
                    return `https://raw.githubusercontent.com/RiotAPI/Riot-Games-API-Developer-Assets/master/tier-icons/${tier}.png`
                }
            }
        }
    }
}

export default RiotClient;