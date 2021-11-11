import styles from './MatchPlayers.module.scss';
import Tooltip from '../../Tooltip/Tooltip';

function MatchPlayer({ participant, ddragon, onSearch }) {
    const champion = ddragon.champion.find(c => Number(c.key) === participant.championId);

    if (participant.puuid === 'BOT') {
        return (
            <button className={styles.summoner}>
                <img
                    className={styles["champ-icon"]}
                    src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/champion/${champion.image?.full}`}
                    alt=""
                />
                {participant.summonerName}
                <Tooltip className={styles['bot-label']} content="This is not a real player.">Bot</Tooltip>
            </button>
        )
    }

    return (
        <button className={styles.summoner} onClick={() => onSearch(participant.summonerName)}>
            <img className={styles["champ-icon"]}
                src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/champion/${champion.image?.full}`}
            />
            {participant.summonerName}
        </button>
    )
}

export default MatchPlayer;