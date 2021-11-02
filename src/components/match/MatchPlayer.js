import React from 'react';
import styles from '../css/MatchPlayers.module.scss';

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
                <div className="tooltip-container">
                    {participant.summonerName}
                    <span className="bot-label tooltip">Bot</span>
                    <span className="tooltip-content">This is not a real player.</span>
                </div>
            </button>
        )
    }

    return (
        <button className={styles.summoner} onClick={() => onSearch(participant.summonerName)}>
            <img className={styles["champ-icon"]}
                src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/champion/${champion.image?.full}`}
                alt={champion.name}
                title={champion.name}
            />
            <div>{participant.summonerName}</div>
        </button>
    )
}

export default MatchPlayer;