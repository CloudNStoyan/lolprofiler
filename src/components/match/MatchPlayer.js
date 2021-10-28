import React from 'react';

function MatchPlayer({ participant, ddragon, onSearch }) {
    const champion = ddragon.champion.find(c => Number(c.key) === participant.championId);

    if (participant.puuid === 'BOT') {
        return (
            <button className="summoner">
                <img
                    className="summoner-champ-icon"
                    src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/champion/${champion.image?.full}`}
                    alt=""
                />
                <div className="summoner-name tooltip-container">
                    {participant.summonerName}
                    <span className="bot-label tooltip">Bot</span>
                    <span className="tooltip-content">This is not a real player.</span>
                </div>
            </button>
        )
    }

    return (
        <button style={{ cursor: 'pointer' }} className="summoner" onClick={() => onSearch(participant.summonerName)}>
            <img className="summoner-champ-icon"
                src={`http://ddragon.leagueoflegends.com/cdn/11.21.1/img/champion/${champion.image?.full}`}
                alt={champion.name}
                title={champion.name}
            />
            <div className="summoner-name">{participant.summonerName}</div>
        </button>
    )
}

export default MatchPlayer;